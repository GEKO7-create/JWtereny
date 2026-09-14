@echo off
REM Fixed Update Script - Handles binary files and credentials properly
REM JWtereny GitHub Update

echo ========================================
echo JWtereny - Fixed Update Script
echo ========================================
echo.

cd /d "C:\Users\drsce\Desktop\JWtereny"

echo [1/7] Checking current status...
git status
echo.

echo [2/7] Staging ALL changes (including binary files)...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo.

echo Files staged:
git status --short
echo.

echo [3/7] Committing all changes...
git commit -m "Update: Dark futuristic theme + fixed app icons"
if errorlevel 1 (
    echo No changes to commit - checking if we need to pull first...
    git pull origin main --no-edit
)
echo.

echo [4/7] Setting remote URL with authentication...
git remote set-url origin https://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@github.com/GEKO7-create/JWtereny.git
echo.

echo [5/7] Pulling any remote changes...
git pull origin main --no-edit --allow-unrelated-histories
if errorlevel 1 (
    echo Note: Pull might have conflicts, continuing...
)
echo.

echo [6/7] Pushing to GitHub (with embedded credentials)...
git push origin main
if errorlevel 1 (
    echo.
    echo Normal push failed. Checking what went wrong...
    echo.
    echo Trying force push (this will overwrite remote)...
    choice /C YN /M "Do you want to FORCE PUSH (overwrite remote)"
    if errorlevel 2 goto :failed
    if errorlevel 1 goto :forcepush
)

goto :success

:forcepush
echo.
echo Force pushing...
git push origin main --force
if errorlevel 1 goto :failed
goto :success

:success
echo.
echo ========================================
echo SUCCESS! All changes pushed to GitHub
echo ========================================
echo.
echo Your updated app will be live in 1-2 minutes at:
echo https://geko7-create.github.io/JWtereny/
echo.
echo What was updated:
echo - Dark futuristic theme with glass morphism
echo - Fixed app icons (192x192 and 512x512)
echo - Updated styles and colors
echo.
pause
exit /b 0

:failed
echo.
echo ========================================
echo ERROR: Could not push to GitHub
echo ========================================
echo.
echo Possible issues:
echo 1. Token might be expired - check: https://github.com/settings/tokens
echo 2. Network connection problem
echo 3. Repository permissions
echo.
echo Current remote URL:
git remote get-url origin
echo.
echo Try regenerating your GitHub Personal Access Token:
echo https://github.com/settings/tokens/new
echo Required scope: "repo" (Full control of private repositories)
echo.
pause
exit /b 1
