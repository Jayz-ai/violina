@echo off
echo ========================================
echo   Starting Violina Admin Tool...
echo ========================================

if not exist node_modules (
    echo [1/2] Installing dependencies...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

if not exist node_modules\express (
    echo [ERROR] Express module not found. Retrying install...
    call npm install
)

echo [2/2] Launching server...
start http://localhost:3000/admin/index.html
node server.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo ----------------------------------------
    echo [ERROR] Server failed to start.
    echo Please make sure Node.js is installed.
    echo ----------------------------------------
)

pause
