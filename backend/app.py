import os
import re
import sys
from typing import Optional, List, Dict, Any, Tuple

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel

# Set UTF-8 encoding for standard output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception as encoding_err:
        print(f"Notice: stdout encoding reconfigure: {encoding_err}")

# Load .env file
load_dotenv()

from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

app = FastAPI(
    title="Swara-Setu Kannada RAG API",
    description="Multilingual Hybrid RAG Agent for Karnataka Regional Kannada Dialects",
    version="2.1.0",
)

# Enable CORS for Next.js frontend or any client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")
DATASET_CSV = os.path.join(PROJECT_ROOT, "final_best_kannada_rag_dataset.csv")

print("Loading Master Kannada Dataset for Hybrid Search...")
df_dataset = pd.read_csv(DATASET_CSV)
print(f"Master dataset loaded: {len(df_dataset)} records.")

print("Loading Multilingual Hugging Face Embeddings ('paraphrase-multilingual-MiniLM-L12-v2')...")
embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")

print("Connecting to ChromaDB collection...")
vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
doc_count = vectorstore._collection.count()
print(f"ChromaDB connected successfully. Total indexed documents: {doc_count}")

# ---------------------------------------------------------------------------
# Region and District Metadata Mapping for Pre-Filtering
# ---------------------------------------------------------------------------
REGION_METADATA_MAP: Dict[str, str] = {
    # Dharwad / Hubballi Heartland
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

    # Uttara Kalyana (Bidar, Kalaburagi, Yadgir)
    "uttara_kalyana": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಉತ್ತರ ಕಲ್ಯಾಣ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "bidar": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಬೀದರ್": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "kalaburagi": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "gulbarga": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಕಲಬುರಗಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "yadgir": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಯಾದಗಿರಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",

    # Tungabhadra Belt (Raichur, Koppal, Ballari, Vijayanagara)
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

    # Krishna Valley (Belagavi, Bagalkote, Vijayapura)
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

    # Karavali / Coastal (Mangaluru, Udupi, Karwar)
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
    "karwar": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಕಾರವಾರ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",

    # Malnad Ghats (Shivamogga, Chikkamagaluru, Kodagu)
    "malnad_ghats": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಮಲೆನಾಡು ಗಿರಿಧಾಮ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "shivamogga": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "shimoga": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಶಿವಮೊಗ್ಗ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "chikkamagaluru": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಚಿಕ್ಕಮಗಳೂರು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "kodagu": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "coorg": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಕೊಡಗು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",

    # Bayalu Seeme (Davanagere, Chitradurga, Tumakuru)
    "bayalu_seeme": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "davanagere": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ದಾವಣಗೆರೆ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "chitradurga": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ಚಿತ್ರದುರ್ಗ": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "tumakuru": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "tumkur": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "ತುಮಕೂರು": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",

    # Kaveri Basin / Old Mysore (Mysuru, Mandya, Chamarajanagara)
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

    # Dakshina Ghats / Southern Heartland (Hassan, Ramanagara)
    "dakshina_ghats": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "hassan": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ಹಾಸನ": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ramanagara": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "ರಾಮನಗರ": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",

    # Eastern Plateau (Bengaluru, Kolar, Chikkaballapura)
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
    "ಅಂತಾರೆ", "ಕೇಳಿ", "ನೋಡಿ", "ರೂಪ", "ವಾಕ್ಯ", "ಮತ್ತು", "ಹಾಗೂ", "ಇದು", "ಅದು", "ಇವು"
}

class UserQuery(BaseModel):
    question: str
    region: Optional[str] = None
    district: Optional[str] = None


