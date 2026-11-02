@echo off
title Swara-Setu Launcher
cd /d "%~dp0"

echo ===================================================
echo   Starting Swara-Setu (ಸ್ವರಸೇತು) Application
echo ===================================================
echo.

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "Swara-Setu Backend (FastAPI)" cmd /k "cd backend && run_server.bat"

echo [2/2] Starting Next.js Frontend on port 3000...
start "Swara-Setu Frontend (Next.js)" cmd /k "npm run dev"

echo Waiting for servers to initialize...
timeout /t 5 >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo All servers are running!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ===================================================

