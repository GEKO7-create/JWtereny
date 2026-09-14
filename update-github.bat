@echo off
REM Update GitHub - Fix conflicts and push changes
REM This script will pull changes, merge them, and push to GitHub

echo ========================================
echo JWtereny - Update GitHub Script
echo ========================================
echo.

cd /d "C:\Users\drsce\Desktop\JWtereny"

echo [1/6] Checking git status...
git status
echo.

echo [2/6] Pulling latest changes from GitHub...
git pull origin main --allow-unrelated-histories
if errorlevel 1 (
    echo.
    echo WARNING: There might be conflicts. Let's try to resolve them...
    echo.
    echo Attempting to merge with strategy...
    git pull origin main --allow-unrelated-histories -X theirs
)
echo.

echo [3/6] Adding updated files...
git add index.html
git add app.js
git add manifest.json
git add sw.js
git add *.md
git add .gitignore
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo.

echo Files staged for commit:
git status --short
echo.

echo [4/6] Committing changes...
git commit -m "Update to dark futuristic theme - minimalistic design with glass morphism"
if errorlevel 1 (
    echo NOTE: No changes to commit or commit failed
    echo This might be okay if files are already committed
)
echo.

echo [5/6] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Still cannot push. Trying force push...
    echo.
    echo WARNING: This will overwrite remote changes!
    pause
    git push origin main --force
    if errorlevel 1 (
        echo.
        echo ERROR: Force push also failed. Please check:
        echo 1. Your internet connection
        echo 2. GitHub access token is valid
        echo 3. Repository exists and you have write access
        echo.
        pause
        exit /b 1
    )
)
echo.

echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Your updated app will be live in 1-2 minutes at:
echo https://geko7-create.github.io/JWtereny/
echo.
echo Changes applied:
echo - Dark futuristic theme
echo - Glass morphism effects
echo - Minimalistic design
echo - Cyan and purple gradients
echo.
pause