def extract_query_features(raw_query: str, region_arg: Optional[str] = None, district_arg: Optional[str] = None) -> dict:
    """
    Sanitizes conversational wrappers from user queries to extract:
    1. Target region (from args or query text)
    2. Quoted target phrases (e.g. "ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ" or 'ಭಾಳ')
    3. Cleaned core semantic text
    4. Key search tokens
    """
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
        for exact_reg in REGION_METADATA_MAP.values():
            if c == exact_reg.lower():
                target_region = exact_reg
                break

    q_lower = raw_query.lower()
    if not target_region:
        for kw, reg_name in REGION_METADATA_MAP.items():
            if kw in q_lower:
                target_region = reg_name
                break

    # Extract quoted string if present
    quoted_match = re.search(r'["\']([^"\']+)["\']', raw_query)
    quoted_phrase = quoted_match.group(1).strip() if quoted_match else ""

    # Clean conversational wrappers
    clean = raw_query
    clean = re.sub(r'["\']([^"\']+)["\']', r' \1 ', clean)
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

    # Extract whole Kannada tokens (min length 2)
    tokens = [w for w in re.findall(r'[\u0C80-\u0CFF\w]+', core_phrase) if len(w) >= 2 and w not in STOPWORDS]

    return {
        "raw": raw_query,
        "quoted": quoted_phrase,
        "core": core_phrase,
        "tokens": tokens,
        "region": target_region,
    }


def hybrid_retrieve(features: dict) -> Tuple[Optional[str], Optional[dict], float, str]:
    """
    Hybrid Retrieval Engine:
    Level 1: Exact quoted phrase matching (e.g. "ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ" or 'ಭಾಳ')
    Level 2: Exact core phrase matching in target region
    Level 3: Whole-word token overlap matching
    Level 4: ChromaDB semantic vector search (fallback with distance guard)
    """
    quoted = features["quoted"]
    core = features["core"]
    tokens = features["tokens"]
    target_region = features["region"]

    sub_df = df_dataset
    if target_region:
        reg_df = df_dataset[df_dataset["region_name"] == target_region]
        if len(reg_df) > 0:
            sub_df = reg_df

    # 1. Exact quoted search
    if quoted:
        m = sub_df[sub_df["retrieval_text"].str.contains(re.escape(quoted), na=False)]
        if len(m) > 0:
            row = m.iloc[0]
            return row["retrieval_text"], {"region_name": row.get("region_name", "")}, 1.0, "exact_quoted"
        m_all = df_dataset[df_dataset["retrieval_text"].str.contains(re.escape(quoted), na=False)]
        if len(m_all) > 0:
            row = m_all.iloc[0]
            return row["retrieval_text"], {"region_name": row.get("region_name", "")}, 0.95, "exact_quoted_cross_region"

    # 2. Exact core phrase search
    if core and len(core) >= 3:
        m = sub_df[sub_df["retrieval_text"].str.contains(re.escape(core), na=False)]
        if len(m) > 0:
            row = m.iloc[0]
            return row["retrieval_text"], {"region_name": row.get("region_name", "")}, 0.9, "exact_core"

    # 3. High token overlap with whole Kannada word boundary matching
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
        min_required = len(tokens) if len(tokens) <= 2 else max(2, int(len(tokens) * 0.5))
        if max_score >= min_required and max_score > 0:
            best_idx = scores.idxmax()
            row = sub_df.loc[best_idx]
            return row["retrieval_text"], {"region_name": row.get("region_name", "")}, 0.85, "token_overlap"

    # 4. Dense Vector Search with ChromaDB
    try:
        search_filter = {"region_name": target_region} if target_region else None
        res = vectorstore.similarity_search_with_score(core or features["raw"], k=3, filter=search_filter)
        if not res and search_filter:
            res = vectorstore.similarity_search_with_score(core or features["raw"], k=3)

        if res:
            best_doc, score = res[0]
            # Calculate how many significant query tokens appear as whole words
            matched_tokens = [
                t for t in tokens
                if re.search(rf"(?<![\u0C80-\u0CFF]){re.escape(t)}(?![\u0C80-\u0CFF])", best_doc.page_content)
            ]
            min_matched = len(tokens) if len(tokens) <= 2 else max(2, int(len(tokens) * 0.5))
            # Strictly reject out-of-domain queries like ISRO Mars mission or Quantum computing
            if len(matched_tokens) >= min_matched and len(matched_tokens) > 0 and score < 14.0:
                return best_doc.page_content, best_doc.metadata or {}, float(score), "chroma_dense"
    except Exception as e:
        print(f"Chroma search error: {e}")

    return None, None, 0.0, "not_found"


