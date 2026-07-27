@echo off
echo ===================================================
echo 🚀 Linual LifeOS — GitHub Push Script
echo ===================================================
echo.

git init
git add .
git commit -m "v1.0 Production Readiness: Stabilized Dashboard, Salah Tracker, Habit Tracker"
git branch -M main

set /p REPO_URL="Enter your GitHub Repository URL (or press ENTER for https://github.com/SaqibMasoodi/linual-life-manual.git): "
if "%REPO_URL%"=="" set REPO_URL=https://github.com/SaqibMasoodi/linual-life-manual.git

git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Pushing to %REPO_URL% ...
git push -u origin main

echo.
echo ===================================================
echo ✅ Done! Check your GitHub Actions tab to download the iOS Build!
echo ===================================================
pause
