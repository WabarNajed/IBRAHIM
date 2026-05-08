@echo off
setlocal
chcp 65001 > nul
cd /d "%~dp0"

echo.
echo ============================================================
echo Rifaq / Dclean verification for Windows
echo مشروع رفاق / دكلين - تشغيل التحقق على ويندوز
echo ============================================================
echo.
echo Project folder: %CD%
echo.

echo [1/5] Installing workspace dependencies with pnpm 10.28.1...
call npx --yes pnpm@10.28.1 install
if errorlevel 1 goto fail

echo.
echo [2/5] Running typecheck...
call npx --yes pnpm@10.28.1 typecheck
if errorlevel 1 goto fail

echo.
echo [3/5] Running build...
call npx --yes pnpm@10.28.1 build
if errorlevel 1 goto fail

echo.
echo [4/5] Running tests...
call npx --yes pnpm@10.28.1 test
if errorlevel 1 goto fail

echo.
echo [5/5] Running lint...
call npx --yes pnpm@10.28.1 lint
if errorlevel 1 goto fail

echo.
echo ============================================================
echo Success! All checks passed.
echo تم بنجاح! كل الفحوصات نجحت.
echo ============================================================
echo.
pause
exit /b 0

:fail
echo.
echo ============================================================
echo Failed. Copy the error above and send it for troubleshooting.
echo فشل التشغيل. انسخ الخطأ الموجود فوق وأرسله للمساعدة.
echo ============================================================
echo.
pause
exit /b 1
