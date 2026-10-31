import os
import shutil
import time
import pandas as pd
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# File Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")
DATASET_CSV = os.path.join(PROJECT_ROOT, "final_best_kannada_rag_dataset.csv")

def build_vector_database(batch_size: int = 500):
    print("=" * 70)
    print("Swara-Setu RAG - ChromaDB Vector Store Builder")
    print("Loading: final_best_kannada_rag_dataset.csv")
    print("=" * 70)

    if not os.path.exists(DATASET_CSV):
        raise FileNotFoundError(f"Master dataset not found at: {DATASET_CSV}")

    # 1. Load dataset with Pandas
    print(f"Reading master dataset: {DATASET_CSV}...")
    df = pd.read_csv(DATASET_CSV)
    print(f"Total rows in dataset: {len(df)}")

    # 2. Extract Document objects WITHOUT standard text splitters
    # Using 'retrieval_text' as the intact page_content
    # Extract metadata payloads: record_id, record_type, region_name, theme, dialect_status
    docs = []
    for _, row in df.iterrows():
        raw_content = row.get("retrieval_text", "")
        if pd.isna(raw_content):
            continue
        page_content = str(raw_content).strip()
        if not page_content or page_content == "nan":
            continue

        def safe_str(val):
            return "" if pd.isna(val) else str(val).strip()

        metadata = {
            "record_id": safe_str(row.get("record_id")),
            "record_type": safe_str(row.get("record_type")),
            "region_name": safe_str(row.get("region_name")),
            "theme": safe_str(row.get("theme")),
            "dialect_status": safe_str(row.get("dialect_status")),
        }
        docs.append(Document(page_content=page_content, metadata=metadata))

    print(f"Extracted {len(docs)} intact Document objects for indexing.")
    if not docs:
        print("No documents found to index. Aborting.")
        return

    # 3. Clear old Chroma vector index
    if os.path.exists(CHROMA_DIR):
        print(f"Clearing existing vector index directory: {CHROMA_DIR}...")
        try:
            shutil.rmtree(CHROMA_DIR)
            time.sleep(1)
        except Exception as rm_err:
            print(f"Notice during directory cleanup: {rm_err}")

    # 4. Initialize Multilingual Embeddings explicitly optimized for Indic & Kannada
    print("\nInitializing Multilingual Hugging Face Embeddings ('paraphrase-multilingual-MiniLM-L12-v2')...")
    embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")

    # 5. Build vector database in batches for efficient ingestion
    print(f"\nBuilding fresh ChromaDB collection in batches of {batch_size}...")
    t_start = time.time()

    # Initialize collection with first batch
    first_batch = docs[:batch_size]
    vectorstore = Chroma.from_documents(
        documents=first_batch,
        embedding=embeddings,
        persist_directory=CHROMA_DIR
    )
    print(f"Indexed batch 1/{((len(docs)-1)//batch_size)+1} ({len(first_batch)} docs)")

    # Ingest remaining batches
    total_batches = ((len(docs) - 1) // batch_size) + 1
    for b_idx in range(1, total_batches):
        start_idx = b_idx * batch_size
        end_idx = min(start_idx + batch_size, len(docs))
        batch_docs = docs[start_idx:end_idx]
        vectorstore.add_documents(batch_docs)
        print(f"Indexed batch {b_idx + 1}/{total_batches} ({end_idx}/{len(docs)} docs)")

    elapsed = time.time() - t_start
    print("=" * 70)
    print(f"SUCCESS: ChromaDB build complete in {elapsed:.1f}s ({elapsed/60:.2f} mins)!")
    print(f"Total documents persisted: {vectorstore._collection.count()}")
    print(f"Database saved to: {CHROMA_DIR}")
    print("=" * 70)

if __name__ == "__main__":
    build_vector_database()
