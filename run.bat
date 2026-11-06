@echo off
setlocal
if not exist out mkdir out
javac -encoding UTF-8 -d out LanchoneteServer.java
if errorlevel 1 exit /b 1
copy /Y index.html out\index.html >nul
if errorlevel 1 exit /b 1
copy /Y styles.css out\styles.css >nul
if errorlevel 1 exit /b 1
copy /Y app.js out\app.js >nul
if errorlevel 1 exit /b 1
copy /Y manifest.webmanifest out\manifest.webmanifest >nul
if errorlevel 1 exit /b 1
copy /Y service-worker.js out\service-worker.js >nul
if errorlevel 1 exit /b 1
if not exist out\icons mkdir out\icons
copy /Y icons\* out\icons\ >nul
if errorlevel 1 exit /b 1
java -cp out br.com.temperodaterra.LanchoneteServer
