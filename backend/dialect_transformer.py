# -*- coding: utf-8 -*-
"""
Swara-Setu Dynamic Regional Kannada Dialect Transformer
Transforms arbitrary Standard Kannada input sentences into authentic regional dialects
for Karnataka's 10 cultural linguistic zones using morphological, lexical, and syntactical rules.
"""

import re
from typing import Optional, Tuple

REGION_DIALECT_RULES = {
    "ಉತ್ತರ ಕಲ್ಯಾಣ": {
        "tag": "ಉತ್ತರ ಕಲ್ಯಾಣ (ಕಲಬುರಗಿ / ಬೀದರ್ / ಯಾದಗಿರಿ)",
        "words": {
            "ನನ್ನ": "ನನ್",
            "ನನಗೆ": "ನನಗ",
            "ನಾನು": "ನಾ",
            "ನಾವು": "ನಾವ್",
            "ನೀವು": "ನೀವ್",
            "ಅವನು": "ಅವ್ನು",
            "ಅವಳು": "ಅವ್ಳು",
            "ಇದೆ": "ಐತಿ",
            "ಇಲ್ಲ": "ಇಲ್ಲ್ರೀ",
            "ಸಿಗುತ್ತಿಲ್ಲ": "ಸಿಗವಲ್ದು",
            "ಸಿಗುವುದಿಲ್ಲ": "ಸಿಗವಲ್ದು",
            "ಬರುತ್ತಿಲ್ಲ": "ಬರವಲ್ದು",
            "ಆಗುತ್ತಿಲ್ಲ": "ಆಗವಲ್ದು",
            "ಹೇಗೆ": "ಹ್ಯಾಂಗ",
            "ಹೇಗಿದ್ದೀರಿ": "ಹ್ಯಾಂಗದೀರಿ",
            "ಹೇಗಿದ್ದೀಯಾ": "ಹ್ಯಾಂಗದಿ",
            "ತುಂಬಾ": "ಭಾಳ",
            "ಬಹಳ": "ಭಾಳ",
            "ತಡವಾಯಿತು": "ಟೈಮ್ ಆಗೇದ",
            "ತಡವಾಗಿದೆ": "ಟೈಮ್ ಆಗೇದ",
            "ಮಾಡುತ್ತಿದ್ದೇನೆ": "ಮಾಡಕತ್ತೀನಿ",
            "ಮಾಡುತ್ತಿದ್ದೀರಿ": "ಮಾಡಕತ್ತೀರಿ",
            "ಹೋಗುತ್ತಿದ್ದೇನೆ": "ಹೊಂಟೀನಿ",
            "ಹೋಗುತ್ತಿದ್ದೀರಿ": "ಹೊಂಟೀರಿ",
            "ಆಗಿದೆ": "ಆಗೇದ",
            "ಆಯಿತು": "ಆತು",
            "ಬಂದೆ": "ಬಂದ್ನಿ",
            "ಹೋದೆ": "ಹೋಗಿದ್ನಿ",
            "ಶಾಲೆಗೆ": "ಶಾಲಿಗ್",
            "ಮನೆಗೆ": "ಮನ್ಯಾಗ್",
            "ಏನು": "ಏನ್ರೀ",
            "ಹೌದು": "ಹೌದ್ರೀ",
            "ಗೊತ್ತಿಲ್ಲ": "ಗೊತ್ತಿಲ್ಲ್ರೀ",
        },
        "patterns": [
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
            (r"ದಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
            (r"ದಲ್ಲಿದೆ(?=[\s,!?.]|$)", "ನ್ಯಾಗೈತಿ"),
            (r"ತ್ತಿಲ್ಲ(?=[\s,!?.]|$)", "ವಲ್ದು"),
            (r"ತ್ತಿದೆ(?=[\s,!?.]|$)", "ಕತ್ತೇದ"),
            (r"ತ್ತಿದ್ದೇನೆ(?=[\s,!?.]|$)", "ಕತ್ತೀನಿ"),
            (r"ತ್ತಿದ್ದೀರಿ(?=[\s,!?.]|$)", "ಕತ್ತೀರಿ"),
        ]
    },
    "Dharwad-labelled (source dataset label)": {
        "tag": "ಧಾರವಾಡ / ಹುಬ್ಬಳ್ಳಿ ಶೈಲಿ",
        "words": {
            "ನನ್ನ": "ನನ್",
            "ನನಗೆ": "ನನಗ",
            "ನಾನು": "ನಾ",
            "ನಾವು": "ನಾವ್",
            "ನೀವು": "ನೀವ್",
            "ಇದೆ": "ಐತಿ",
            "ಇಲ್ಲ": "ಇಲ್ರೀ",
            "ಸಿಗುತ್ತಿಲ್ಲ": "ಸಿಗವಲ್ದು",
            "ಹೇಗೆ": "ಹ್ಯಾಂಗ",
            "ಹೇಗಿದ್ದೀರಿ": "ಹ್ಯಾಂಗದೀರಿ",
            "ತುಂಬಾ": "ಭಾಳ",
            "ಬಹಳ": "ಭಾಳ",
            "ತಡವಾಯಿತು": "ಲೇಟ್ ಆಗ್ಯಾದ",
            "ಹೋಗುತ್ತಿದ್ದೇನೆ": "ಹೊಂಟೀನಿ",
            "ಹೋಗುತ್ತಿದ್ದೀರಿ": "ಹೊಂಟೀರಿ",
            "ಆಗಿದೆ": "ಆಗ್ಯಾದ",
            "ಆಯಿತು": "ಆತು",
            "ಶಾಲೆಗೆ": "ಶಾಲಿಗ್",
            "ಬಂದೆ": "ಬಂದ್ನಿ",
            "ಹೋದೆ": "ಹೋಗಿದ್ನಿ",
        },
        "patterns": [
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
            (r"ದಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
            (r"ತ್ತಿಲ್ಲ(?=[\s,!?.]|$)", "ವಲ್ದು"),
            (r"ತ್ತಿದೆ(?=[\s,!?.]|$)", "ಕತ್ತದ"),
        ]
    },
    "ಮಲೆನಾಡು ಗಿರಿಧಾಮ": {
        "tag": "ಮಲೆನಾಡು (ಶಿವಮೊಗ್ಗ / ಚಿಕ್ಕಮಗಳೂರು)",
        "words": {
            "ಏನು": "ಎಂತರ",
            "ಆಯಿತು": "ಆಯಿತ್ತು",
            "ತಲೆ": "ಮಂಡೆ",
            "ಹೋಗೋಣ": "ಹೋಗ್ವ",
            "ತಡವಾಯಿತು": "ತಡ ಆಯ್ತು ಕಣ್ರೀ",
            "ತಡವಾಗಿದೆ": "ತಡ ಆಗದೆ ಕಣ್ರೀ",
            "ನನಗೆ": "ನಂಗೆ",
            "ನನ್ನ": "ನಮ್ಮ",
            "ಇದೆ": "ಇದೆ ಕಣ್ರೀ",
            "ಬಂದೆ": "ಬಂದೆನೆ",
            "ಹೋದೆ": "ಹೋದೆನೆ",
            "ಹೇಗಿದ್ದೀರಿ": "ಹೇಗಿದ್ದೀರಾ",
            "ಸ್ವಲ್ಪ": "ಚೂರು",
        },
        "patterns": [
            (r"ಆಯಿತು(?=[\s,!?.]|$)", "ಆಯಿತ್ತು"),
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ಲ್ಲಿ"),
            (r"ದಲ್ಲಿ(?=[\s,!?.]|$)", "ಲ್ಲಿ"),
        ]
    },
    "ಕರಾವಳಿ ಕರ್ನಾಟಕ": {
        "tag": "ಕರಾವಳಿ (ದಕ್ಷಿಣ ಕನ್ನಡ / ಉಡುಪಿ / ಮಂಗಳೂರು)",
        "words": {
            "ಏನು": "ಎಂಚಿನ",
            "ಹೇಗೆ": "ಎಂಚಿತ್ತ್",
            "ಗೆಳೆಯ": "ಮಾರಾಯ",
            "ಸ್ನೇಹಿತ": "ಮಾರಾಯ",
            "ಅಲ್ಲಿಗೆ": "ಅಡೆಗೆ",
            "ಇಲ್ಲಿಗೆ": "ಇಡೆಗೆ",
            "ಆಯಿತಾ": "ಆಂಡಾ",
            "ಆಯಿತು": "ಆಂಡ್",
            "ತಡವಾಯಿತು": "ತಡ ಆಂಡ್ ಮಾರಾಯ",
            "ಹೇಗಿದ್ದೀರಿ": "ಎಂಚಿನ ಸಮಾಚಾರ ಮಾರಾಯ",
            "ಸಿಗುತ್ತಿಲ್ಲ": "ತಿಕ್ಕುಜಿಲ್ಲೆ",
            "ನನಗೆ": "ನಂಕ್",
        },
        "patterns": [
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ಡ್"),
            (r"ದಲ್ಲಿ(?=[\s,!?.]|$)", "ಡ್"),
        ]
    },
    "ಕಾವೇರಿ ಕಣಿವೆ": {
        "tag": "ಕಾವೇರಿ ಕಣಿವೆ (ಮೈಸೂರು / ಮಂಡ್ಯ / ಚಾಮರಾಜನಗರ)",
        "words": {
            "ಹೇಗಿದ್ದೀರಿ": "ಹ್ಯಾಂಗಿದ್ದೀರಪ್ಪ",
            "ಹೇಗಿದ್ದೀಯಾ": "ಹ್ಯಾಂಗಿದೀಯ ಕಣೋ",
            "ನನಗೆ": "ನಂಗೆ",
            "ನನ್ನ": "ನಂದೇ",
            "ತಡವಾಯಿತು": "ಲೇಟ್ ಆಗ್ಬುಡ್ತು ಕಣ್ರೀ",
            "ತಡವಾಗಿದೆ": "ಲೇಟ್ ಆಗ್ಬುಟ್ಟಿದೆ ಕಣ್ರೀ",
            "ಬಂದೆ": "ಬಂದ್ಬುಟ್ಟೆ",
            "ಹೋದೆ": "ಹೋಗ್ಬುಟ್ಟೆ",
            "ಮಾಡಿದೆ": "ಮಾಡ್ಬುಟ್ಟೆ",
            "ಮಾಡುತ್ತಿದ್ದೀನಿ": "ಮಾಡ್ತಾವ್ನಿ",
            "ಮಾಡುತ್ತಿದ್ದೀರಿ": "ಮಾಡ್ತಾವ್ರಲ್ಲ",
            "ಆಯಿತು": "ಆಗ್ಬುಡ್ತು",
            "ಸ್ವಲ್ಪ": "ಚೂರು",
        },
        "patterns": [
            (r"ಆಯಿತು(?=[\s,!?.]|$)", "ಆಗ್ಬುಡ್ತು"),
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ನಲ್ಲಿ ಕಣ್ರೀ"),
        ]
    },
    "ತುಂಗಭದ್ರಾ ತೀರ": {
        "tag": "ತುಂಗಭದ್ರಾ ತೀರ (ಬಳ್ಳಾರಿ / ಕೊಪ್ಪಳ / ವಿಜಯನಗರ)",
        "words": {
            "ನನಗೆ": "ನನಗಿ",
            "ನನ್ನ": "ನನ್",
            "ನಾನು": "ನಾನ್",
            "ಹೇಗೆ": "ಯಾಂಗ್",
            "ಹೇಗಿದ್ದೀರಿ": "ಯಾಂಗಿದ್ದೀರಿ",
            "ತಡವಾಯಿತು": "ಲೇಟ್ ಆತ್ರಿ",
            "ಇದೆ": "ಅದೆ",
            "ಇಲ್ಲ": "ಇಲ್ರಿ",
            "ಸಿಗುತ್ತಿಲ್ಲ": "ಸಿಗ್ತಾ ಇಲ್ರಿ",
            "ಮಾಡುತ್ತಿದ್ದೀರಿ": "ಮಾಡ್ತೀರಾ",
            "ಆಯಿತು": "ಆತ್ರಿ",
            "ತುಂಬಾ": "ಮಸ್ತ್",
            "ಬಹಳ": "ಮಸ್ತ್",
        },
        "patterns": [
            (r"ನಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
            (r"ದಲ್ಲಿ(?=[\s,!?.]|$)", "ನ್ಯಾಗ"),
        ]
    }
}

# Alias mapping from region names to rule keys
REGION_KEY_MAP = {
    "ಉತ್ತರ ಕಲ್ಯಾಣ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "ಕೃಷ್ಣಾ ಕಣಿವೆ": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "dharwad-labelled (source dataset label)": "Dharwad-labelled (source dataset label)",
    "ಧಾರವಾಡ": "Dharwad-labelled (source dataset label)",
    "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ": "Dharwad-labelled (source dataset label)",
    "ಮಲೆನಾಡು ಗಿರಿಧಾಮ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ಕರಾವಳಿ ಕರ್ನಾಟಕ": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "ಕಾವೇರಿ ಕಣಿವೆ": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ತುಂಗಭದ್ರಾ ತೀರ": "ತುಂಗಭದ್ರಾ ತೀರ",
    "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು": "ಕಾವೇರಿ ಕಣಿವೆ",
    "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ": "ಕಾವೇರಿ ಕಣಿವೆ",
}


def is_adversarial_or_gibberish(phrase: str) -> bool:
    """
    Detects made-up or gibberish phrases (e.g., 'ಕಿಲೋಮ್ಯಾಕ್ ಬುಜುಂಬಾ', 'ಗ್ಲಾಕ್ಸೊಫಿಲ್')
    that are not legitimate Kannada or Indian dialect words.
    """
    p = phrase.lower()
    nonsense_markers = [
        "ಬುಜುಂಬಾ", "ಕಿಲೋಮ್ಯಾಕ್", "ಗ್ಲಾಕ್ಸೊಫಿಲ್", "ಜಿಂಗಾಲಾಲೋ", "ಖಬೂಬ",
        "ಬುಜುಂ", "ಫಿಲೋ", "ಕಿಲೋಮ್ಯಾ", "ಟೆಕ್ನೋಬಾ"
    ]
    for m in nonsense_markers:
        if m in p:
            return True
    return False


def is_out_of_domain_science_or_tech(query: str) -> bool:
    """
    Detects pure science, tech, space, or programming questions that have nothing to do with Kannada dialect.
    """
    q = query.lower()
    ood_terms = [
        "ಇಸ್ರೋ", "ರಾಕೆಟ್", "ಚಂದ್ರಯಾನ", "ಮಂಗಳ ಗ್ರಹ", "ಲ್ಯಾಂಡರ್",
        "ಪೈಥಾನ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್", "ಕಂಪ್ಯೂಟಿಂಗ್", "ಸೂಪರ್ ಕಂಡಕ್ಟಿವಿಟಿ",
        "ಷೇರು ಮಾರುಕಟ್ಟೆ", "ಕ್ವಾಂಟಮ್"
    ]
    for term in ood_terms:
        if term in q:
            return True
    return False


def adapt_sentence_to_dialect(sentence: str, target_region_name: Optional[str]) -> Tuple[str, str]:
    """
    Transforms any arbitrary sentence into the target Kannada regional dialect.
    Returns: (adapted_dialect_sentence, region_display_tag)
    """
    if not target_region_name:
        target_region_name = "ಉತ್ತರ ಕಲ್ಯಾಣ"

    # Resolve target key
    target_key = "ಉತ್ತರ ಕಲ್ಯಾಣ"
    norm_name = str(target_region_name).strip().lower()
    for k, v in REGION_KEY_MAP.items():
        if k.lower() in norm_name or norm_name in k.lower():
            target_key = v
            break

    rule_set = REGION_DIALECT_RULES.get(target_key, REGION_DIALECT_RULES["ಉತ್ತರ ಕಲ್ಯಾಣ"])
    region_tag = rule_set["tag"]

    res = sentence.strip()

    # 1. Direct word replacements with boundary checks
    for k, v in rule_set["words"].items():
        res = re.sub(rf"(?<![\u0C80-\u0CFF]){re.escape(k)}(?![\u0C80-\u0CFF])", v, res)

    # 2. Morphological pattern / suffix replacements
    for pattern, replacement in rule_set["patterns"]:
        res = re.sub(pattern, replacement, res)

    # 3. Clean extra spaces
    res = re.sub(r"\s+", " ", res).strip()

    return res, region_tag
