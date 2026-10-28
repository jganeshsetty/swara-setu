import sys
sys.stdout.reconfigure(encoding="utf-8")
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")
vs = Chroma(persist_directory="backend/chroma_db", embedding_function=embeddings)

print("--- Query 1: Dharwad ---")
res = vs.similarity_search_with_score("ಶಾಲೆಗೆ ಹೋಗಿದ್ದೆ", k=3, filter={"region_name": "Dharwad-labelled (source dataset label)"})
for doc, score in res:
    print(f"Score: {score:.3f} | Region: {doc.metadata.get('region_name')} | Content: {doc.page_content[:90]}...")

print("\n--- Query 2: Uttara Kalyana ---")
res2 = vs.similarity_search_with_score("ಹೇಗಿದ್ದೀರಿ", k=3, filter={"region_name": "ಉತ್ತರ ಕಲ್ಯಾಣ"})
for doc, score in res2:
    print(f"Score: {score:.3f} | Region: {doc.metadata.get('region_name')} | Content: {doc.page_content[:90]}...")

print("\n--- Query 3: Kaveri Basin (Old Mysore) ---")
res3 = vs.similarity_search_with_score("ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ", k=3, filter={"region_name": "ಕಾವೇರಿ ಕಣಿವೆ"})
for doc, score in res3:
    print(f"Score: {score:.3f} | Region: {doc.metadata.get('region_name')} | Content: {doc.page_content[:90]}...")
