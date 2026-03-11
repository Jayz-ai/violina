@echo off
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
chcp 65001 > nul
echo ========================================
echo   Violina 管理システムを起動しています...
echo ========================================

if not exist node_modules (
    echo [1/2] 依存パッケージをインストールしています...
    npm install
) else (
    echo [1/2] 依存パッケージはインストール済みです。
)

echo [2/2] サーバーを起動しています...
start http://localhost:3000/admin/index.html
node server.js

pause
