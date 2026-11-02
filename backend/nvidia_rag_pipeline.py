import os
import re
import json
import logging
from typing import Optional, List, Dict, Any, Tuple
from dotenv import load_dotenv

# Ensure environment variables are loaded
_backend_dir = os.path.dirname(os.path.abspath(__file__))
_backend_env = os.path.join(_backend_dir, ".env")
if os.path.exists(_backend_env):
    load_dotenv(_backend_env)
load_dotenv()

# Configure logger
logger = logging.getLogger("nvidia_rag")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] [NVIDIA_RAG] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Configuration Constants
DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-bolt-e4b"
DEFAULT_MAX_DISTANCE = 0.65  # Equivalent to minimum similarity score of 0.35

GROUNDED_FALLBACK_KANNADA = "ಕ್ಷಮಿಸಿ, ಈ ಮಾಹಿತಿಯು ನಮ್ಮ ಪ್ರಾದೇಶಿಕ ದತ್ತಾಂಶದಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ."


def clean_pure_kannada(text: str) -> str:
    """
    Cleans RAG answer to ensure 100% pure Kannada output:
    1. Removes chunk citations (e.g. '(chunk_1)', '[chunk_4]', 'chunk_1').
    2. Strips internal metadata labels, corpus headers, and English phrases.
    3. Removes English parentheticals (e.g. '(Feast)', '(A lot / Awesome)').
    4. Normalizes punctuation and whitespace.
    """
    if not text:
        return ""

    # 1. Strip chunk references e.g. (chunk_1), (chunk_4), chunk_1
    text = re.sub(r'[\(\[\{]?\s*chunk_\d+\s*[\)\]\}]?', '', text, flags=re.IGNORECASE)

    # 2. Strip English metadata prefixes and labels
    metadata_patterns = [
        r'\(\s*Regional dialect word:[^\)]*\)',
        r'\(\s*Regional Kannada example:[^\)]*\)',
        r'\(\s*Regional or colloquial form:[^\)]*\)',
        r'\(\s*Standard Kannada:[^\)]*\)',
        r'\(\s*English meaning:[^\)]*\)',
        r'Regional dialect word:[^\n.]*',
        r'Regional Kannada example:[^\n.]*',
        r'Standard Kannada:[^\n.]*',
        r'English meaning:[^\n.]*',
        r'Meaning/context:[^\n.]*',
        r'Project region:[^\n.]*',
        r'Theme:[^\n.]*',
        r'Caveat:[^\n.]*',
        r'Bookish/standard Kannada source:\s*',
        r'Dharwad-labelled target form:\s*',
        r'Corpus category:[^\n.]*',
        r'Document/topic:[^\n.]*',
        r'Meaning:\s*',
    ]
    for pat in metadata_patterns:
        text = re.sub(pat, '', text, flags=re.IGNORECASE)

    # 3. Strip parentheses or brackets containing only English/Latin characters
    for _ in range(3):
        text = re.sub(r'\(\s*[A-Za-z0-9\s/,\?!_.:;\'"-]+\s*\)', '', text)
        text = re.sub(r'\[\s*[A-Za-z0-9\s/,\?!_.:;\'"-]+\s*\]', '', text)

    # 4. Remove any remaining Latin/English word sequences (2 or more letters)
    text = re.sub(r'[A-Za-z]{2,}[A-Za-z0-9\s/,\?!_.:;\'"-]*', '', text)

    # 5. Clean up duplicate spaces and dangling punctuation
    text = re.sub(r'\s{2,}', ' ', text)
    text = re.sub(r'\s+([.,!?])', r'\1', text)
    text = re.sub(r'([.,!?])\s*\1+', r'\1', text)
    text = re.sub(r'\(\s*\)', '', text)
    text = re.sub(r'\[\s*\]', '', text)
    text = re.sub(r'[\(\)\[\]:;\.,]+\s*$', '.', text)
    text = re.sub(r'^\s*[:;,\.\-]+\s*', '', text)
    text = re.sub(r'\s*\.\s*\.', '.', text)
    return text.strip()


