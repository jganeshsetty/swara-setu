import csv
import math
import os
import re
import sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, "backend")
from dialect_transformer import (
    adapt_sentence_to_dialect,
    is_adversarial_or_gibberish,
    is_out_of_domain_science_or_tech,
)

# Comprehensive Authentic Dialect Lexicon across Karnataka
REGIONAL_LEXICON_KB = {
    # Karavali (Mangaluru / Udupi / Coastal)
    "ಬೊಜ್ಜ": {"meaning": "ಔತಣ / ಸಾಮೂಹಿಕ ಊಟ (Feast)", "standard": "ಊಟ / ಹಬ್ಬದ ಔತಣ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಮಾರಾಯ": {"meaning": "ಸ್ನೇಹಿತ / ಗೆಳೆಯ (Friend/Mate)", "standard": "ಸ್ನೇಹಿತ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಎಂಚಿನ": {"meaning": "ಏನು (What)", "standard": "ಏನು", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಎಂಚಿತ್ತ್": {"meaning": "ಹೇಗೆ (How)", "standard": "ಹೇಗೆ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಇಲ್ಲ": {"meaning": "ಮನೆ (House/Home)", "standard": "ಮನೆ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ತಿಕ್ಕುಜಿಲ್ಲೆ": {"meaning": "ಸಿಗುತ್ತಿಲ್ಲ (Not available)", "standard": "ಸಿಗುತ್ತಿಲ್ಲ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಅಡೆಗೆ": {"meaning": "ಅಲ್ಲಿಗೆ (There)", "standard": "ಅಲ್ಲಿಗೆ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},
    "ಇಡೆಗೆ": {"meaning": "ಇಲ್ಲಿಗೆ (Here)", "standard": "ಇಲ್ಲಿಗೆ", "region": "ಕರಾವಳಿ ಕರ್ನಾಟಕ"},

    # North Karnataka / Dharwad / Kalyana
    "ಭಾಳ": {"meaning": "ತುಂಬಾ / ಅಧಿಕ (Very / A lot)", "standard": "ತುಂಬಾ / ಬಹಳ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಹ್ಯಾಂಗ": {"meaning": "ಹೇಗೆ (How)", "standard": "ಹೇಗೆ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಐತಿ": {"meaning": "ಇದೆ (Is present / Exists)", "standard": "ಇದೆ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಸಿಗವಲ್ದು": {"meaning": "ಸಿಗುತ್ತಿಲ್ಲ (Not available)", "standard": "ಸಿಗುತ್ತಿಲ್ಲ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಬರವಲ್ದು": {"meaning": "ಬರುತ್ತಿಲ್ಲ (Not coming)", "standard": "ಬರುತ್ತಿಲ್ಲ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಹೊಂಟೀನಿ": {"meaning": "ಹೋಗುತ್ತಿದ್ದೇನೆ (Going)", "standard": "ಹೋಗುತ್ತಿದ್ದೇನೆ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಜೋಡಿ": {"meaning": "ಜೊತೆ / ಸಂಗಡ (Along with)", "standard": "ಜೊತೆ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},
    "ಅವ್ವ": {"meaning": "ತಾಯಿ (Mother)", "standard": "ತಾಯಿ", "region": "ಉತ್ತರ ಕಲ್ಯಾಣ"},

    # Malnad (Shivamogga / Chikkamagaluru)
    "ಎಂತರ": {"meaning": "ಏನು (What)", "standard": "ಏನು", "region": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ"},
    "ಮಂಡೆ": {"meaning": "ತಲೆ (Head)", "standard": "ತಲೆ", "region": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ"},
    "ಹೋಗ್ವ": {"meaning": "ಹೋಗೋಣ (Let us go)", "standard": "ಹೋಗೋಣ", "region": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ"},
    "ಆಯಿತ್ತು": {"meaning": "ಆಯಿತು (Done / Completed)", "standard": "ಆಯಿತು", "region": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ"},

    # Kaveri Basin (Mandya / Mysuru)
    "ಆಗ್ಬುಡ್ತು": {"meaning": "ಆಯಿತು (Happened / Done)", "standard": "ಆಯಿತು", "region": "ಕಾವೇರಿ ಕಣಿವೆ"},
    "ಬಂದ್ಬುಟ್ಟೆ": {"meaning": "ಬಂದೆ (I came)", "standard": "ಬಂದೆ", "region": "ಕಾವೇರಿ ಕಣಿವೆ"},
    "ಹ್ಯಾಂಗಿದ್ದೀರಪ್ಪ": {"meaning": "ಹೇಗಿದ್ದೀರಿ (How are you)", "standard": "ಹೇಗಿದ್ದೀರಿ", "region": "ಕಾವೇರಿ ಕಣಿವೆ"},
    "ಸಂತೆ": {"meaning": "ಮಾರುಕಟ್ಟೆ (Weekly Market)", "standard": "ಮಾರುಕಟ್ಟೆ", "region": "ಕಾವೇರಿ ಕಣಿವೆ"},

    # Tungabhadra (Ballari / Koppal)
    "ಮಸ್ತ್": {"meaning": "ತುಂಬಾ / ಅದ್ಭುತ (A lot / Awesome)", "standard": "ತುಂಬಾ / ಬಹಳ", "region": "ತುಂಗಭದ್ರಾ ತೀರ"},
    "ಯಾಂಗ್": {"meaning": "ಹೇಗೆ (How)", "standard": "ಹೇಗೆ", "region": "ತುಂಗಭದ್ರಾ ತೀರ"},
    "ಆತ್ರಿ": {"meaning": "ಆಯಿತು (Done)", "standard": "ಆಯಿತು", "region": "ತುಂಗಭದ್ರಾ ತೀರ"},
}

REGION_METADATA_MAP = {
    "dharwad": "Dharwad-labelled (source dataset label)",
    "ಧಾರವಾಡ": "Dharwad-labelled (source dataset label)",
    "hubballi": "Dharwad-labelled (source dataset label)",
    "ಹುಬ್ಬಳ್ಳಿ": "Dharwad-labelled (source dataset label)",
    "uttara_kalyana": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಉತ್ತರ ಕಲ್ಯಾಣ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಉತ್ತರ ಕರ್ನಾಟಕ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಕಲಬುರಗಿ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಬೀದರ್": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "malnad": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಮಲೆನಾಡು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಮಲೆನಾಡಿನಲ್ಲಿ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಶಿವಮೊಗ್ಗ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಚಿಕ್ಕಮಗಳೂರು": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಕರಾವಳಿ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಕರಾವಳಿ ಕರ್ನಾಟಕ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಕರಾವಳಿಯಲ್ಲಿ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಮಂಗಳೂರು": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಉಡುಪಿ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಮಂಡ್ಯ": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಮೈಸೂರು": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಹಳೇ ಮೈಸೂರು": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಕಾವೇರಿ": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಬಳ್ಳಾರಿ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ತುಂಗಭದ್ರಾ": "ತುಂಗಭದ್ರಾ ತೀರ",
}

STOPWORDS = {
    "ಎಂದು", "ಅಂತ", "ಹೇಗೆ", "ಹ್ಯಾಂಗೆ", "ಹೇಳ್ತಾರೆ", "ಕೇಳ್ತಾರೆ", "ಅನ್ನೋದನ್ನ", "ಅನ್ನೋದನ್ನು",
    "ಬಗ್ಗೆ", "ಶೈಲಿಯಲ್ಲಿ", "ಭಾಗದಲ್ಲಿ", "ತಿಳಿಸಿ", "ಹೇಳಿ", "ಅರ್ಥ", "ಏನು", "ಕನ್ನಡದಲ್ಲಿ",
    "ಮಾಡುತ್ತದೆ", "ಅಂದರೆ", "ಅಂದ್ರೆ", "ರೀತಿಯಲ್ಲಿ", "ಕಡೆ", "ಕುರಿತು", "ಕೇಳುತ್ತಾರೆ", "ಹೇಳುತ್ತಾರೆ",
    "ಅಂತಾರೆ", "ಕೇಳಿ", "ನೋಡಿ", "ರೂಪ", "ವಾಕ್ಯ", "ಮತ್ತು", "ಹಾಗೂ", "ಇದು", "ಅದು", "ಇವು"
}

def extract_query_features(raw_query: str):
    target_region = None
    q_lower = raw_query.lower()
    for kw, reg_name in REGION_METADATA_MAP.items():
        if kw in q_lower:
            target_region = reg_name
            break

    quoted_match = re.search(r'["\']([^"\']+)["\']', raw_query)
    quoted_phrase = quoted_match.group(1).strip() if quoted_match else ""

    clean = raw_query
    clean = re.sub(r'["\']([^"\']+)["\']', r' \1 ', clean)
    clean = re.sub(r'(?:ಅನ್ನೋದನ್ನ|ಅನ್ನೋದನ್ನು|ಎಂದು|ಅಂತ|ಬಗ್ಗೆ|ಕುರಿತು)\s+.*?(?:ಹೇಗೆ|ಹ್ಯಾಂಗೆ|ಹೇಳ್ತಾರೆ|ಕೇಳ್ತಾರೆ|ನುಡಿತಾರೆ|ಅರ್ಥ|ಏನು)\??', ' ', clean)
    clean = re.sub(r'(?:ಶೈಲಿಯಲ್ಲಿ|ಭಾಗದಲ್ಲಿ|ಕಡೆ|ರೀತಿಯಲ್ಲಿ|ಉಪಭಾಷೆಯಲ್ಲಿ|ಕನ್ನಡದಲ್ಲಿ)\s+.*', ' ', clean)

    for kw in REGION_METADATA_MAP.keys():
        clean = re.sub(rf'\b{re.escape(kw)}\b', ' ', clean, flags=re.IGNORECASE)
    for sw in STOPWORDS:
        clean = re.sub(rf'\b{re.escape(sw)}\b', ' ', clean)

    clean = re.sub(r'[^\u0C80-\u0CFF\w\s]', ' ', clean)
    clean = re.sub(r'\s*(?:ಹೇಳ್ತಾರೆ|ಹೇಳುತ್ತಾರೆ|ಅನ್ನೋದನ್ನ|ಅನ್ನೋದನ್ನು|ಕೇಳ್ತಾರೆ|ನುಡಿತಾರೆ|ಅರ್ಥ|ಹೇಗೆ|ಹ್ಯಾಂಗೆ)\s*$', '', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()

    core_phrase = quoted_phrase if quoted_phrase else clean
    if not core_phrase:
        core_phrase = raw_query

    tokens = [w for w in re.findall(r'[\u0C80-\u0CFF\w]+', core_phrase) if len(w) >= 2 and w not in STOPWORDS]

    return {
        "raw": raw_query,
        "quoted": quoted_phrase,
        "core": core_phrase,
        "tokens": tokens,
        "region": target_region,
    }

# Load rag_dataset.csv
DATASET_CSV = "backend/rag_dataset.csv"
records = []
with open(DATASET_CSV, encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if len(row) >= 2:
            records.append({"region_name": row[0], "retrieval_text": row[1]})

def improved_rag_response(user_q: str):
    # 1. Guardrails
    if is_out_of_domain_science_or_tech(user_q):
        return "ಸ್ವರಸೇತು ಕರ್ನಾಟಕದ ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಉಪಭಾಷೆಗಳನ್ನು ಕಲಿಯುವ ವೇದಿಕೆಯಾಗಿದೆ. ವಿಜ್ಞಾನ ಅಥವಾ ತಾಂತ್ರಿಕ ವಿಷಯಗಳ ಬದಲು, ಯಾವುದೇ ಕನ್ನಡ ವಾಕ್ಯವನ್ನು ಆಡುಮಾತಿಗೆ ಪರಿವರ್ತಿಸಲು ಕೇಳಿ ನೋಡಿ!"
    if is_adversarial_or_gibberish(user_q):
        return "ಕ್ಷಮಿಸಿ, ಇದು ಕನ್ನಡದ ಯಾವುದೇ ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಯಲ್ಲಿ ಗುರುತಿಸಲಾದ ಅಧಿಕೃತ ಪದವಲ್ಲ. ದಯವಿಟ್ಟು ನಿಜವಾದ ಕನ್ನಡ ಪದ ಅಥವಾ ವಾಕ್ಯವನ್ನು ಕೇಳಿ ನೋಡಿ!"

    feat = extract_query_features(user_q)
    target_region = feat["region"]
    quoted = feat["quoted"]
    core = feat["core"]
    tokens = feat["tokens"]

    is_meaning_query = any(k in user_q for k in ["ಅರ್ಥ", "meaning", "ಅಂದ್ರೆ", "ಅಂದರೆ", "ಏನು ಅರ್ಥ"])
    is_translation_request = any(k in user_q for k in ["ಹೇಗೆ ಹೇಳ್ತಾರೆ", "ಹೇಗೆ ಹೇಳುತ್ತಾರೆ", "ಹ್ಯಾಂಗ ಹೇಳ್ತಾರೆ", "ಹೇಗೆ ನುಡಿತಾರೆ", "ಶೈಲಿಯಲ್ಲಿ", "ಆಡುಮಾತಿನಲ್ಲಿ", "ಪರಿವರ್ತಿಸಿ", "ಹೇಗೆ ಕೇಳುತ್ತಾರೆ", "ಹೇಗೆ ಹೇಳುವುದು"])

    # 2. Check Vocabulary Knowledge Base first for meaning queries
    test_word = quoted or (tokens[0] if len(tokens) == 1 else "")
    if is_meaning_query and test_word and test_word in REGIONAL_LEXICON_KB:
        info = REGIONAL_LEXICON_KB[test_word]
        reg_disp = target_region or info["region"]
        return f'ಖಂಡಿತ! {reg_disp} ಉಪಭಾಷೆಯಲ್ಲಿ "{test_word}" ಎಂದರೆ "{info["meaning"]}" ಅಂತ ಅರ್ಥ. ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{info["standard"]}" ಎನ್ನಲಾಗುತ್ತದೆ.'

    # 3. Grounded Dataset search
    # Filter candidates strictly by target region if user specified one
    candidates = records
    if target_region:
        reg_matches = [r for r in records if r["region_name"] == target_region]
        if reg_matches:
            candidates = reg_matches

    # Look for exact parallel or colloquial sentences
    for r in candidates:
        text = r["retrieval_text"]
        # Skip generic textbooks / blogs for dialect queries!
        if "Corpus category: Textbook" in text or "Corpus category: Socio-Educational" in text or "Wikipedia" in text:
            continue

        # Exact match of core or quoted phrase
        phrase_to_match = quoted or core
        if phrase_to_match and len(phrase_to_match) >= 3 and phrase_to_match in text:
            # Parse regional form
            m_par = re.search(r"Dharwad-labelled target form:\s*(.*?)(?:\.\.|\n|$)", text)
            m_std1 = re.search(r"Bookish/standard Kannada source:\s*(.*?)(?:\.\.|\n|$)", text)
            if m_par:
                regional = re.sub(r'[\.\s]*Caveat:.*$', '', m_par.group(1)).strip()
                standard = m_std1.group(1).strip() if m_std1 else ""
                reg_name = "ಧಾರವಾಡ" if target_region == "Dharwad-labelled (source dataset label)" else (target_region or "ಧಾರವಾಡ")
                return f'ಖಂಡಿತ! {reg_name} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು ಈ ರೀತಿ ಹೇಳುತ್ತಾರೆ: "{regional}". (ಪ್ರಮಾಣಿತ ರೂಪ: "{standard}")'

            m_reg = re.search(r"Regional Kannada example:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            m_std2 = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            if m_reg:
                reg_name = target_region or "ಕರ್ನಾಟಕ"
                return f'ಖಂಡಿತ! {reg_name} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು ಈ ರೀತಿ ಹೇಳುತ್ತಾರೆ: "{m_reg.group(1).strip()}".'

            m_lex = re.search(r"Regional or colloquial form:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            m_std3 = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            m_mean3 = re.search(r"English meaning:\s*(.*?)(?:\.\.|\.|\n|$)", text)
            if m_lex:
                reg_name = target_region or "ಕರ್ನಾಟಕ"
                if is_meaning_query:
                    std_part = f' (ಪ್ರಮಾಣಿತ ಕನ್ನಡ: "{m_std3.group(1).strip()}")' if m_std3 else ''
                    return f'"{m_lex.group(1).strip()}" ಎಂದರೆ {reg_name} ಭಾಗದಲ್ಲಿ "{m_mean3.group(1).strip() if m_mean3 else m_std3.group(1).strip()}" ಅಂತ ಅರ್ಥ{std_part}.'
                else:
                    return f'ಖಂಡಿತ! {reg_name} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{m_lex.group(1).strip()}" ಎಂದು ಹೇಳುತ್ತಾರೆ.'

    # 4. Dynamic Dialect Transformer for novel sentences
    reg_for_transform = target_region or "ಉತ್ತರ ಕಲ್ಯಾಣ"
    sentence_to_transform = quoted or core or user_q
    adapted, region_tag = adapt_sentence_to_dialect(sentence_to_transform, reg_for_transform)

    return f'ಖಂಡಿತ! {region_tag} ಆಡುಮಾತಿನಲ್ಲಿ ಇದನ್ನು ಈ ರೀತಿ ಹೇಳಬಹುದು: "{adapted}".'

queries = [
    "ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ ಅನ್ನೋದನ್ನ ಧಾರವಾಡದಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?",
    "ಉತ್ತರ ಕಲ್ಯಾಣದಲ್ಲಿ 'ಭಾಳ' ಅಂದರೆ ಏನು ಅರ್ಥ?",
    "ಕರಾವಳಿ ಕನ್ನಡದಲ್ಲಿ 'ಬೊಜ್ಜ' ಅಂದರೆ ಏನು ಅರ್ಥ?",
    "ನೀವು ಹೇಗಿದ್ದೀರಿ ಅನ್ನೋದನ್ನ ಹಳೇ ಮೈಸೂರು ಅಥವಾ ಮಂಡ್ಯದಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?",
    "ನನ್ನ ಮೊಬೈಲ್‌ನಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ಸಿಗುತ್ತಿಲ್ಲ ಅನ್ನೋದನ್ನ ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?",
    "ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಜಾಮ್‌ನಲ್ಲಿ ಸಿಲುಕಿ ನನಗೆ ಆಫೀಸಿಗೆ ತಡವಾಯಿತು ಅನ್ನೋದನ್ನ ಮಲೆನಾಡಿನಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?"
]

print("\n\nTESTING IMPROVED RAG PIPELINE:\n")
for q in queries:
    ans = improved_rag_response(q)
    print("--------------------------------------------------")
    print("Q:", q)
    print("A:", ans)