def parse_rag_document_content(content: str, meta: dict) -> Dict[str, str]:
    """
    Extracts structured dialect data from the pre-optimized `retrieval_text`.
    """
    region_meta = meta.get("region_name", "") or ""

    # 1. Parallel sentence (Dharwad target)
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

    # 2. Regional sentence / paragraph
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

    # 3. Lexicon entry
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

    # 4. Corpus / generic snippet
    clean_text = content.replace("Bookish/standard Kannada source:", "").replace("Kannada text:", "").strip()
    return {
        "type": "corpus",
        "region": region_meta or "ಕರ್ನಾಟಕ",
        "regional": clean_text,
        "standard": "",
        "meaning": "",
    }


def query_rag_pipeline(user_q: str, region: Optional[str] = None, district: Optional[str] = None) -> dict:
    """
    High-Precision Grounded Kannada RAG Pipeline:
    1. Extracts intent, quoted phrases, and active region filter.
    2. Executes Hybrid Retrieval (Lexical exact + Whole-word token overlap + Chroma Dense).
    3. Relevance Guard: If confidence < 0.6 or query is out-of-domain (e.g., ISRO, Quantum),
       gracefully abstains to prevent hallucinations.
    4. Formats a 2-3 sentence spoken Kannada response for Voice TTS.
    """
    features = extract_query_features(user_q, region, district)
    doc_content, doc_meta, score, method = hybrid_retrieve(features)

    # RELEVANCE GUARD: Graceful abstention for out-of-domain or ungrounded queries
    if not doc_content or score < 0.6:
        return {
            "answer": "ಕ್ಷಮಿಸಿ, ಈ ನಿರ್ದಿಷ್ಟ ವಾಕ್ಯದ ಬಗ್ಗೆ ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ದಿನನಿತ್ಯದ ಮಾತುಕತೆ, ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!",
            "source": "relevance_guard_abstain",
            "score": float(score),
            "region_filtered": features["region"],
            "method": method,
        }

    parsed = parse_rag_document_content(doc_content, doc_meta or {})
    if not parsed:
        return {
            "answer": "ಕ್ಷಮಿಸಿ, ಈ ನಿರ್ದಿಷ್ಟ ವಾಕ್ಯದ ಬಗ್ಗೆ ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ದಿನನಿತ್ಯದ ಮಾತುಕತೆ, ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!",
            "source": "relevance_guard_unparsed",
            "score": float(score),
            "region_filtered": features["region"],
            "method": method,
        }

    region_display = parsed["region"] or features["region"] or "ಕರ್ನಾಟಕ"
    if "Dharwad" in region_display:
        region_display = "ಧಾರವಾಡ"

    is_meaning_query = any(k in user_q for k in ["ಅರ್ಥ", "meaning", "ಅಂದ್ರೆ", "ಅಂದರೆ", "ಏನು"])

    sentences: List[str] = []

    if parsed["type"] == "lexicon":
        if is_meaning_query and parsed["meaning"]:
            sentences.append(f'"{parsed["regional"]}" ಎಂದರೆ "{parsed["meaning"]}" ಅಂತ ಅರ್ಥ.')
            sentences.append(f'{region_display} ಭಾಗದಲ್ಲಿ ಇದನ್ನು ಸಾಮಾನ್ಯವಾಗಿ ಬಳಸುತ್ತಾರೆ.')
            if parsed["standard"]:
                sentences.append(f'ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{parsed["standard"]}" ಎನ್ನುತ್ತಾರೆ.')
        else:
            sentences.append(f'ಖಂಡಿತ! {region_display} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{parsed["regional"]}" ಎಂದು ಹೇಳುತ್ತಾರೆ.')
            if parsed["standard"]:
                sentences.append(f'ಪ್ರಮಾಣಿತ ರೂಪ: "{parsed["standard"]}".')
            if parsed["meaning"]:
                sentences.append(f'ಅರ್ಥ: {parsed["meaning"]}.')

    elif parsed["type"] in ("regional_sentence", "parallel"):
        sentences.append(f'ಖಂಡಿತ! {region_display} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{parsed["regional"]}" ಎಂದು ಹೇಳುತ್ತಾರೆ.')
        if parsed["standard"]:
            sentences.append(f'ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{parsed["standard"]}" ಎನ್ನಲಾಗುತ್ತದೆ.')
        if parsed["meaning"]:
            sentences.append(f'ಅರ್ಥ: {parsed["meaning"]}.')

    else:
        # General corpus snippet
        snippet = parsed["regional"][:120].strip()
        sentences.append(f'ನಮ್ಮ ದತ್ತಾಂಶದ ಪ್ರಕಾರ: {snippet}.')
        sentences.append('ಇದು ಪ್ರಾದೇಶಿಕ ಕನ್ನಡದ ಅಧಿಕೃತ ಬಳಕೆಯಾಗಿದೆ.')

    answer = " ".join(sentences[:3])

    return {
        "answer": answer,
        "source": f"rag_{method}",
        "score": float(score),
        "region_filtered": features["region"],
        "method": method,
    }


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Swara-Setu Multilingual Hybrid Kannada RAG API",
        "vector_count": vectorstore._collection.count(),
        "dataset_records": len(df_dataset),
        "chroma_dir": CHROMA_DIR,
    }


