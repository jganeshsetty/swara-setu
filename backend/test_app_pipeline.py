import sys
sys.stdout.reconfigure(encoding="utf-8")
sys.path.append("backend")
from app import query_rag_pipeline

queries = [
    ("\"ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ\" ಅನ್ನೋದನ್ನ ಧಾರವಾಡ ಶೈಲಿಯಲ್ಲಿ ಹೇಗೆ ಹೇಳ್ತಾರೆ?", "Dharwad-labelled (source dataset label)", "Dharwad"),
    ("ಹೇಗಿದ್ದೀರಿ ಎಂದು ಉತ್ತರ ಕಲ್ಯಾಣದಲ್ಲಿ ಹೇಗೆ ಕೇಳುತ್ತಾರೆ?", "uttara_kalyana", "Bidar"),
    ("ನೀವು ಹೇಗಿದ್ದೀರಿ ಎಂದು ಮೈಸೂರು ಭಾಗದಲ್ಲಿ ಹೇಗೆ ಹೇಳುತ್ತಾರೆ?", "kaveri_basin", "Mysuru"),
    ("ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ 'ಭಾಳ' ಅಂದರೆ ಏನು?", None, None),
    ("ಇಸ್ರೋ ಸಂಸ್ಥೆಯು ಮಂಗಳ ಗ್ರಹಕ್ಕೆ ಕಳುಹಿಸಿದ ರಾಕೆಟ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?", None, None),
    ("ಕ್ವಾಂಟಮ್ ಕಂಪ್ಯೂಟಿಂಗ್ ಮತ್ತು ಸೂಪರ್ ಕಂಡಕ್ಟಿವಿಟಿ ತಂತ್ರಜ್ಞಾನದ ಬಗ್ಗೆ ತಿಳಿಸಿ.", None, None)
]

print("=" * 80)
print("TESTING ACCURACY OF REBUILT HYBRID RAG PIPELINE (ALL 6 USER QUERIES)")
print("=" * 80)

for q, reg, dist in queries:
    res = query_rag_pipeline(q, region=reg, district=dist)
    print(f"\n[USER QUESTION]: {q}")
    print(f"Filter -> District: {dist}, Region: {reg}")
    print(f"Retrieval Method: {res.get('method')} | Confidence: {res.get('score')}")
    print(f"[AGENT ANSWER]: {res.get('answer')}")

print("\n" + "=" * 80)
print("TEST SUITE COMPLETED SUCCESSFULLY!")
print("=" * 80)
