@echo off
echo ===================================================
echo 🚀 Compiling Web Assets (esbuild + tailwindcss)
echo ===================================================
call npx esbuild src/main.tsx --bundle --outfile=dist/assets/index.js --conditions=style --loader:.tsx=tsx --loader:.ts=ts --loader:.css=css --loader:.svg=file --loader:.png=file --loader:.jpg=file
if %errorlevel% neq 0 (
    echo ❌ Web build failed!
    pause
    exit /b %errorlevel%
)

call npx @tailwindcss/cli -i src/index.css -o dist/assets/index.css --minify
if %errorlevel% neq 0 (
    echo ❌ CSS compilation failed!
    pause
    exit /b %errorlevel%
)

echo ===================================================
echo 📦 Syncing Assets with Capacitor Android
echo ===================================================
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

echo ===================================================
echo 🛠️ Building Android APK (gradlew)
echo ===================================================
cd android
call .\gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Android compile failed!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo ===================================================
echo 📲 Installing APK on Device
echo ===================================================
call adb install -r android/app/build/outputs/apk/debug/app-debug.apk
if %errorlevel% neq 0 (
    echo ❌ Installation failed! Ensure your device is connected via USB debugging.
    pause
    exit /b %errorlevel%
)

echo ===================================================
echo 🎉 Successfully Compiled & Installed Linual on Device!
echo ===================================================
pause
