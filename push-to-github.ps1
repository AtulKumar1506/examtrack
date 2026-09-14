# Helper script to connect and push ExamTrack to your GitHub repository

$git = "C:\Users\HP\.gemini\antigravity\scratch\mingit\cmd\git.exe"
if (-not (Test-Path $git)) {
    $git = "git"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     🎓 ExamTrack — GitHub Push & Deploy Helper           " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Steps before running this script:" -ForegroundColor White
Write-Host "1. Go to https://github.com/new" -ForegroundColor Gray
Write-Host "2. Create a new repository named: examtrack (public or private)" -ForegroundColor Gray
Write-Host "3. Do NOT check 'Initialize with README' or '.gitignore'" -ForegroundColor Gray
Write-Host "4. Copy your repository URL (e.g. https://github.com/your-username/examtrack.git)" -ForegroundColor Gray
Write-Host ""

$repoUrl = Read-Host "Paste your GitHub repository URL here"

if (-not $repoUrl) {
    Write-Host "No URL entered. Aborted." -ForegroundColor Red
    exit
}

Write-Host "`nSetting up remote origin..." -ForegroundColor Green
& $git remote remove origin 2>$null
& $git remote add origin $repoUrl.Trim()

Write-Host "Renaming branch to main..." -ForegroundColor Green
& $git branch -M main

Write-Host "`nPushing to GitHub (a GitHub sign-in popup may appear)..." -ForegroundColor Yellow
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Your code is now on GitHub! 🎉" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "To enable your free live website on GitHub Pages:" -ForegroundColor Cyan
    Write-Host "1. Open your repository on GitHub in your browser" -ForegroundColor White
    Write-Host "2. Click 'Settings' tab -> 'Pages' (in left sidebar)" -ForegroundColor White
    Write-Host "3. Under 'Build and deployment':" -ForegroundColor White
    Write-Host "   - Option A: Set Source to 'GitHub Actions' (already configured!)" -ForegroundColor Gray
    Write-Host "   - Option B: Set Source to 'Deploy from a branch' -> main -> /(root) -> Save" -ForegroundColor Gray
    Write-Host "4. Your live URL will appear within 60 seconds at:" -ForegroundColor Yellow
    Write-Host "   https://<your-username>.github.io/examtrack/" -ForegroundColor Cyan
} else {
    Write-Host "`nPush encountered an issue. Make sure you entered the correct repository URL and authenticated." -ForegroundColor Red
}
