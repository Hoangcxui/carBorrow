# =============================================
# Start All Services - Car Rental System
# =============================================

param(
    [switch]$SkipInstall = $false
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 CAR RENTAL SYSTEM - START ALL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "car-rent-frontend"

# Kiểm tra Database
Write-Host "📊 Bước 1: Kiểm tra Database..." -ForegroundColor Yellow
try {
    $dbCheck = sqlcmd -S localhost -E -Q "SELECT COUNT(*) FROM CarRentalDb.dbo.Users" -h -1 2>$null
    if ($dbCheck -match '\d+') {
        Write-Host "✓ Database đang hoạt động. Số users: $($dbCheck.Trim())" -ForegroundColor Green
    } else {
        throw "Cannot query database"
    }
} catch {
    Write-Host "✗ Database chưa sẵn sàng!" -ForegroundColor Red
    Write-Host "  Hãy chạy CreateDatabase.sql trong SSMS trước." -ForegroundColor Yellow
    $response = Read-Host "Bạn có muốn tiếp tục không? (y/n)"
    if ($response -ne 'y') {
        exit 1
    }
}

Write-Host ""

# Kiểm tra và cài đặt Backend dependencies
if (-not $SkipInstall) {
    Write-Host "📦 Bước 2: Kiểm tra Backend dependencies..." -ForegroundColor Yellow
    
    if (Test-Path (Join-Path $backendPath "backend.csproj")) {
        Write-Host "  Restoring .NET packages..." -ForegroundColor Gray
        Push-Location $backendPath
        dotnet restore --verbosity quiet
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Backend dependencies OK" -ForegroundColor Green
        } else {
            Write-Host "⚠ Warning: Backend restore có vấn đề" -ForegroundColor Yellow
        }
        Pop-Location
    }
    
    Write-Host ""
    
    # Kiểm tra và cài đặt Frontend dependencies
    Write-Host "🎨 Bước 3: Kiểm tra Frontend dependencies..." -ForegroundColor Yellow
    
    if (Test-Path $frontendPath) {
        $nodeModules = Join-Path $frontendPath "node_modules"
        if (-not (Test-Path $nodeModules)) {
            Write-Host "  Cài đặt npm packages (có thể mất vài phút)..." -ForegroundColor Gray
            Push-Location $frontendPath
            npm install --silent
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
            } else {
                Write-Host "✗ Frontend install failed" -ForegroundColor Red
            }
            Pop-Location
        } else {
            Write-Host "✓ Frontend dependencies OK" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠ Frontend folder not found: $frontendPath" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Kiểm tra ports có bị chiếm không
Write-Host "🔍 Bước 4: Kiểm tra ports..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "⚠ Port 5000 đang được sử dụng" -ForegroundColor Yellow
    $response = Read-Host "Bạn có muốn kill process và tiếp tục? (y/n)"
    if ($response -eq 'y') {
        $processId = $port5000.OwningProcess | Select-Object -First 1
        Stop-Process -Id $processId -Force
        Write-Host "✓ Đã kill process trên port 5000" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

if ($port3000) {
    Write-Host "⚠ Port 3000 đang được sử dụng" -ForegroundColor Yellow
    $response = Read-Host "Bạn có muốn kill process và tiếp tục? (y/n)"
    if ($response -eq 'y') {
        $processId = $port3000.OwningProcess | Select-Object -First 1
        Stop-Process -Id $processId -Force
        Write-Host "✓ Đã kill process trên port 3000" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

Write-Host "✓ Ports sẵn sàng" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "🚀 Bước 5: Khởi động Backend API..." -ForegroundColor Yellow

$backendWindowTitle = "Car Rental - Backend API (Port 5000)"
$backendCmd = "cd '$backendPath'; Write-Host '🔧 Starting Backend API...' -ForegroundColor Cyan; dotnet run"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "`$Host.UI.RawUI.WindowTitle = '$backendWindowTitle'; $backendCmd"
)

Write-Host "✓ Backend đang khởi động trong terminal mới..." -ForegroundColor Green
Write-Host "  Đợi 15 giây để backend sẵn sàng..." -ForegroundColor Gray

# Đợi backend start
for ($i = 15; $i -gt 0; $i--) {
    Write-Host "  $i..." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds 1
}
Write-Host ""

# Kiểm tra backend đã chạy chưa
Write-Host "  Kiểm tra Backend health..." -ForegroundColor Gray
$maxRetries = 5
$retryCount = 0
$backendReady = $false

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 3 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "  Retry $retryCount/$maxRetries..." -ForegroundColor Gray
            Start-Sleep -Seconds 3
        }
    }
}

if ($backendReady) {
    Write-Host "✓ Backend API đã sẵn sàng!" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend chưa respond. Vui lòng kiểm tra terminal Backend." -ForegroundColor Yellow
}

Write-Host ""

# Start Frontend
Write-Host "🎨 Bước 6: Khởi động Frontend..." -ForegroundColor Yellow

if (Test-Path $frontendPath) {
    $frontendWindowTitle = "Car Rental - Frontend (Port 3000)"
    $frontendCmd = "cd '$frontendPath'; Write-Host '🎨 Starting Frontend...' -ForegroundColor Cyan; npm run dev"
    
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "`$Host.UI.RawUI.WindowTitle = '$frontendWindowTitle'; $frontendCmd"
    )
    
    Write-Host "✓ Frontend đang khởi động trong terminal mới..." -ForegroundColor Green
    Write-Host "  Đợi 10 giây để frontend build..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
} else {
    Write-Host "⚠ Frontend folder không tìm thấy" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ HỆ THỐNG ĐÃ KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Thông tin Services:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  🔧 Backend API:" -ForegroundColor White
Write-Host "     - URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "     - Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "     - Health: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""

Write-Host "  🎨 Frontend:" -ForegroundColor White
Write-Host "     - URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "  📊 Database:" -ForegroundColor White
Write-Host "     - Server: localhost" -ForegroundColor Cyan
Write-Host "     - Database: CarRentalDb" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Tài khoản test:" -ForegroundColor Yellow
Write-Host "  Admin:    admin@carborrow.com    / Admin@123" -ForegroundColor White
Write-Host "  Staff:    staff@carborrow.com    / Admin@123" -ForegroundColor White
Write-Host "  Customer: customer@carborrow.com / Admin@123" -ForegroundColor White
Write-Host ""

Write-Host "⚡ Các terminal đang chạy:" -ForegroundColor Yellow
Write-Host "  - Terminal 1: Backend API (KHÔNG được tắt)" -ForegroundColor White
Write-Host "  - Terminal 2: Frontend (KHÔNG được tắt)" -ForegroundColor White
Write-Host ""

# Mở browser
Write-Host "📱 Mở trình duyệt?" -ForegroundColor Yellow
$openBrowser = Read-Host "Nhấn Enter để mở Frontend, hoặc 's' để mở Swagger, 'n' để bỏ qua"

switch ($openBrowser.ToLower()) {
    's' {
        Write-Host "Mở Swagger UI..." -ForegroundColor Green
        Start-Process "http://localhost:5000/swagger"
    }
    'n' {
        Write-Host "Bỏ qua mở browser" -ForegroundColor Gray
    }
    default {
        Write-Host "Mở Frontend..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3000"
    }
}

Write-Host ""
Write-Host "🎉 Chúc bạn code vui vẻ!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Để dừng hệ thống:" -ForegroundColor Yellow
Write-Host "   - Đóng các terminal Backend và Frontend" -ForegroundColor White
Write-Host "   - Hoặc nhấn Ctrl+C trong mỗi terminal" -ForegroundColor White
Write-Host ""
