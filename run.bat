@echo off
title CoalGov AI — National Mining Governance Platform Launcher
setlocal EnableDelayedExpansion

:: Set directory to script root
cd /d "%~dp0"

echo ========================================================================
echo.
echo    COALGOV AI - NATIONAL STATUTORY MINING GOVERNANCE PLATFORM
echo    Ministry of Coal ^& DGMS Statutory Safety Intelligence Platform
echo.
echo ========================================================================
echo.

:: 1. Detect Python Command (py or python)
set "PYTHON_CMD="
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "PYTHON_CMD=py"
) else (
    where python >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set "PYTHON_CMD=python"
    )
)

if "%PYTHON_CMD%"=="" (
    echo [ERROR] Python was not found in your system PATH!
    echo Please install Python 3.10+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo [✓] Found Python launcher: %PYTHON_CMD%

:: 2. Detect Node.js and NPM
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js was not found in your system PATH!
    echo Please install Node.js (v18+) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] NPM was not found in your system PATH!
    echo.
    pause
    exit /b 1
)

echo [✓] Found Node.js and NPM

:: 3. Check / Install Python Dependencies
echo.
echo [*] Checking FastAPI backend dependencies...
%PYTHON_CMD% -c "import fastapi, uvicorn" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [*] Installing required Python packages (fastapi, uvicorn)...
    %PYTHON_CMD% -m pip install -r backend\requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Warning: Python dependencies installation had issues. Continuing...
    )
) else (
    echo [✓] Python dependencies verified (fastapi, uvicorn).
)

:: 4. Check / Install Node Dependencies
echo.
echo [*] Checking frontend dependencies...
if not exist "coalgov-mobile\node_modules\" (
    echo [*] Installing frontend npm packages (first time setup)...
    cd coalgov-mobile
    call npm install
    cd ..
) else (
    echo [✓] Frontend node_modules verified.
)

:: 5. Launch FastAPI Backend
echo.
echo [*] Starting FastAPI Backend on http://localhost:8000 ...
start "CoalGov AI - Backend API (Port 8000)" %PYTHON_CMD% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

:: 6. Launch Vite Frontend
echo [*] Starting Vite Frontend on http://localhost:5173 ...
start "CoalGov AI - Web Portal (Port 5173)" cmd /c "cd /d "%~dp0coalgov-mobile" && npm run dev -- --host"

:: 7. Wait and Open Browser
echo.
echo [*] Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo [*] Opening CoalGov AI in your default browser...
start http://localhost:5173/

echo.
echo ========================================================================
echo    CoalGov AI Ecosystem is now LIVE!
echo.
echo    - Frontend & Web Portal:  http://localhost:5173/
echo    - FastAPI Backend API:    http://localhost:8000/
echo    - Interactive Swagger:    http://localhost:8000/docs
echo ========================================================================
echo.

:MENU
echo ------------------------------------------------------------------------
echo Quick Actions:
echo   [1] Re-open Central Web Portal (http://localhost:5173/)
echo   [2] Re-open Backend API Documentation (http://localhost:8000/docs)
echo   [3] Rebuild Frontend Production Bundle (npm run build)
echo   [4] Sync Native Android Project (npx cap sync android)
echo   [5] Open Android Studio Project
echo   [6] Terminate All CoalGov AI Servers & Exit
echo ------------------------------------------------------------------------
set /p CHOICE="Enter option [1-6]: "

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
    echo [*] Opening Android Studio...
    cd /d "%~dp0coalgov-mobile"
    call npx cap open android
    cd /d "%~dp0"
    goto MENU
)
if "%CHOICE%"=="6" (
    echo.
    echo [*] Shutting down CoalGov AI processes...
    taskkill /FI "WINDOWTITLE eq CoalGov AI - Backend API (Port 8000)*" /T /F >nul 2>&1
    taskkill /FI "WINDOWTITLE eq CoalGov AI - Web Portal (Port 5173)*" /T /F >nul 2>&1
    echo [✓] All CoalGov AI servers stopped.
    timeout /t 2 /nobreak >nul
    exit /b 0
)

echo [!] Invalid option. Please enter 1 to 6.
goto MENU
