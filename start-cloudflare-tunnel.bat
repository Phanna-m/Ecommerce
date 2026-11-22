@echo off
title E-Commerce Cloudflare Public Tunnel
echo ========================================================
echo   Webyansh E-Commerce - Cloudflare Live Public Tunnel
echo ========================================================
echo.
echo 1. Building latest frontend assets...
cd /d %~dp0\frontend
call npm.cmd run build

echo.
echo 2. Starting Node.js API + Frontend Server on port 5000...
cd /d %~dp0\backend
start "E-Commerce Server" cmd /k "node server.js"

echo.
echo 3. Starting Cloudflare Tunnel...
cd /d %~dp0
echo.
echo ========================================================
echo Look for the public link below:
echo (Example: https://xxxxxx.trycloudflare.com)
echo Copy and send that link to your teacher!
echo ========================================================
echo.
cloudflared.exe tunnel --url http://localhost:5000
pause
