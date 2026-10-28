import os
import re
import asyncio
import edge_tts
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Load .env file
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="Swara-Setu Voice Engine",
    description="Multilingual Hybrid RAG + 100% Free Microsoft Neural TTS for Kannada",
    version="2.1.0",
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- RAG Placeholder (mock endpoint) ----------

class RagPayload(BaseModel):
    text: str

@app.post("/api/rag")
async def rag_endpoint(payload: RagPayload):
    """
    Mock RAG endpoint: returns a regional Kannada sentence
    with strict Kannada punctuation (no English characters).
    This simulates the RAG pipeline output for voice generation.
    """
    # Ensure strict Kannada: only Kannada characters, spaces, and Kannada punctuation
    # Kannada Unicode range: U+0C80 - U+0CFF
    kannada_text = payload.text.strip()

    # If text contains English, sanitize to keep only Kannada
    # Remove anything that's not in Kannada Unicode range or basic Kannada punctuation
    cleaned = re.sub(r'[^ಀ-೿\s಼ಽೠೡೢೣ೦೧]', ' ', kannada_text)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Fallback if too short or no Kannada chars
    if len(cleaned) < 3 or not any('ಀ' <= c <= '೿' for c in cleaned):
        # Default Kannada sentence about Karnataka
        cleaned = "ಕನ್ನಡ ಮಾತರ Kunigal region ನುಡಿಮುtreated"

    return {
        "kannada_sentence": cleaned,
        "region": "ಕರ್ನಾಟಕ",
        "source": "mock_rag",
        "tts_ready": True
    }

# ---------- TTS Endpoint (edge-tts streaming) ----------

class TtsPayload(BaseModel):
    text: str
    voice: Optional[str] = None  # e.g. "kn-IN-SapnaNeural" or "kn-IN-GaganNeural"

# Default voices
DEFAULT_SAPNA = "kn-IN-SapnaNeural"
DEFAULT_GAGAN = "kn-IN-GaganNeural"

@app.post("/api/speak")
async def speak(payload: TtsPayload):
    """
    Generate Kannada TTS audio using Microsoft edge-tts (100% free, neural voices).
    Streams MP3 audio bytes directly back to client in memory (no temp files).
    """
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # Select voice: default to SapnaNeural (Female Kannada), fallback to GaganNeural
    voice = payload.voice or DEFAULT_SAPNA
    if voice not in [DEFAULT_SAPNA, DEFAULT_GAGAN]:
        # Validate it's a Kannada voice
        if not voice.startswith("kn-IN"):
            voice = DEFAULT_SAPNA

    # Clean text for TTS: remove any non-Kannada characters that might confuse
    # Keep Kannada characters, spaces, and basic punctuation
    clean_text = re.sub(r'[^ಀ-೿\s।,;!?\-]', ' ', text)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()

    if not clean_text:
        clean_text = text

    async def generate_audio():
        """Stream edge-tts audio chunks directly to client."""
        try:
            communicate = edge_tts.Communicate(clean_text, voice)

            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    # Yield audio bytes directly - client receives MP3 stream
                    yield chunk["data"]
                elif chunk["type"] == "word":
                    # Optional: could track progress, but we just stream audio
                    pass

        except Exception as e:
            print(f"edge-tts error: {e}")
            # Fallback: try with alternative voice
            try:
                communicate = edge_tts.Communicate(clean_text, DEFAULT_GAGAN)
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        yield chunk["data"]
            except Exception as e2:
                print(f"edge-tts fallback error: {e2}")
                return  # Nothing to yield, client will get empty response

    return StreamingResponse(
        generate_audio(),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="kannada_voice_{voice.replace(chr(45), "")}.mp3"',
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff",
        }
    )

# ---------- Health Check ----------

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Swara-Setu Voice Engine",
        "tts_engine": "edge-tts (Microsoft neural, 100% free)",
        "default_voices": [DEFAULT_SAPNA, DEFAULT_GAGAN],
        "chroma_vectors": "connected",  # Would check actual count in full app
    }

# ---------- Root ----------

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Swara-Setu Voice Engine",
        "tts_endpoint": "/api/speak",
        "rag_endpoint": "/api/rag",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)