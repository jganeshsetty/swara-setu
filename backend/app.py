import importlib
import os
import re
import sys

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Set UTF-8 encoding for standard output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception as encoding_err:
        print(f"Notice: stdout encoding reconfigure: {encoding_err}")

# Load optional .env file if available
load_dotenv()

# ==============================================================================
# === HUGGING FACE API KEY ===
# Loaded securely from environment or backend/.env file
HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
if HF_TOKEN:
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_TOKEN


from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint

# Resolve chain functions across LangChain versions without IDE import squiggles
create_retrieval_chain = None
create_stuff_documents_chain = None

for _mod_name in ("langchain_classic.chains", "langchain.chains"):
    try:
        _mod = importlib.import_module(_mod_name)
        create_retrieval_chain = getattr(_mod, "create_retrieval_chain", None)
        if create_retrieval_chain:
            break
    except ModuleNotFoundError:
        pass

for _mod_name in ("langchain_classic.chains.combine_documents", "langchain.chains.combine_documents"):
    try:
        _mod = importlib.import_module(_mod_name)
        create_stuff_documents_chain = getattr(_mod, "create_stuff_documents_chain", None)
        if create_stuff_documents_chain:
            break
    except ModuleNotFoundError:
        pass

app = FastAPI(
    title="Swara-Setu Kannada RAG API",
    description="Hugging Face powered RAG Agent for Karnataka Kannada Dialects",
    version="1.0.0",
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
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

print("Loading Hugging Face Embeddings...")
embeddings = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")

print("Connecting to ChromaDB...")
# ChromaDB populated with 350 dialect and paragraph entries from both CSVs
vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

print("Initializing Hugging Face LLM...")
hf_llm = None
try:
    hf_llm = HuggingFaceEndpoint(
        repo_id="mistralai/Mistral-7B-Instruct-v0.3",
        task="text-generation",
        max_new_tokens=512,
        temperature=0.3,
        repetition_penalty=1.03,
        huggingfacehub_api_token=HF_TOKEN,
    )
except Exception as llm_init_err:
    print(f"Warning: HuggingFaceEndpoint initialization: {llm_init_err}")

# Instruct the model to use the context
prompt = ChatPromptTemplate.from_template("""
You are Swara-Setu, a helpful assistant. Answer the user's question in Kannada using ONLY the provided context below. If the answer is not in the context, say "I do not have information on that in my database."

Context:
{context}

Question:
{input}

Answer (in Kannada):
""")

rag_chain = None
if hf_llm and create_retrieval_chain and create_stuff_documents_chain:
    try:
        document_chain = create_stuff_documents_chain(hf_llm, prompt)
        rag_chain = create_retrieval_chain(retriever, document_chain)
    except Exception as chain_init_err:
        print(f"Notice: Chains initialization: {chain_init_err}")


class UserQuery(BaseModel):
    question: str


def generate_direct_rag_kannada_response(query: str, docs: list) -> str:
    """
    Direct high-accuracy RAG synthesis directly from the retrieved dialect documents.
    Used seamlessly when Hugging Face cloud providers require pre-paid server credits.
    """
    if not docs:
        return "ಕ್ಷಮಿಸಿ, ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಈ ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ."

    matched_phrases = []
    for d in docs:
        content = d.page_content
        # Extract regional and standard forms
        reg_match = re.search(r"ಪ್ರಾದೇಶಿಕ (?:ಉಪಭಾಷೆ|ಕನ್ನಡ ರೂಪ) \(([^)]+)\):\s*([^\n]+)", content)
        std_match = re.search(r"(?:ಪ್ರಮಾಣಿತ ಕನ್ನಡ|ವಾಕ್ಯ)[^:]*:\s*([^\n]+)", content)
        meaning_match = re.search(r"(?:ಇಂಗ್ಲಿಷ್ ಅರ್ಥ|English)[^:]*:\s*([^\n]+)", content)

        if reg_match:
            region = reg_match.group(1).strip()
            regional_phrase = reg_match.group(2).strip()
            std_phrase = std_match.group(1).strip() if std_match else ""
            meaning = meaning_match.group(1).strip() if meaning_match else ""
            matched_phrases.append({
                "region": region,
                "regional": regional_phrase,
                "standard": std_phrase,
                "meaning": meaning,
            })

    if matched_phrases:
        # Check if the user specifically asked for a specific region (e.g. ಉತ್ತರ ಕಲ್ಯಾಣ)
        selected_match = matched_phrases[0]
        for item in matched_phrases:
            # If region name appears in query, prioritize that region!
            region_base = item['region'].split('(')[0].split('-')[0].strip()
            if region_base in query:
                selected_match = item
                break

        resp = f"ದತ್ತಾಂಶದ ಪ್ರಕಾರ ({selected_match['region']}):\n"
        resp += f"• ಪ್ರಾದೇಶಿಕ ಶೈಲಿ: \"{selected_match['regional']}\"\n"
        if selected_match['standard']:
            resp += f"• ಪ್ರಮಾಣಿತ ಕನ್ನಡ: \"{selected_match['standard']}\"\n"
        if selected_match['meaning']:
            resp += f"• ಅರ್ಥ (Meaning): {selected_match['meaning']}"

        # If there are other distinct regions in the retrieved docs, display them too
        other_regions = [item for item in matched_phrases if item['region'] != selected_match['region']]
        if other_regions:
            resp += "\n\nಇತರ ಪ್ರಾದೇಶಿಕ ರೂಪಗಳು:\n"
            for item in other_regions[:3]:
                resp += f"• {item['region']}: \"{item['regional']}\"\n"
        return resp

    # Fallback to presenting the retrieved context clearly in Kannada
    return f"ಸ್ವರಸೇತು ದತ್ತಾಂಶದ ಪ್ರಕಾರ:\n{docs[0].page_content}"


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Swara-Setu Kannada RAG API",
        "vector_count": vectorstore._collection.count(),
        "chroma_dir": CHROMA_DIR,
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "vectors": vectorstore._collection.count()}


@app.post("/ask")
async def ask_question(query: UserQuery):
    try:
        if not query.question.strip():
            return {"error": "ಖಾಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ (Empty question)."}

        # 1. Retrieve the most relevant documents from ChromaDB vectorstore
        docs = retriever.invoke(query.question)

        # 2. Try the Hugging Face Cloud chain first
        if rag_chain:
            try:
                response = rag_chain.invoke({"input": query.question})
                if response and "answer" in response and response["answer"].strip():
                    return {"answer": response["answer"], "source": "huggingface_chain"}
            except Exception as hf_err:
                print(f"Hugging Face Cloud provider returned: {hf_err}")

        # 3. Direct RAG response synthesis directly grounded on ChromaDB vectors
        answer = generate_direct_rag_kannada_response(query.question, docs)
        return {"answer": answer, "source": "chromadb_rag_grounded"}

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
