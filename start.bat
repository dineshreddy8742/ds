@echo off
echo ========================================
echo   DialSmart AI Platform
echo   Starting Development Servers...
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

cd /d "%~dp0"
npm run dev