from bhashini_service import bhashini_service


class AudioQuery(BaseModel):
    audio_base64: str
    region: Optional[str] = None
    district: Optional[str] = None


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "bhashini_configured": bhashini_service.is_configured(),
        "vectors": vectorstore._collection.count(),
        "dataset_records": len(df_dataset),
    }


@app.post("/ask")
async def ask_question(query: UserQuery):
    try:
        user_q = query.question.strip()
        if not user_q:
            return {"error": "ಖಾಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ (Empty question)."}

        result = query_rag_pipeline(user_q, region=query.region, district=query.district)
        return result

    except Exception as e:
        return {"error": str(e)}


@app.post("/api/voice-chat")
async def voice_chat(audio_query: AudioQuery):
    """
    Native Kannada Voice RAG with Regional Pre-Filtering:
    1. Base64 Audio -> Bhashini ASR -> Kannada Text
    2. Kannada Text + Region Filter -> Hybrid RAG Pipeline -> 2-3 Sentence Voice Answer
    3. Voice Answer -> Bhashini TTS -> Base64 Audio Response
    """
    try:
        raw_audio = audio_query.audio_base64.strip()
        if not raw_audio:
            return {"error": "ಖಾಲಿ ಆಡಿಯೋ ಡೇಟಾ (Empty audio data provided)."}

        # Check if Bhashini is configured
        if not bhashini_service.is_configured():
            return {
                "error": "Bhashini credentials not configured in backend/.env",
                "kannada_transcript": "",
                "answer": "ದಯವಿಟ್ಟು backend/.env ನಲ್ಲಿ Bhashini API ರುಜುವಾತುಗಳನ್ನು (credentials) ಸೇರಿಸಿ.",
                "audio_response_base64": "",
            }

        # Step 1: Speech-to-Text via Bhashini ASR
        print("[Voice Chat] Converting Kannada speech to text with Bhashini...")
        user_kannada_text = bhashini_service.convert_speech_to_text(raw_audio)

        if not user_kannada_text:
            return {
                "kannada_transcript": "",
                "answer": "ಧ್ವನಿಯನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.",
                "audio_response_base64": "",
            }

        print(f"[Voice Chat] User said in Kannada: {user_kannada_text}")

        # Step 2: Feed to Hybrid RAG pipeline with regional pre-filtering
        rag_result = query_rag_pipeline(
            user_kannada_text,
            region=audio_query.region,
            district=audio_query.district,
        )
        answer_text = rag_result.get("answer", "")

        # Clean answer text for TTS
        clean_tts_text = re.sub(r"[•*#_`]", "", answer_text)
        clean_tts_text = re.sub(r"\(.*?\)", "", clean_tts_text)
        clean_tts_text = re.sub(r"\s+", " ", clean_tts_text).strip()

        # Step 3: Text-to-Speech via Bhashini TTS
        print("[Voice Chat] Converting RAG answer to Kannada speech with Bhashini...")
        audio_base64_response = bhashini_service.convert_text_to_speech(clean_tts_text or answer_text)

        return {
            "kannada_transcript": user_kannada_text,
            "answer": answer_text,
            "audio_response_base64": audio_base64_response,
            "source": rag_result.get("source", "rag_pipeline"),
            "region_filtered": rag_result.get("region_filtered"),
        }

    except Exception as e:
        print(f"[Voice Chat Error]: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
