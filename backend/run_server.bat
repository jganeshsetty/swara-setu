@echo off
title Swara-Setu RAG Backend Server
cd /d "%~dp0"

echo ===================================================
echo Starting Swara-Setu Kannada RAG Backend Server...
echo ===================================================

if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found in backend\venv.
    pause
    exit /b 1
)

if not exist "chroma_db" (
    echo [INFO] ChromaDB not detected. Building vector database first...
    venv\Scripts\python.exe build_db.py
)

echo Starting FastAPI server at http://localhost:8000 ...
venv\Scripts\uvicorn.exe app:app --reload --host 0.0.0.0 --port 8000
pause
