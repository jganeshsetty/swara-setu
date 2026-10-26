import os
import pandas as pd
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

MULTI_PARAGRAPH_CSV = os.path.join(PROJECT_ROOT, "kannada_multi_paragraph_RAG_dataset.csv")
REGIONAL_SENTENCES_CSV = os.path.join(PROJECT_ROOT, "kannada_regional_30_sentences_10_regions.csv")

def build_vector_database():
    print("=" * 60)
    print("Swara-Setu RAG - ChromaDB Vector Store Builder")
    print("=" * 60)

    docs = []

    # 1. Ingest Multi-Paragraph RAG dataset if present
    if os.path.exists(MULTI_PARAGRAPH_CSV):
        print(f"Reading dataset: {MULTI_PARAGRAPH_CSV}")
        df_para = pd.read_csv(MULTI_PARAGRAPH_CSV)
        for _, row in df_para.iterrows():
            content = (
                f"ವಿಷಯ (Theme): {row.get('theme', '')}\n"
                f"ಪ್ರಮಾಣಿತ ಕನ್ನಡ (Standard Kannada): {row.get('textbook_kannada', '')}\n"
                f"ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆ ({row.get('region_name', '')}): {row.get('regional_kannada', '')}\n"
                f"ಇಂಗ್ಲಿಷ್ ಅರ್ಥ (English Meaning): {row.get('english_meaning', '')}"
            )
            metadata = {
                "source": "multi_paragraph",
                "paragraph_id": str(row.get("paragraph_id", "")),
                "theme": str(row.get("theme", "")),
                "region_id": str(row.get("region_id", "")),
                "region_name": str(row.get("region_name", "")),
            }
            docs.append(Document(page_content=content, metadata=metadata))
        print(f"Loaded {len(df_para)} multi-paragraph entries.")

    # 2. Ingest 30 Sentences x 10 Regions dataset if present
    if os.path.exists(REGIONAL_SENTENCES_CSV):
        print(f"Reading dataset: {REGIONAL_SENTENCES_CSV}")
        df_sent = pd.read_csv(REGIONAL_SENTENCES_CSV)
        for _, row in df_sent.iterrows():
            content = (
                f"ವಾಕ್ಯ (Sentence): {row.get('textbook_kannada', '')}\n"
                f"ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ರೂಪ ({row.get('region_name_kn', '')} - {row.get('districts_in_region', '')}): {row.get('regional_kannada', '')}\n"
                f"ಇಂಗ್ಲಿಷ್ ಅರ್ಥ (English): {row.get('english_meaning', '')}"
            )
            metadata = {
                "source": "regional_sentence",
                "sentence_id": str(row.get("sentence_id", "")),
                "region_name": str(row.get("region_name_kn", "")),
                "districts": str(row.get("districts_in_region", "")),
            }
            docs.append(Document(page_content=content, metadata=metadata))
        print(f"Loaded {len(df_sent)} regional sentence entries.")

    print(f"\nTotal documents to index: {len(docs)}")

    print("\nInitializing Hugging Face multilingual embeddings ('paraphrase-multilingual-MiniLM-L12-v2')...")
    embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")

    print(f"Persisting vectors into ChromaDB directory: {CHROMA_DIR}...")
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=CHROMA_DIR
    )

    print("\nSUCCESS: ChromaDB build complete!")
    print(f"Database saved to: {CHROMA_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    build_vector_database()
