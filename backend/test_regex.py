import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

sample_parallel = "Bookish/standard Kannada source: ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ.. Dharwad-labelled target form: ನಾ ನಿನ್ನೇ ಶಾಲಿಗ್ ಹೋಗಿದ್ನಿ.. Caveat: Parallel example from uploaded JSONL."
sample_lexicon = "Kannada headword: ನಾನು. Regional or colloquial form: ನಾ. Standard Kannada: ನಾನು. Romanized forms: naanu. Alternative spellings: naanu; nanu; naan; na. English meaning: I. Word category: pronoun. Project region: ಉತ್ತರ ಕಲ್ಯಾಣ"
sample_sentence = "Project region: ಉತ್ತರ ಕಲ್ಯಾಣ. Meaning/context: How are you?. Standard Kannada: ನೀವು ಹೇಗಿದ್ದೀರಿ?. Regional Kannada example: ನೀವ್ ಹ್ಯಾಂಗದೀರಿ?. Theme: daily-life phrase/sentence corpus"

def parse_doc(content, region_meta=""):
    # 1. Parallel sentence (Dharwad)
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
    m_proj = re.search(r"Project region:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    if m_reg:
        return {
            "type": "regional_sentence",
            "region": (m_proj.group(1).strip() if m_proj else region_meta),
            "regional": m_reg.group(1).strip(),
            "standard": m_std2.group(1).strip() if m_std2 else "",
            "meaning": m_mean2.group(1).strip() if m_mean2 else "",
        }

    # 3. Lexicon entry
    m_lex = re.search(r"Regional or colloquial form:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_std3 = re.search(r"Standard Kannada:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    m_mean3 = re.search(r"English meaning:\s*(.*?)(?:\.\.|\.|\n|$)", content)
    if m_lex:
        return {
            "type": "lexicon",
            "region": (m_proj.group(1).strip() if m_proj else region_meta),
            "regional": m_lex.group(1).strip(),
            "standard": m_std3.group(1).strip() if m_std3 else "",
            "meaning": m_mean3.group(1).strip() if m_mean3 else "",
        }

    return None

print("Parallel parse:", parse_doc(sample_parallel))
print("Lexicon parse:", parse_doc(sample_lexicon))
print("Sentence parse:", parse_doc(sample_sentence))
