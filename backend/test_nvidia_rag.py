import sys
import os

# Set UTF-8 encoding for standard output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception as e:
        pass

# Ensure backend directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(CURRENT_DIR, ".env"))

from app import app, query_rag_pipeline, df_dataset
from nvidia_rag_pipeline import ContextLockedRAGPipeline, GROUNDED_FALLBACK_KANNADA
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 70)
print("TESTING 3-STAGE CONTEXT-LOCKED NVIDIA NIM RAG PIPELINE")
print("=" * 70)
print(f"Dataset Loaded: {len(df_dataset)} records.")
print(f"NVIDIA API Key configured: {bool(os.getenv('NVIDIA_API_KEY'))}")
print(f"NVIDIA Model: {os.getenv('NVIDIA_MODEL', 'meta/llama-3.3-70b-instruct')}")
print(f"RAG Max Distance: {os.getenv('RAG_MAX_DISTANCE', '0.65')}")
print("-" * 70)

# ---------------------------------------------------------------------------
# Test 1: In-Dataset Query
# ---------------------------------------------------------------------------
print("\n>>> Test 1: In-Dataset Regional Query ('ಬೊಜ್ಜ ಅಂದ್ರೆ ಏನು')")
in_dataset_query = "ಬೊಜ್ಜ ಅಂದ್ರೆ ಏನು"
res1 = client.post("/ask", json={"question": in_dataset_query})
assert res1.status_code == 200, f"Expected 200, got {res1.status_code}: {res1.text}"
data1 = res1.json()

print(f"Answer: {data1.get('answer')}")
print(f"Grounded: {data1.get('grounded')}")
print(f"Method: {data1.get('method')}")
print(f"Sources Count: {len(data1.get('sources', []))}")
if data1.get("sources"):
    print(f"Top Source ID: {data1['sources'][0].get('id')} | Distance: {data1['sources'][0].get('distance')}")

assert data1.get("grounded") is True, f"Expected grounded=True for in-dataset query, got: {data1}"
assert len(data1.get("sources", [])) >= 1, "Expected at least 1 verified source chunk"
assert "ಬೊಜ್ಜ" in data1.get("answer", "") or "ಊಟ" in data1.get("answer", "")
print(">>> Test 1 PASSED: In-dataset query successfully retrieved and grounded.")

# ---------------------------------------------------------------------------
# Test 2: In-Dataset Kanglish / Regional Query ('Dharwad mast')
# ---------------------------------------------------------------------------
print("\n>>> Test 2: In-Dataset Query ('ಮಸ್ತ್ ಅಂದ್ರೆ ಏನು')")
res2 = client.post("/ask", json={"question": "ಮಸ್ತ್ ಅಂದ್ರೆ ಏನು", "region": "tungabhadra_belt"})
assert res2.status_code == 200
data2 = res2.json()
print(f"Answer: {data2.get('answer')}")
print(f"Grounded: {data2.get('grounded')}")
print(f"Method: {data2.get('method')}")
assert data2.get("grounded") is True, f"Expected grounded=True, got: {data2}"
assert len(data2.get("sources", [])) >= 1
print(">>> Test 2 PASSED: Second in-dataset query verified.")

# ---------------------------------------------------------------------------
# Test 3: Completely Out-of-Dataset Query (Gatekeeper Blockage)
# ---------------------------------------------------------------------------
print("\n>>> Test 3: Out-of-Dataset Query ('Who won the FIFA World Cup 2022 in football?')")
out_dataset_query = "Who won the FIFA World Cup 2022 in football?"
res3 = client.post("/ask", json={"question": out_dataset_query})
assert res3.status_code == 200
data3 = res3.json()

print(f"Answer: {data3.get('answer')}")
print(f"Grounded: {data3.get('grounded')}")
print(f"Method: {data3.get('method')}")
print(f"Sources Count: {len(data3.get('sources', []))}")

assert data3.get("grounded") is False, f"Expected grounded=False for out-of-dataset query, got: {data3}"
assert len(data3.get("sources", [])) == 0, f"Expected 0 sources, got: {data3.get('sources')}"
assert (
    "ಲಭ್ಯವಿಲ್ಲ" in data3.get("answer", "")
    or "ಸ್ವರಸೇತು" in data3.get("answer", "")
    or "ಅಧಿಕೃತ ಪದವಲ್ಲ" in data3.get("answer", "")
), f"Expected grounded fallback answer, got: {data3.get('answer')}"
print(">>> Test 3 PASSED: Gatekeeper blocked out-of-domain query and prevented hallucination.")

# ---------------------------------------------------------------------------
# Test 4: Obscure Out-of-Dataset Technical / Hallucination-Prone Query
# ---------------------------------------------------------------------------
print("\n>>> Test 4: Completely Fabricated Query ('Quantum tensor entanglement physics')")
res4 = client.post("/ask", json={"question": "Quantum tensor entanglement physics algorithm matrix"})
assert res4.status_code == 200
data4 = res4.json()
print(f"Answer: {data4.get('answer')}")
print(f"Grounded: {data4.get('grounded')}")
print(f"Method: {data4.get('method')}")

assert data4.get("grounded") is False
assert len(data4.get("sources", [])) == 0
print(">>> Test 4 PASSED: Hallucination-prone query blocked.")

print("\n" + "=" * 70)
print("ALL RAG GROUNDING VERIFICATION TESTS PASSED SUCCESSFULLY!")
print("=" * 70)
