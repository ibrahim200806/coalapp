@echo off
title CoalGov AI - National Mining Statutory Governance System
color 0E

echo ===============================================================================
echo                COALGOV AI - STATUTORY COAL GOVERNANCE PLATFORM
echo          Ministry of Coal & Directorate General of Mines Safety (DGMS)
echo ===============================================================================
echo.

setlocal enabledelayedexpansion

:: Set working directory to project root
cd /d "%~dp0"

:: Determine Python executable (py or python)
set PY_CMD=python
where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set PY_CMD=py
) else (
    where python >nul 2>&1
    if not %ERRORLEVEL% equ 0 (
        echo [ERROR] Python is not installed or not in PATH!
        echo Please install Python 3.10+ and add it to your PATH.
        pause
        exit /b 1
    )
)

:: Check Node.js and NPM
where npm >nul 2>&1
if not %ERRORLEVEL% equ 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    echo Please install Node.js v18+ and retry.
    pause
    exit /b 1
)

echo [1/4] Checking Python backend dependencies...
%PY_CMD% -m pip install -q -r backend\requirements.txt 2>nul

echo [2/4] Starting FastAPI Statutory Backend on port 8000...
start "CoalGov AI - Backend Server (Port 8000)" /D "%~dp0" cmd /k %PY_CMD% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

echo [3/4] Starting Vite Web Portal on port 5173...
start "CoalGov AI - Frontend Dev Server (Port 5173)" /D "%~dp0coalgov-mobile" cmd /k npm run dev -- --host

echo [4/4] Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo.
echo ===============================================================================
echo [SUCCESS] CoalGov AI Services are LIVE:
echo.
echo   - Web Governance Portal:    http://localhost:5173/
echo   - FastAPI Backend API:      http://localhost:8000/
echo   - Interactive Swagger Docs: http://localhost:8000/docs
echo ===============================================================================
echo.
echo Launching Web Portal in your default browser...
start http://localhost:5173/

:MENU
echo.
echo -------------------------------------------------------------------------------
echo Quick Actions:
echo   [1] Open / Re-open Web Portal in Browser (http://localhost:5173/)
echo   [2] Open Backend API Swagger Docs (http://localhost:8000/docs)
echo   [3] Rebuild Production Bundle (npm run build)
echo   [4] Sync Android Project (npx cap sync android)
echo   [5] Stop All CoalGov Servers and Exit
echo -------------------------------------------------------------------------------
set "CHOICE="
set /p CHOICE="Select an option [1-5]: "

if "%CHOICE%"=="1" (
    start http://localhost:5173/
    goto MENU
)
if "%CHOICE%"=="2" (
    start http://localhost:8000/docs
    goto MENU
)
if "%CHOICE%"=="3" (
    echo [*] Building production bundle...
    cd /d "%~dp0coalgov-mobile"
    call npm run build
    cd /d "%~dp0"
    goto MENU
)
if "%CHOICE%"=="4" (
    echo [*] Syncing Capacitor Android assets...
    cd /d "%~dp0coalgov-mobile"
    call npx cap sync android
    cd /d "%~dp0"
    goto MENU
)
if "%CHOICE%"=="5" (
    echo.
    echo [*] Stopping CoalGov AI servers...
    taskkill /FI "WINDOWTITLE eq CoalGov AI - Backend Server (Port 8000)*" /T /F >nul 2>&1
    taskkill /FI "WINDOWTITLE eq CoalGov AI - Frontend Dev Server (Port 5173)*" /T /F >nul 2>&1
    echo [✓] All CoalGov AI servers stopped.
    timeout /t 2 /nobreak >nul
    exit /b 0
)

if not defined CHOICE (
    goto MENU
)
echo [!] Invalid option. Please enter 1 to 5.
goto MENU
