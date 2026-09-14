@echo off
REM Git Setup and Push Script for JWtereny
REM This script will initialize git, commit all files, and push to GitHub

echo ========================================
echo JWtereny - GitHub Setup Script
echo ========================================
echo.

cd /d "C:\Users\drsce\Desktop\JWtereny"

echo [1/5] Checking git installation...
git --version
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git is installed!
echo.

echo [2/5] Initializing git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)
echo.

echo [3/5] Configuring git user...
git config user.name "GEKO7-create"
git config user.email "your-email@example.com"
echo Please update your email in the script if needed
echo.

echo [4/5] Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo.

echo Files to be committed:
git status --short
echo.

echo [5/5] Creating initial commit...
git commit -m "Initial commit: Tereny Management PWA"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo.

echo [6/6] Adding remote repository...
git remote add origin https://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@github.com/GEKO7-create/JWtereny.git
if errorlevel 1 (
    echo WARNING: Remote might already exist, trying to set URL instead...
    git remote set-url origin https://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@github.com/GEKO7-create/JWtereny.git
)
echo.

echo [7/7] Pushing to GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo This might be because the repository already has content
    echo Try: git pull origin main --allow-unrelated-histories
    echo Then: git push -u origin main
    pause
    exit /b 1
)
echo.

echo ========================================
echo SUCCESS! All files pushed to GitHub
echo ========================================
echo.
echo Your app is now at:
echo https://github.com/GEKO7-create/JWtereny
echo.
echo Next steps:
echo 1. Go to repository Settings -^> Pages
echo 2. Select "main" branch as source
echo 3. Save and wait a few minutes
echo 4. Your app will be live at:
echo    https://geko7-create.github.io/JWtereny/
echo.
pause
