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
# === NVIDIA NIM LLM CONFIGURATION ===
# ==============================================================================
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "").strip()
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").strip()
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct").strip()

# Hugging Face Access Token (optional fallback)
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

hf_llm = None
if HF_TOKEN:
    try:
        print("Initializing Hugging Face LLM...")
        hf_llm = HuggingFaceEndpoint(
            repo_id="mistralai/Mistral-7B-Instruct-v0.3",
            task="text-generation",
            max_new_tokens=512,
            temperature=0.3,
            repetition_penalty=1.03,
            huggingfacehub_api_token=HF_TOKEN,
            timeout=5,
        )
    except Exception as llm_init_err:
        print(f"Warning: HuggingFaceEndpoint initialization: {llm_init_err}")
else:
    print("No HF_TOKEN provided. Running in pure offline local RAG mode.")

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
    Conversational RAG synthesis: Formats retrieved Kannada dialect knowledge
    into natural, polite, human-like spoken Kannada (speech and chat friendly).
    Guarantees no cross-sentence contamination.
    """
    if not docs:
        return "ಕ್ಷಮಿಸಿ, ಈ ಬಗ್ಗೆ ನನ್ನಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ಬೇರೆ ಯಾವುದೇ ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಪದ ಅಥವಾ ವಾಕ್ಯದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!"

    # Parse structured information and keep track of document metadata
    matched_items = []
    for d in docs:
        content = d.page_content
        meta = getattr(d, "metadata", {}) or {}

        reg_match = re.search(r"ಪ್ರಾದೇಶಿಕ (?:ಉಪಭಾಷೆ|ಕನ್ನಡ ರೂಪ) \(([^)]+)\):\s*([^\n\r]+)", content)
        std_match = re.search(r"(?:ಪ್ರಮಾಣಿತ ಕನ್ನಡ|ವಾಕ್ಯ)[^:]*:\s*([^\n\r]+)", content)
        meaning_match = re.search(r"(?:ಇಂಗ್ಲಿಷ್ ಅರ್ಥ|English)[^:]*:\s*([^\n\r]+)", content)
        theme_match = re.search(r"ವಿಷಯ \(Theme\):\s*([^\n\r]+)", content)

        if reg_match:
            region_str = reg_match.group(1).strip()
            # Clean region name for spoken speech (e.g. "ಉತ್ತರ ಕಲ್ಯಾಣ" instead of long district list)
            region_clean = region_str.split("-")[0].split("(")[0].strip()
            matched_items.append({
                "region_full": region_str,
                "region_clean": region_clean,
                "regional": reg_match.group(2).strip(),
                "standard": std_match.group(1).strip() if std_match else "",
                "meaning": meaning_match.group(1).strip() if meaning_match else "",
                "theme": theme_match.group(1).strip() if theme_match else "",
                "sentence_id": str(meta.get("sentence_id", "")),
                "paragraph_id": str(meta.get("paragraph_id", "")),
            })

    if not matched_items:
        clean_first = docs[0].page_content.replace("•", "").replace(":", " - ")
        return f"ಹೌದು, ನೀವು ಕೇಳಿದ ವಿಷಯದ ಬಗ್ಗೆ ನಮ್ಮ ದತ್ತಾಂಶದಲ್ಲಿ ಹೀಗಿದೆ:\n\n{clean_first}"

    # 1. Determine the best match based on user query
    selected = matched_items[0]

    # Region/district keywords mapping (Kannada & English)
    DISTRICT_MAP = {
        "ಧಾರವಾಡ": "Dharwad", "ಗದಗ": "Gadag", "ಹಾವೇರಿ": "Haveri",
        "ಬೀದರ್": "Bidar", "ಕಲಬುರಗಿ": "Kalaburagi", "ಯಾದಗಿರಿ": "Yadgir",
        "ರಾಯಚೂರು": "Raichur", "ಕೊಪ್ಪಳ": "Koppal", "ಬಳ್ಳಾರಿ": "Ballari", "ವಿಜಯನಗರ": "Vijayanagara",
        "ಬೆಳಗಾವಿ": "Belagavi", "ಬಾಗಲಕೋಟೆ": "Bagalkote", "ವಿಜಯಪುರ": "Vijayapura",
        "ಉಡುಪಿ": "Udupi", "ಮಂಗಳೂರು": "Mangaluru", "ದಕ್ಷಿಣ ಕನ್ನಡ": "Dakshina Kannada", "ಉತ್ತರ ಕನ್ನಡ": "Uttara Kannada",
        "ಶಿವಮೊಗ್ಗ": "Shivamogga", "ಚಿಕ್ಕಮಗಳೂರು": "Chikkamagaluru", "ಕೊಡಗು": "Kodagu",
        "ದಾವಣಗೆರೆ": "Davanagere", "ಚಿತ್ರದುರ್ಗ": "Chitradurga", "ತುಮಕೂರು": "Tumakuru",
        "ಮೈಸೂರು": "Mysuru", "ಮಂಡ್ಯ": "Mandya", "ಚಾಮರಾಜನಗರ": "Chamarajanagara",
        "ಹಾಸನ": "Hassan", "ರಾಮನಗರ": "Ramanagara",
        "ಬೆಂಗಳೂರು": "Bengaluru", "ಕೋಲಾರ": "Kolar",
    }

    # Find if any district or region keyword is in user query
    target_tokens = []
    for kn_word, en_word in DISTRICT_MAP.items():
        if kn_word in query or en_word.lower() in query.lower():
            target_tokens.extend([kn_word, en_word])

    for item in matched_items:
        full_text = item["region_full"] + " " + item["region_clean"]
        if any(tok.lower() in full_text.lower() for tok in target_tokens):
            selected = item
            break
        elif item["region_clean"] in query:
            selected = item
            break

    # 2. Find siblings that belong to the EXACT same sentence / paragraph
    same_sentence_siblings = []
    has_id = bool(selected["sentence_id"] or selected["paragraph_id"])

    for item in matched_items:
        if item == selected:
            continue
        if has_id:
            # Strictly match sentence_id or paragraph_id
            if selected["sentence_id"] and item["sentence_id"] == selected["sentence_id"]:
                same_sentence_siblings.append(item)
            elif selected["paragraph_id"] and item["paragraph_id"] == selected["paragraph_id"]:
                same_sentence_siblings.append(item)
        else:
            # Fallback comparison by standard phrase equality
            if selected["standard"] and item["standard"] == selected["standard"]:
                same_sentence_siblings.append(item)

    # De-duplicate siblings by region
    unique_siblings = []
    seen_regions = {selected["region_clean"]}
    for sib in same_sentence_siblings:
        if sib["region_clean"] not in seen_regions:
            seen_regions.add(sib["region_clean"])
            unique_siblings.append(sib)

    # 3. Construct natural, conversational spoken Kannada response
    is_meaning_query = any(k in query for k in ["ಅರ್ಥ", "meaning", "ಅಂದ್ರೆ", "ಏನು"])
    is_region_query = any(k in query for k in ["ಹೇಗೆ", "ಹ್ಯಾಂಗೆ", "ಹೇಳ್ತಾರೆ", "ಶೈಲಿ", "ರೂಪ"])

    spoken_parts = []

    if is_meaning_query and selected["meaning"]:
        spoken_parts.append(
            f'"{selected["regional"]}" ಅಂದರೆ "{selected["meaning"]}" ಅಂತ ಅರ್ಥ. '
            f'ಇದನ್ನು {selected["region_clean"]} ಭಾಗದಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಬಳಸುತ್ತಾರೆ.'
        )
        if selected["standard"]:
            spoken_parts.append(f'ಪ್ರಮಾಣಿತ ಕನ್ನಡದಲ್ಲಿ ಇದನ್ನು "{selected["standard"]}" ಎಂದು ಹೇಳಬಹುದು.')
    elif is_region_query:
        spoken_parts.append(
            f'ಹೌದು! {selected["region_clean"]} ಭಾಗದಲ್ಲಿ ಇದನ್ನು "{selected["regional"]}" ಅಂತ ಹೇಳ್ತಾರೆ.'
        )
        if selected["standard"]:
            spoken_parts.append(f'(ಪ್ರಮಾಣಿತ ಕನ್ನಡ ರೂಪ: "{selected["standard"]}")')
        if selected["meaning"]:
            spoken_parts.append(f'ಅರ್ಥ: {selected["meaning"]}.')
    else:
        spoken_parts.append(
            f'ಖಂಡಿತ! {selected["region_clean"]} ಶೈಲಿಯಲ್ಲಿ ಇದನ್ನು "{selected["regional"]}" ಅಂತ ಮಾತಾಡ್ತಾರೆ.'
        )
        if selected["standard"]:
            spoken_parts.append(f'ಸಾಮಾನ್ಯವಾಗಿ ನಾವು "{selected["standard"]}" ಅಂತೀವಲ್ಲ, ಅದೇ ಇದು.')
        if selected["meaning"]:
            spoken_parts.append(f'ಅರ್ಥ: {selected["meaning"]}.')

    # Conversational comparison with other regions (ONLY for the exact same sentence!)
    if unique_siblings:
        spoken_parts.append("\nಇದೇ ಮಾತನ್ನು ಇತರ ಭಾಗಗಳಲ್ಲಿ ಹೀಗೆ ಹೇಳ್ತಾರೆ:")
        for sib in unique_siblings[:3]:
            spoken_parts.append(f'• {sib["region_clean"]} ಕಡೆ: "{sib["regional"]}"')

    return "\n".join(spoken_parts)


def call_nvidia_llm(messages: list, max_tokens: int = 500, temperature: float = 0.3) -> str:
    """
    Direct HTTP inference to NVIDIA NIM API with robust timeouts.
    Works seamlessly without needing extra package dependencies.
    """
    if not NVIDIA_API_KEY or NVIDIA_API_KEY.startswith("your_nvidia"):
        return ""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": NVIDIA_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    try:
        import requests
        url = f"{NVIDIA_BASE_URL.rstrip('/')}/chat/completions"
        res = requests.post(url, headers=headers, json=payload, timeout=25)
        if res.status_code == 200:
            data = res.json()
            choice = data["choices"][0]
            msg = choice.get("message", {})
            text = (msg.get("content") or msg.get("reasoning_content") or msg.get("reasoning") or "").strip()
            return text
        else:
            print(f"[NVIDIA NIM Error {res.status_code}]: {res.text}")
            return ""
    except Exception as err:
        print(f"[NVIDIA NIM Exception]: {err}")
        return ""


def generate_nvidia_intelligent_dialect_response(query: str, retrieved_context: str = "") -> str:
    """
    Uses NVIDIA LLM to synthesize an authentic, respectful, warm spoken Kannada answer.
    If context is present, it grounds in it; if not, it acts as a linguistic expert
    explaining authentic variations across Karnataka regions.
    """
    system_prompt = (
        "You are Swara-Setu (ಸ್ವರಸೇತು), an authentic and respectful AI Kannada language assistant "
        "documenting the diverse regional dialects of Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ, ಕರಾವಳಿ, ಮೈಸೂರು-ಮಂಡ್ಯ, "
        "ಮಲೆನಾಡು, ಬೆಂಗಳೂರು).\n\n"
        "Instructions:\n"
        "1. Always reply in natural, polite spoken Kannada (ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ಉತ್ತರಿಸಿ).\n"
        "2. If the user provides a sentence or asks how something is said, identify its tone/region, "
        "explain its meaning simply, and show how other regions speak it (e.g. ಧಾರವಾಡ, ಮಂಗಳೂರು, ಮಂಡ್ಯ).\n"
        "3. Write naturally as a human speaks — do NOT use robotic bullet points or excessive symbols.\n"
        "4. If context from the database is provided, ground your facts in that context."
    )

    user_prompt = f"User Query: {query}\n"
    if retrieved_context:
        user_prompt += f"\nRelevant Database Records:\n{retrieved_context}\n"
    user_prompt += "\nPlease provide a warm, conversational spoken Kannada explanation:"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    return call_nvidia_llm(messages)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Swara-Setu Kannada RAG API",
        "nvidia_enabled": bool(NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("your_nvidia")),
        "nvidia_model": NVIDIA_MODEL,
        "vector_count": vectorstore._collection.count(),
        "chroma_dir": CHROMA_DIR,
    }


from bhashini_service import bhashini_service


class AudioQuery(BaseModel):
    audio_base64: str


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "nvidia_configured": bool(NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("your_nvidia")),
        "bhashini_configured": bhashini_service.is_configured(),
        "vectors": vectorstore._collection.count(),
    }


def query_rag_pipeline(user_q: str) -> dict:
    """Internal core executor for the Kannada RAG pipeline."""
    # 1. Retrieve the most relevant documents along with similarity distance
    docs_with_scores = vectorstore.similarity_search_with_score(user_q, k=4)
    best_doc, best_score = docs_with_scores[0] if docs_with_scores else (None, 999.0)

    # Distance threshold: below 0.65 is high confidence match in database
    is_database_match = best_score < 0.65
    retrieved_docs = [d for d, s in docs_with_scores]

    # 2. If NVIDIA API Key is configured, use the NVIDIA LLM for rich synthesis & fallback
    if NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("your_nvidia"):
        if is_database_match:
            context_str = "\n---\n".join([d.page_content for d in retrieved_docs[:3]])
            llm_response = generate_nvidia_intelligent_dialect_response(user_q, context_str)
            if llm_response:
                return {"answer": llm_response, "source": "nvidia_rag_grounded", "score": float(best_score)}
        else:
            llm_fallback = generate_nvidia_intelligent_dialect_response(user_q, "")
            if llm_fallback:
                return {"answer": llm_fallback, "source": "nvidia_dialect_fallback", "score": float(best_score)}

    # 3. Direct RAG response fallback if NVIDIA key is not set or network fails
    if is_database_match:
        answer = generate_direct_rag_kannada_response(user_q, retrieved_docs)
        return {"answer": answer, "source": "chromadb_rag_grounded", "score": float(best_score)}
    else:
        return {
            "answer": "ಕ್ಷಮಿಸಿ, ಈ ನಿರ್ದಿಷ್ಟ ವಾಕ್ಯದ ಬಗ್ಗೆ ನನ್ನ ದತ್ತಾಂಶದಲ್ಲಿ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ದಿನನಿತ್ಯದ ಮಾತುಕತೆ, ಮಾರುಕಟ್ಟೆ, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ ನೋಡಬಹುದು!",
            "source": "chromadb_unseen_threshold",
            "score": float(best_score),
        }


@app.post("/ask")
async def ask_question(query: UserQuery):
    try:
        user_q = query.question.strip()
        if not user_q:
            return {"error": "ಖಾಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ (Empty question)."}

        result = query_rag_pipeline(user_q)
        return result

    except Exception as e:
        return {"error": str(e)}


@app.post("/api/voice-chat")
async def voice_chat(audio_query: AudioQuery):
    """
    Native Kannada Voice RAG:
    1. Base64 Audio -> Bhashini ASR -> Kannada Text
    2. Kannada Text -> Native RAG Pipeline -> Kannada Answer Text
    3. Kannada Answer Text -> Bhashini TTS -> Base64 Audio Response
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

        # Step 2: Feed directly to the existing Kannada RAG pipeline
        rag_result = query_rag_pipeline(user_kannada_text)
        answer_text = rag_result.get("answer", "")

        # Clean answer text for TTS (strip bullets, asterisks, English labels)
        clean_tts_text = re.sub(r"[•*#_`]", "", answer_text)
        clean_tts_text = re.sub(r"\(.*?\)", "", clean_tts_text)
        clean_tts_text = re.sub(r"(?:ಇಂಗ್ಲಿಷ್ ಅರ್ಥ|English).*$", "", clean_tts_text, flags=re.MULTILINE)
        clean_tts_text = re.sub(r"\s+", " ", clean_tts_text).strip()

        # Step 3: Text-to-Speech via Bhashini TTS
        print(f"[Voice Chat] Converting RAG answer to Kannada speech with Bhashini...")
        audio_base64_response = bhashini_service.convert_text_to_speech(clean_tts_text or answer_text)

        return {
            "kannada_transcript": user_kannada_text,
            "answer": answer_text,
            "audio_response_base64": audio_base64_response,
            "source": rag_result.get("source", "rag_pipeline"),
        }

    except Exception as e:
        print(f"[Voice Chat Error]: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
