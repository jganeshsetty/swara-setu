import sys
sys.stdout.reconfigure(encoding="utf-8")
import re
import pandas as pd
from typing import Optional, List, Dict, Tuple

# Load dataset for BM25/keyword indexing
DATASET_CSV = "final_best_kannada_rag_dataset.csv"
df = pd.read_csv(DATASET_CSV)

REGION_METADATA_MAP: Dict[str, str] = {
    "dharwad": "Dharwad-labelled (source dataset label)",
    "ಧಾರವಾಡ": "Dharwad-labelled (source dataset label)",
    "hubballi": "Dharwad-labelled (source dataset label)",
    "hubli": "Dharwad-labelled (source dataset label)",
    "ಹುಬ್ಬಳ್ಳಿ": "Dharwad-labelled (source dataset label)",
    "gadag": "Dharwad-labelled (source dataset label)",
    "ಗದಗ": "Dharwad-labelled (source dataset label)",
    "haveri": "Dharwad-labelled (source dataset label)",
    "ಹಾವೇರಿ": "Dharwad-labelled (source dataset label)",
    "hubballi_heartland": "Dharwad-labelled (source dataset label)",
    "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ": "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ",

    "uttara_kalyana": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಉತ್ತರ ಕಲ್ಯಾಣ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "bidar": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಬೀದರ್": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "kalaburagi": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "gulbarga": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಕಲಬುರಗಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "yadgir": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಯಾದಗಿರಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",

    "tungabhadra_belt": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ತುಂಗಭದ್ರಾ ತೀರ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "raichur": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ರಾಯಚೂರು": "ತುಂಗಭದ್ರಾ ತೀರ",
    "koppal": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ಕೊಪ್ಪಳ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ballari": "ತುಂಗಭದ್ರಾ ತೀರ",
    "bellary": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ಬಳ್ಳಾರಿ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "vijayanagara": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ವಿಜಯನಗರ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "hampi": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ಹಂಪಿ": "ತುಂಗಭದ್ರಾ ತೀರ",

    "krishna_valley": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "ಕೃಷ್ಣಾ ಕಣಿವೆ": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "belagavi": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "belgaum": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "ಬೆಳಗಾವಿ": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "bagalkote": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "ಬಾಗಲಕೋಟೆ": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "vijayapura": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "bijapur": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "ವಿಜಯಪುರ": "ಕೃಷ್ಣಾ ಕಣಿವೆ",

    "karavali_coast": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಕರಾವಳಿ ಕರ್ನಾಟಕ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "coastal": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "mangaluru": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "mangalore": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಮಂಗಳೂರು": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "udupi": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಉಡುಪಿ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "dakshina kannada": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ದಕ್ಷಿಣ ಕನ್ನಡ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "uttara kannada": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಉತ್ತರ ಕನ್ನಡ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",

    "malnad_ghats": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಮಲೆನಾಡು ಗಿರಿಧಾಮ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "shivamogga": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "shimoga": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಶಿವಮೊಗ್ಗ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "chikkamagaluru": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಚಿಕ್ಕಮಗಳೂರು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "kodagu": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಕೊಡಗು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",

    "bayalu_seeme": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "davanagere": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ದಾವಣಗೆರೆ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "chitradurga": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ಚಿತ್ರದುರ್ಗ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "tumakuru": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ತುಮಕೂರು": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",

    "kaveri_basin": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಕಾವೇರಿ ಕಣಿವೆ": "ಕಾವೇರಿ ಕಣಿವೆ",
    "old mysore": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಹಳೇ ಮೈಸೂರು": "ಕಾವೇರಿ ಕಣಿವೆ",
    "mysuru": "ಕಾವೇರಿ ಕಣಿವೆ",
    "mysore": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಮೈಸೂರು": "ಕಾವೇರಿ ಕಣಿವೆ",
    "mandya": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಮಂಡ್ಯ": "ಕಾವೇರಿ ಕಣಿವೆ",
    "chamarajanagara": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಚಾಮರಾಜನಗರ": "ಕಾವೇರಿ ಕಣಿವೆ",

    "dakshina_ghats": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "hassan": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ಹಾಸನ": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ramanagara": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ರಾಮನಗರ": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",

    "kolar_bengaluru": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "bengaluru": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "bangalore": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "ಬೆಂಗಳೂರು": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "kolar": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "ಕೋಲಾರ": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "chikkaballapura": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "ಚಿಕ್ಕಬಳ್ಳಾಪುರ": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
}

