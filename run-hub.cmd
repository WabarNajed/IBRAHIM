@echo off
setlocal
chcp 65001 > nul
cd /d "%~dp0"

echo Starting Rifaq Brand Settings Hub...
echo فتح هب إعدادات رفاق...
echo.
echo Open this URL if the browser does not open automatically:
echo http://localhost:3000
echo.
start "" http://localhost:3000
call npx --yes pnpm@10.28.1 dev
pause