class NvidiaNimClient:
    """
    Manages interaction with the NVIDIA NIM API (https://integrate.api.nvidia.com/v1)
    using the OpenAI SDK with zero temperature for deterministic, hallucination-free generation.
    """

    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY", "").strip()
        self.base_url = os.getenv("NVIDIA_BASE_URL", DEFAULT_NVIDIA_BASE_URL).strip()
        self.model = os.getenv("NVIDIA_MODEL", DEFAULT_NVIDIA_MODEL).strip()
        self._client = None

        if self.api_key:
            try:
                from openai import OpenAI
                self._client = OpenAI(base_url=self.base_url, api_key=self.api_key, timeout=5.0, max_retries=0)
                logger.info(f"NVIDIA NIM client initialized with model '{self.model}' at '{self.base_url}'")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client for NVIDIA NIM: {e}")

    def is_available(self) -> bool:
        return bool(self.api_key and self._client)

    def _parse_json_response(self, text: Optional[str]) -> Dict[str, Any]:
        if not text:
            return {}
        clean = text.strip()
        try:
            return json.loads(clean)
        except Exception:
            pass

        # Regex extract JSON object enclosed in { ... }
        match = re.search(r'(\{[\s\S]*\})', clean)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
        return {}

    def normalize_query(self, query: str, region_hint: Optional[str] = None) -> Dict[str, Any]:
        """
        Stage A: Pre-Retrieval Query Normalizer.
        Converts Kanglish/colloquial text to search keywords without answering the question.
        Returns: {"search_query": str, "keywords": List[str], "region_filter": Optional[str]}
        """
        if not self.is_available():
            logger.info("NVIDIA NIM API key not configured or client unavailable. Using rule-based normalizer.")
            return {}

        system_prompt = (
            "You are a Pre-Retrieval Query Normalizer for a regional Kannada language explorer dataset.\n"
            "Your task is to analyze user queries (which may be in Kannada script, Kanglish/Latin transliteration, or English) "
            "and extract clean, searchable keywords.\n\n"
            "STRICT RULES:\n"
            "1. NEVER answer the user's question.\n"
            "2. Convert colloquial words, dialect terms, or transliterated Kanglish into canonical search queries and key search terms.\n"
            "3. If the user writes in Kanglish or English (e.g. 'bozza', 'bojja', 'masth', 'hyang', 'oota', 'enu'), "
            "ALWAYS transcribe and include their authentic Kannada script forms (e.g. 'ಬೊಜ್ಜ', 'ಮಸ್ತ್', 'ಹ್ಯಾಂಗ', 'ಊಟ', 'ಏನು') "
            "in both 'search_query' and 'keywords'!\n"
            "4. Detect any regional/district reference: 'uttara_kalyana', 'tungabhadra_belt', 'krishna_valley', "
            "'hubballi_heartland', 'karavali_coast', 'malnad_ghats', 'bayalu_seeme', 'kaveri_basin', 'dakshina_ghats', "
            "'kolar_bengaluru', or Kannada region names like 'ಉತ್ತರ ಕಲ್ಯಾಣ', 'ಕರಾವಳಿ', 'ಧಾರವಾಡ', or null if unspecified.\n"
            "5. Output ONLY a valid JSON object with keys: 'search_query', 'keywords', 'region_filter'.\n"
            'Example output: {"search_query": "ಊಟ ಆಯ್ತಾ", "keywords": ["ಊಟ", "ಉಂಡೀರಾ", "ಊಟ ಆಯ್ತಾ"], "region_filter": "ಉತ್ತರ ಕಲ್ಯಾಣ"}'
        )

        user_content = f"User Query: {query}"
        if region_hint:
            user_content += f"\nUser Region Context: {region_hint}"

        for attempt_model in [self.model, "nvidia/nemotron-3.5-bolt-e4b"]:
            try:
                response = self._client.chat.completions.create(
                    model=attempt_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content},
                    ],
                    temperature=0.0,
                    top_p=1.0,
                    max_tokens=256,
                )
                raw_text = response.choices[0].message.content or ""
                data = self._parse_json_response(raw_text)
                if data:
                    logger.info(f"Stage A Normalizer LLM Output: {data}")
                    return data
            except Exception as err:
                logger.warning(f"Stage A Normalizer LLM call failed with model '{attempt_model}': {err}")
                if "410" not in str(err) and attempt_model == "nvidia/nemotron-3.5-bolt-e4b":
                    break

        return {}

    def generate_grounded_answer(self, query: str, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Stage C: Context-Locked Generation & Citation Verification.
        Answers ONLY from the provided RAG chunks in 100% pure Kannada.
        Output schema: {"answer": str, "used_source_ids": List[str], "grounded": bool}
        """
        if not self.is_available():
            logger.info("NVIDIA NIM API key not configured for generation. Using deterministic generator.")
            return {}

        formatted_context = []
        for c in chunks:
            formatted_context.append({
                "id": c["id"],
                "content": c["text"],
                "region": c.get("region", ""),
                "similarity_score": round(c.get("score", 0.0), 3),
            })

        system_prompt = (
            "You are a strictly grounded, context-locked dialect language assistant for Swara-Setu "
            "(Karnataka Regional Language Explorer).\n\n"
            "STRICT GROUNDING & LANGUAGE RULES:\n"
            "1. Answer ONLY using the facts, dialect words, meanings, and regional details explicitly present in RAG_CONTEXT.\n"
            "2. NEVER use outside knowledge, pre-trained knowledge, general facts, or assumptions, "
            "even if you know the Kannada word or concept.\n"
            "3. PURE KANNADA ONLY: The 'answer' string MUST be 100% in natural, fluent Kannada script. "
            "NEVER include English translations, English words, Latin script, or parenthetical English terms "
            "(e.g., do NOT write '(Feast)', '(A lot / Awesome)', or English labels).\n"
            "4. NO INTERNAL METADATA OR CHUNK CITATIONS IN THE ANSWER: NEVER write 'chunk_1', 'chunk_2', 'chunk_4', "
            "'chunk', 'RAG', or 'dataset' inside the 'answer' text. Citations belong ONLY in the 'used_source_ids' array.\n"
            "5. If RAG_CONTEXT contains the answer, explain it politely in clean Kannada only, "
            "cite which chunk ID(s) were used in 'used_source_ids', and set 'grounded': true.\n"
            "6. If RAG_CONTEXT does NOT directly and explicitly contain the answer, you MUST set 'grounded': false "
            "and 'used_source_ids': []. Do NOT attempt to answer or guess.\n"
            "7. Output ONLY a valid JSON object matching this schema:\n"
            '{\n  "answer": "ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಸ್ಪಷ್ಟ ಮತ್ತು ಅಧಿಕೃತ ವಿವರಣೆ",\n  "used_source_ids": ["chunk_1"],\n  "grounded": true\n}'
        )

        user_content = (
            f"User Question: {query}\n\n"
            f"RAG_CONTEXT:\n{json.dumps(formatted_context, ensure_ascii=False, indent=2)}"
        )

        for attempt_model in [self.model, "nvidia/nemotron-3.5-bolt-e4b"]:
            try:
                response = self._client.chat.completions.create(
                    model=attempt_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content},
                    ],
                    temperature=0.0,
                    top_p=1.0,
                    max_tokens=512,
                )
                raw_text = response.choices[0].message.content or ""
                data = self._parse_json_response(raw_text)
                if data:
                    logger.info(f"Stage C Generation LLM Output: {data}")
                    return data
            except Exception as err:
                logger.warning(f"Stage C Generation LLM call failed with model '{attempt_model}': {err}")
                if "410" not in str(err) and attempt_model == "nvidia/nemotron-3.5-bolt-e4b":
                    break

        return {}


class ContextLockedRAGPipeline:
    """
    3-Stage Context-Locked RAG Engine:
    Stage A -> Pre-Retrieval Query Normalizer
    Stage B -> Hybrid Retrieval + Hard Similarity Gatekeeper
    Stage C -> Context-Locked Generation & Verification
    """

    def __init__(self, df_dataset, bm25_engine, region_metadata_map, regional_lexicon_kb):
        self.df_dataset = df_dataset
        self.bm25_engine = bm25_engine
        self.region_metadata_map = region_metadata_map
        self.regional_lexicon_kb = regional_lexicon_kb
        self.nim_client = NvidiaNimClient()
        self.max_distance = float(os.getenv("RAG_MAX_DISTANCE", str(DEFAULT_MAX_DISTANCE)))

    def stage_a_normalize(self, raw_query: str, region_arg: Optional[str] = None, district_arg: Optional[str] = None) -> Dict[str, Any]:
        """
        Stage A: Normalizes input query using NVIDIA LLM, with fallback to rule-based feature extractor.
        """
        region_hint = district_arg or region_arg or ""
        llm_norm = self.nim_client.normalize_query(raw_query, region_hint=region_hint)

        search_query = llm_norm.get("search_query") or raw_query
        keywords = llm_norm.get("keywords") or []
        region_filter = llm_norm.get("region_filter") or None

        # Clean/resolve region filter to standard canonical names if present
        if region_filter:
            rf_clean = region_filter.strip().lower()
            if rf_clean in self.region_metadata_map:
                region_filter = self.region_metadata_map[rf_clean]

        # Extract rule-based fallback tokens & keywords
        q_tokens = [w for w in re.findall(r'[\u0C80-\u0CFF\w]+', search_query) if len(w) >= 2]
        if not keywords:
            keywords = q_tokens
        else:
            # Merge unique tokens
            for t in q_tokens:
                if t not in keywords:
                    keywords.append(t)

        # Quoted phrase extraction
        quoted_match = re.search(r'["\']([^"\']+)["\']', raw_query)
        quoted = quoted_match.group(1).strip() if quoted_match else ""

        result = {
            "raw_query": raw_query,
            "search_query": search_query,
            "keywords": keywords,
            "quoted": quoted,
            "region_filter": region_filter or self._resolve_region(raw_query, region_arg, district_arg),
        }
        logger.info(f"Stage A Result: normalized_query='{search_query}', keywords={keywords}, region='{result['region_filter']}'")
        return result

    def _resolve_region(self, query: str, region_arg: Optional[str] = None, district_arg: Optional[str] = None) -> Optional[str]:
        candidates = []
        if district_arg:
            candidates.append(district_arg.strip().lower())
        if region_arg:
            candidates.append(region_arg.strip().lower())

        for c in candidates:
            if c in self.region_metadata_map:
                return self.region_metadata_map[c]

        q_lower = query.lower()
        for kw, reg_name in self.region_metadata_map.items():
            if kw in q_lower:
                return reg_name
        return None

    def stage_b_retrieve_and_gatekeep(self, norm_data: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], bool, str]:
        """
        Stage B: Hybrid Retrieval + Hard Similarity Gatekeeper.
        Retrieves candidate chunks using exact substring match & BM25.
        Enforces cutoff threshold RAG_MAX_DISTANCE.
        Returns: (surviving_chunks, is_passed, reason)
        """
        keywords = norm_data["keywords"]
        quoted = norm_data["quoted"]
        search_query = norm_data["search_query"]
        target_region = norm_data["region_filter"]

        candidate_chunks = []
        seen_texts = set()

        # Target regional subset if specified
        sub_df = self.df_dataset
        if target_region:
            reg_df = self.df_dataset[self.df_dataset["region_name"] == target_region]
            if len(reg_df) > 0:
                sub_df = reg_df

        # 1. Exact quoted match
        if quoted:
            m = sub_df[sub_df["retrieval_text"].str.contains(re.escape(quoted), na=False)]
            if len(m) == 0:
                m = self.df_dataset[self.df_dataset["retrieval_text"].str.contains(re.escape(quoted), na=False)]
            for _, row in m.head(3).iterrows():
                txt = row["retrieval_text"]
                if txt not in seen_texts:
                    seen_texts.add(txt)
                    candidate_chunks.append({
                        "text": txt,
                        "region": row.get("region_name", target_region or ""),
                        "score": 1.0,
                        "distance": 0.0,
                        "match_type": "exact_quoted",
                    })

        # 2. Exact keyword / substring match across candidate keywords
        ENGLISH_FILLER_WORDS = {
            "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "was", "are", "were",
            "who", "what", "where", "when", "how", "why", "won", "cup", "did", "does", "with",
            "from", "by", "this", "that", "it", "they", "them", "he", "she", "his", "her", "tell",
            "me", "give", "you", "your", "can", "could", "would", "should", "will"
        }
        for kw in keywords:
            # Skip English filler words that collide with dataset metadata
            if not re.search(r'[\u0C80-\u0CFF]', kw):
                if kw.lower() in ENGLISH_FILLER_WORDS or len(kw) < 4:
                    continue
            elif len(kw) < 2:
                continue
            # Whole word or substring pattern
            pattern = re.escape(kw)
            matches = sub_df[sub_df["retrieval_text"].str.contains(pattern, na=False)]
            if len(matches) == 0 and len(sub_df) < len(self.df_dataset):
                matches = self.df_dataset[self.df_dataset["retrieval_text"].str.contains(pattern, na=False)]

            for _, row in matches.head(2).iterrows():
                txt = row["retrieval_text"]
                if txt not in seen_texts:
                    seen_texts.add(txt)
                    candidate_chunks.append({
                        "text": txt,
                        "region": row.get("region_name", target_region or ""),
                        "score": 0.92,
                        "distance": 0.08,
                        "match_type": f"keyword_exact:{kw}",
                    })

        # 3. Direct Regional Lexicon KB lookup
        for kw in keywords:
            if kw in self.regional_lexicon_kb:
                info = self.regional_lexicon_kb[kw]
                clean_meaning = re.sub(r'\s*\([A-Za-z0-9\s/,\?!_.:;\'"-]+\)', '', info['meaning']).strip()
                clean_std = re.sub(r'\s*\([A-Za-z0-9\s/,\?!_.:;\'"-]+\)', '', info['standard']).strip()
                lex_text = (
                    f"ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಯ ಪದ: '{kw}'. ಅರ್ಥ: {clean_meaning}. "
                    f"ಪ್ರಮಾಣಿತ ಕನ್ನಡ ರೂಪ: {clean_std}. ಪ್ರದೇಶ: {info['region']}."
                )
                if lex_text not in seen_texts:
                    seen_texts.add(lex_text)
                    candidate_chunks.append({
                        "text": lex_text,
                        "region": info["region"],
                        "score": 1.0,
                        "distance": 0.0,
                        "match_type": "direct_lexicon_kb",
                    })

        # 4. BM25 Semantic Retrieval
        if self.bm25_engine and keywords:
            try:
                candidate_indices = sub_df.index.tolist() if len(sub_df) < len(self.df_dataset) else None
                top_idx, bm25_score = self.bm25_engine.get_top_match(keywords, candidate_indices)
                if top_idx is not None and bm25_score >= 3.0:
                    matched_row = self.df_dataset.loc[top_idx]
                    txt = matched_row["retrieval_text"]
                    if txt not in seen_texts:
                        seen_texts.add(txt)
                        # Normalize BM25 score to 0.4 - 0.9 range
                        norm_score = min(0.90, max(0.40, 0.5 + (bm25_score / 35.0)))
                        candidate_chunks.append({
                            "text": txt,
                            "region": matched_row.get("region_name", target_region or ""),
                            "score": float(norm_score),
                            "distance": round(1.0 - norm_score, 3),
                            "match_type": f"bm25_score_{round(bm25_score, 2)}",
                        })
            except Exception as err:
                logger.warning(f"BM25 retrieval exception: {err}")

        # Gatekeeper evaluation: filter by RAG_MAX_DISTANCE
        surviving_chunks = []
        for idx, chunk in enumerate(candidate_chunks, start=1):
            dist = chunk.get("distance", 1.0 - chunk.get("score", 0.0))
            if dist <= self.max_distance:
                chunk["id"] = f"chunk_{idx}"
                surviving_chunks.append(chunk)

        # Sort by score descending and take top 4
        surviving_chunks.sort(key=lambda x: x["score"], reverse=True)
        surviving_chunks = surviving_chunks[:4]

        # Re-index chunk IDs from 1 to N
        for i, c in enumerate(surviving_chunks, start=1):
            c["id"] = f"chunk_{i}"

        # Log Gatekeeper status
        chunk_log = [f"{c['id']}(dist={c['distance']}, match={c['match_type']})" for c in surviving_chunks]
        logger.info(f"Stage B Gatekeeper: {len(surviving_chunks)} surviving chunks -> {chunk_log}")

        # HARD GATEKEEPER RULE: If zero chunks pass the similarity threshold, block generation
        if not surviving_chunks:
            logger.warning("Stage B Gatekeeper BLOCKED: Zero chunks met the similarity threshold. Skipping LLM Call 2.")
            return [], False, "hard_gatekeeper_blocked"

        return surviving_chunks, True, "gatekeeper_passed"

    def stage_c_generate_and_verify(self, user_q: str, surviving_chunks: List[Dict[str, Any]], norm_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Stage C: Context-Locked Generation & Programmatic Citation Verification.
        """
        # If NVIDIA NIM client is available, call LLM 2
        if self.nim_client.is_available():
            llm_result = self.nim_client.generate_grounded_answer(user_q, surviving_chunks)

            # Programmatic Post-Check
            is_grounded = bool(llm_result.get("grounded", False))
            used_ids = llm_result.get("used_source_ids", [])
            valid_chunk_ids = {c["id"] for c in surviving_chunks}

            # Must be marked grounded and cite at least one verified chunk ID
            has_valid_citations = bool(used_ids and all(cid in valid_chunk_ids for cid in used_ids))

            if llm_result:
                is_grounded = bool(llm_result.get("grounded", False))
                used_ids = llm_result.get("used_source_ids", [])
                valid_chunk_ids = {c["id"] for c in surviving_chunks}
                has_valid_citations = bool(used_ids and all(cid in valid_chunk_ids for cid in used_ids))

                if is_grounded and has_valid_citations and llm_result.get("answer"):
                    raw_ans = llm_result["answer"].strip()
                    pure_ans = clean_pure_kannada(raw_ans)
                    logger.info(f"Stage C Verification PASSED. Sources used: {used_ids}")
                    used_sources = [c for c in surviving_chunks if c["id"] in used_ids]
                    return {
                        "answer": pure_ans,
                        "grounded": True,
                        "sources": used_sources,
                        "source": f"nvidia_nim_{used_ids[0]}",
                        "score": round(max(c["score"] for c in used_sources), 3),
                        "region_filtered": norm_data.get("region_filter"),
                        "method": "nvidia_nim_context_locked",
                    }
                else:
                    logger.warning(f"Stage C LLM evaluated ungrounded or citations missing: {used_ids}")
                    return {
                        "answer": GROUNDED_FALLBACK_KANNADA,
                        "grounded": False,
                        "sources": [],
                        "source": "citation_verification_failed",
                        "score": 0.0,
                        "region_filtered": norm_data.get("region_filter"),
                        "method": "verification_override",
                    }

        # Deterministic Grounded Generation (When LLM is unavailable or timed out)
        logger.info("Executing deterministic context-locked generation in pure Kannada.")
        best_chunk = surviving_chunks[0]
        text = best_chunk["text"]
        region = best_chunk.get("region") or norm_data.get("region_filter") or "ಕರ್ನಾಟಕ"
        if "Dharwad" in region:
            region = "ಧಾರವಾಡ"

        # Check if direct lexicon KB
        if best_chunk["match_type"] == "direct_lexicon_kb":
            m_kw = re.search(r"ಪದ:\s*'([^']+)'", text)
            m_mean = re.search(r"ಅರ್ಥ:\s*([^.]+)\.", text)
            m_std = re.search(r"ಪ್ರಮಾಣಿತ ಕನ್ನಡ ರೂಪ:\s*([^.]+)\.", text)
            kw_w = m_kw.group(1).strip() if m_kw else ""
            mean_w = m_mean.group(1).strip() if m_mean else ""
            std_w = m_std.group(1).strip() if m_std else ""

            if kw_w and mean_w:
                std_txt = f' (ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ: "{std_w}")' if std_w else ""
                answer = f'ಖಂಡಿತ! {region} ಉಪಭಾಷೆಯಲ್ಲಿ "{kw_w}" ಎಂದರೆ "{mean_w}" ಅಂತ ಅರ್ಥ{std_txt}.'
            else:
                answer = f"ಖಂಡಿತ! {best_chunk['text']}"
        elif "Regional or colloquial form:" in text:
            m_reg = re.search(r"Regional or colloquial form:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            m_std = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            reg_w = m_reg.group(1).strip() if m_reg else ""
            std_w = m_std.group(1).strip() if m_std else ""

            if reg_w:
                std_part = f' (ಪ್ರಮಾಣಿತ ರೂಪ: "{std_w}")' if std_w else ""
                answer = f'ಖಂಡಿತ! {region} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{reg_w}" ಎಂದು ಹೇಳುತ್ತಾರೆ{std_part}.'
            else:
                answer = f'{region} ಶೈಲಿಯಲ್ಲಿ: {text}'
        else:
            answer = f'{region} ಶೈಲಿಯಲ್ಲಿ: {text}'

        pure_ans = clean_pure_kannada(answer)

        return {
            "answer": pure_ans,
            "grounded": True,
            "sources": [best_chunk],
            "source": f"grounded_{best_chunk['id']}",
            "score": round(best_chunk["score"], 3),
            "region_filtered": region,
            "method": "deterministic_context_locked",
        }

    def execute(self, raw_query: str, region: Optional[str] = None, district: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes the full 3-Stage Context-Locked Pipeline:
        Stage A -> Normalize
        Stage B -> Retrieve & Gatekeep (Hard threshold)
        Stage C -> Generate & Verify citations
        """
        user_q = raw_query.strip()
        if not user_q:
            return {"error": "ಖಾಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ (Empty question).", "grounded": False, "sources": []}

        # Stage A: Pre-Retrieval Query Normalization
        norm_data = self.stage_a_normalize(user_q, region_arg=region, district_arg=district)

        # Stage B: Hybrid Retrieval + Hard Similarity Gatekeeper
        surviving_chunks, is_passed, reason = self.stage_b_retrieve_and_gatekeep(norm_data)

        # Hard Gatekeeper Rule: zero chunks -> immediate fallback, zero LLM generation
        if not is_passed or not surviving_chunks:
            return {
                "answer": GROUNDED_FALLBACK_KANNADA,
                "grounded": False,
                "sources": [],
                "source": "hard_gatekeeper",
                "score": 0.0,
                "region_filtered": norm_data.get("region_filter"),
                "method": reason,
            }

        # Stage C: Context-Locked Generation & Citation Verification
        result = self.stage_c_generate_and_verify(user_q, surviving_chunks, norm_data)
        return result
