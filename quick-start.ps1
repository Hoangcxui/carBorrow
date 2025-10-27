# Quick Start Script - Simple Version
Write-Host "🚀 Starting Car Rental System..." -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

# Start Backend
Write-Host "📦 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\backend'; dotnet run"

# Wait
Write-Host "⏳ Waiting for backend (15 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\car-rent-frontend'; npm run dev"

# Wait
Write-Host "⏳ Waiting for frontend (10 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ System Started!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser in 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
