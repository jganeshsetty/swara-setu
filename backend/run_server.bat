@echo off
title Swara-Setu RAG Backend Server
cd /d "%~dp0"

echo ===================================================
echo Starting Swara-Setu Kannada RAG Backend Server...
echo ===================================================

if exist "venv\Scripts\python.exe" (
    echo [INFO] Using virtual environment in backend\venv...
    venv\Scripts\uvicorn.exe app:app --reload --host 0.0.0.0 --port 8000
) else (
    echo [INFO] Using system python...
    uvicorn app:app --reload --host 0.0.0.0 --port 8000
)

pause