STOPWORDS = {
    "ಎಂದು", "ಅಂತ", "ಹೇಗೆ", "ಹ್ಯಾಂಗೆ", "ಹೇಳ್ತಾರೆ", "ಕೇಳ್ತಾರೆ", "ಅನ್ನೋದನ್ನ", "ಅನ್ನೋದನ್ನು",
    "ಬಗ್ಗೆ", "ಶೈಲಿಯಲ್ಲಿ", "ಭಾಗದಲ್ಲಿ", "ತಿಳಿಸಿ", "ಹೇಳಿ", "ಅರ್ಥ", "ಏನು", "ಕನ್ನಡದಲ್ಲಿ",
    "ಮಾಡುತ್ತದೆ", "ಅಂದರೆ", "ಅಂದ್ರೆ", "ರೀತಿಯಲ್ಲಿ", "ಕಡೆ", "ಕುರಿತು", "ಕೇಳುತ್ತಾರೆ", "ಹೇಳುತ್ತಾರೆ",
    "ಅಂತಾರೆ", "ಹೇಳ್ತಾರೆ", "ಕೇಳ್ತಾರೆ", "ಕೇಳಿ", "ಹೇಳಿ", "ನೋಡಿ"
}

def extract_query_features(raw_query: str, region_arg: Optional[str] = None, district_arg: Optional[str] = None):
    # 1. Target region from args or query text
    target_region = None
    candidates = []
    if district_arg:
        candidates.append(district_arg.strip().lower())
    if region_arg:
        candidates.append(region_arg.strip().lower())
    for c in candidates:
        if c in REGION_METADATA_MAP:
            target_region = REGION_METADATA_MAP[c]
            break

    q_lower = raw_query.lower()
    if not target_region:
        for kw, reg_name in REGION_METADATA_MAP.items():
            if kw in q_lower:
                target_region = reg_name
                break

    # 2. Extract quoted string (e.g. "ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ" or 'ಭಾಳ')
    quoted_match = re.search(r'["\']([^"\']+)["\']', raw_query)
    quoted_phrase = quoted_match.group(1).strip() if quoted_match else ""

    # 3. Clean query to core phrase
    clean = raw_query
    # Remove quoted parts temporarily
    clean = re.sub(r'["\']([^"\']+)["\']', r' \1 ', clean)
    # Remove conversational framing
    clean = re.sub(r'(?:ಅನ್ನೋದನ್ನ|ಅನ್ನೋದನ್ನು|ಎಂದು|ಅಂತ|ಬಗ್ಗೆ|ಕುರಿತು)\s+.*?(?:ಹೇಗೆ|ಹ್ಯಾಂಗೆ|ಹೇಳ್ತಾರೆ|ಕೇಳ್ತಾರೆ|ನುಡಿತಾರೆ|ಅರ್ಥ|ಏನು)\??', ' ', clean)
    clean = re.sub(r'(?:ಶೈಲಿಯಲ್ಲಿ|ಭಾಗದಲ್ಲಿ|ಕಡೆ|ರೀತಿಯಲ್ಲಿ|ಉಪಭಾಷೆಯಲ್ಲಿ|ಕನ್ನಡದಲ್ಲಿ)\s+.*', ' ', clean)
    for kw in REGION_METADATA_MAP.keys():
        clean = re.sub(rf'\b{re.escape(kw)}\b', ' ', clean, flags=re.IGNORECASE)
    for sw in STOPWORDS:
        clean = re.sub(rf'\b{re.escape(sw)}\b', ' ', clean)
    clean = re.sub(r'[^\u0C80-\u0CFF\w\s]', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()

    core_phrase = quoted_phrase if quoted_phrase else clean
    if not core_phrase:
        core_phrase = raw_query

    # Extract keywords for lexical validation
    tokens = [w for w in re.findall(r'[\u0C80-\u0CFF\w]+', core_phrase) if len(w) >= 2 and w not in STOPWORDS]

    return {
        "raw": raw_query,
        "quoted": quoted_phrase,
        "core": core_phrase,
        "tokens": tokens,
        "region": target_region,
    }

def hybrid_retrieve(features: dict):
    quoted = features["quoted"]
    core = features["core"]
    tokens = features["tokens"]
    target_region = features["region"]

    # Filter dataframe by region if specified
    sub_df = df
    if target_region:
        reg_df = df[df["region_name"] == target_region]
        if len(reg_df) > 0:
            sub_df = reg_df

    # 1. Exact quoted search
    if quoted:
        # Search specifically in Standard Kannada, Bookish source, or headword
        m = sub_df[sub_df["retrieval_text"].str.contains(re.escape(quoted), na=False)]
        if len(m) > 0:
            return m.iloc[0], 1.0, "exact_quoted"
        # Search in whole df if not found in region
        m_all = df[df["retrieval_text"].str.contains(re.escape(quoted), na=False)]
        if len(m_all) > 0:
            return m_all.iloc[0], 0.95, "exact_quoted_cross_region"

    # 2. Exact core phrase search
    if core and len(core) >= 3:
        m = sub_df[sub_df["retrieval_text"].str.contains(re.escape(core), na=False)]
        if len(m) > 0:
            return m.iloc[0], 0.9, "exact_core"

    # 3. High token overlap search with whole-word matching
    if tokens:
        def token_score(text):
            cnt = 0
            for t in tokens:
                pattern = rf"(?<![\u0C80-\u0CFF]){re.escape(t)}(?![\u0C80-\u0CFF])"
                if re.search(pattern, text):
                    cnt += 1
            return cnt

        scores = sub_df["retrieval_text"].apply(token_score)
        max_score = scores.max()
        # Require match of all tokens if <=2 tokens, else 50%
        min_required = len(tokens) if len(tokens) <= 2 else max(2, int(len(tokens) * 0.5))
        if max_score >= min_required and max_score > 0:
            best_idx = scores.idxmax()
            return sub_df.loc[best_idx], 0.8, "token_overlap"

    return None, 0.0, "not_found"

def parse_doc(content, region_meta):
    m_par = re.search(r"Dharwad-labelled target form:\s*(.*?)(?:\.\.|\n|$)", content)
    m_std1 = re.search(r"Bookish/standard Kannada source:\s*(.*?)(?:\.\.|\n|$)", content)
    if m_par:
        return {
            "type": "parallel",
            "region": "ಧಾರವಾಡ",
            "regional": m_par.group(1).strip(),
            "standard": m_std1.group(1).strip() if m_std1 else "",
            "meaning": "",
        }

    m_reg = re.search(r"Regional Kannada example:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_std2 = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_mean2 = re.search(r"Meaning/context:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_proj2 = re.search(r"Project region:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    if m_reg:
        return {
            "type": "regional_sentence",
            "region": m_proj2.group(1).strip() if m_proj2 else region_meta,
            "regional": m_reg.group(1).strip(),
            "standard": m_std2.group(1).strip() if m_std2 else "",
            "meaning": m_mean2.group(1).strip() if m_mean2 else "",
        }

    m_lex = re.search(r"Regional or colloquial form:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_std3 = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_mean3 = re.search(r"English meaning:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_proj3 = re.search(r"Project region:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    if m_lex:
        return {
            "type": "lexicon",
            "region": m_proj3.group(1).strip() if m_proj3 else region_meta,
            "regional": m_lex.group(1).strip(),
            "standard": m_std3.group(1).strip() if m_std3 else "",
            "meaning": m_mean3.group(1).strip() if m_mean3 else "",
        }

    return None

def generate_answer(query: str, region_arg=None, district_arg=None):
    feat = extract_query_features(query, region_arg, district_arg)
    doc_row, confidence, method = hybrid_retrieve(feat)

    # RELEVANCE GUARD: If confidence is 0 or query is out-of-domain (ISRO / Quantum), reject gracefully!
    if doc_row is None or confidence < 0.6:
        return "ಕ್ಷಮಿಸಿ, ಈ ನಿರ್ದಿಷ್ಟ ವಾಕ್ಯದ ಬಗ್ಗೆ ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ದಿನನಿತ್ಯದ ಮಾತುಕತೆ, ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!"

    parsed = parse_doc(doc_row["retrieval_text"], doc_row.get("region_name", ""))
    if not parsed:
        return "ಕ್ಷಮಿಸಿ, ಈ ನಿರ್ದಿಷ್ಟ ವಾಕ್ಯದ ಬಗ್ಗೆ ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ದಿನನಿತ್ಯದ ಮಾತುಕತೆ, ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!"

    region_display = parsed["region"] or feat["region"] or "ಕರ್ನಾಟಕ"
    if "Dharwad" in region_display:
        region_display = "ಧಾರವಾಡ"

    is_meaning = any(k in query for k in ["ಅರ್ಥ", "meaning", "ಅಂದ್ರೆ", "ಅಂದರೆ", "ಏನು"])

    parts = []
    if parsed["type"] == "lexicon":
        if is_meaning and parsed["meaning"]:
            parts.append(f'"{parsed["regional"]}" ಎಂದರೆ "{parsed["meaning"]}" ಅಂತ ಅರ್ಥ.')
            parts.append(f'{region_display} ಭಾಗದಲ್ಲಿ ಇದನ್ನು ಸಾಮಾನ್ಯವಾಗಿ ಬಳಸುತ್ತಾರೆ.')
            if parsed["standard"]:
                parts.append(f'ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{parsed["standard"]}" ಎನ್ನುತ್ತಾರೆ.')
        else:
            parts.append(f'ಖಂಡಿತ! {region_display} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{parsed["regional"]}" ಎಂದು ಹೇಳುತ್ತಾರೆ.')
            if parsed["standard"]:
                parts.append(f'ಪ್ರಮಾಣಿತ ರೂಪ: "{parsed["standard"]}".')
            if parsed["meaning"]:
                parts.append(f'ಅರ್ಥ: {parsed["meaning"]}.')
    else:
        parts.append(f'ಖಂಡಿತ! {region_display} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{parsed["regional"]}" ಎಂದು ಹೇಳುತ್ತಾರೆ.')
        if parsed["standard"]:
            parts.append(f'ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{parsed["standard"]}" ಎನ್ನಲಾಗುತ್ತದೆ.')
        if parsed["meaning"]:
            parts.append(f'ಅರ್ಥ: {parsed["meaning"]}.')

    return " ".join(parts[:3])

# Run tests on user queries including out-of-dataset and novel sentences!
import app

test_queries = [
    ("\"ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ\" ಅನ್ನೋದನ್ನ ಧಾರವಾಡ ಶೈಲಿಯಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?", None, "Dharwad"),
    ("ಹೇಗಿದ್ದೀರಿ ಎಂದು ಉತ್ತರ ಕಲ್ಯಾಣದಲ್ಲಿ ಹೇಗೆ ಕೇಳುತ್ತಾರೆ?", "uttara_kalyana", "Bidar"),
    ("ನೀವು ಹೇಗಿದ್ದೀರಿ ಎಂದು ಮೈಸೂರು ಭಾಗದಲ್ಲಿ ಹೇಗೆ ಹೇಳುತ್ತಾರೆ?", "kaveri_basin", "Mysuru"),
    ("ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ 'ಭಾಳ' ಅಂದರೆ ಏನು?", None, None),
    ("ನನ್ನ ಮೊಬೈಲ್ನಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಮತ್ತು ವೈಫೈ ಸಿಗ್ನಲ್ ಸಿಗುತ್ತಿಲ್ಲ ಅನ್ನೋದನ್ನ ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?", "uttara_kalyana", "Kalaburagi"),
    ("ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಜಾಮ್ನಲ್ಲಿ ಸಿಲುಕಿ ನನಗೆ ಆಫೀಸಿಗೆ ತಡವಾಯಿತು ಅನ್ನೋದನ್ನ ಮಲೆನಾಡಿನಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?", "malnad_ghats", "Shivamogga"),
    ("ಕರಾವಳಿ ಕನ್ನಡದಲ್ಲಿ 'ಕಿಲೋಮ್ಯಾಕ್ ಬುಜುಂಬಾ' ಅಂದರೆ ಏನು ಅರ್ಥ?", "karavali_coast", "Mangaluru"),
    ("ಇಸ್ರೋ ಸಂಸ್ಥೆಯು ಮಂಗಳ ಗ್ರಹಕ್ಕೆ ಕಳುಹಿಸಿದ ರಾಕೆಟ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?", None, None),
]

print("=" * 80)
print("TESTING SWARA-SETU DYNAMIC HYBRID RAG AGENT")
print("=" * 80)

for q, reg, dist in test_queries:
    res = app.query_rag_pipeline(q, reg, dist)
    print(f"\nUser Query: {q}")
    print(f"Agent Output: {res['answer']}")
    print(f"Source/Method: {res['source']} ({res['method']})")
