# =============================================
# PowerShell Script - Setup Database tự động
# =============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Car Rental Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra SQL Server có đang chạy không
Write-Host "Bước 1: Kiểm tra SQL Server..." -ForegroundColor Yellow

$sqlServices = Get-Service -Name "MSSQL*" -ErrorAction SilentlyContinue
if ($sqlServices) {
    $runningServices = $sqlServices | Where-Object { $_.Status -eq 'Running' }
    if ($runningServices) {
        Write-Host "✓ SQL Server đang chạy" -ForegroundColor Green
        $runningServices | ForEach-Object {
            Write-Host "  - $($_.DisplayName): $($_.Status)" -ForegroundColor Gray
        }
    } else {
        Write-Host "✗ SQL Server không chạy!" -ForegroundColor Red
        Write-Host "  Hãy khởi động SQL Server trước khi tiếp tục." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠ Không tìm thấy SQL Server service" -ForegroundColor Yellow
    Write-Host "  Có thể bạn đang dùng LocalDB hoặc SQL Express chưa cài đặt" -ForegroundColor Yellow
}

Write-Host ""

# Kiểm tra file SQL có tồn tại không
Write-Host "Bước 2: Kiểm tra file SQL..." -ForegroundColor Yellow

$scriptPath = $PSScriptRoot
$sqlFile = Join-Path $scriptPath "CreateDatabase.sql"
$checkFile = Join-Path $scriptPath "CheckDatabase.sql"

if (Test-Path $sqlFile) {
    Write-Host "✓ Tìm thấy CreateDatabase.sql" -ForegroundColor Green
} else {
    Write-Host "✗ Không tìm thấy CreateDatabase.sql" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Chọn phương thức kết nối
Write-Host "Bước 3: Chọn phương thức kết nối SQL Server" -ForegroundColor Yellow
Write-Host "1. Windows Authentication (localhost)" -ForegroundColor White
Write-Host "2. Windows Authentication (LocalDB)" -ForegroundColor White
Write-Host "3. SQL Server Authentication" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Chọn (1/2/3)"

$serverName = ""
$connectionString = ""
$useIntegratedSecurity = $true

switch ($choice) {
    "1" {
        $serverName = "localhost"
        $connectionString = "Server=localhost;Database=CarRentalDb;Integrated Security=True;TrustServerCertificate=True;"
        Write-Host "✓ Sử dụng: localhost với Windows Authentication" -ForegroundColor Green
    }
    "2" {
        $serverName = "(localdb)\MSSQLLocalDB"
        $connectionString = "Server=(localdb)\MSSQLLocalDB;Database=CarRentalDb;Integrated Security=True;TrustServerCertificate=True;"
        Write-Host "✓ Sử dụng: LocalDB với Windows Authentication" -ForegroundColor Green
    }
    "3" {
        $serverName = Read-Host "Nhập Server name (vd: localhost)"
        $username = Read-Host "Nhập username (vd: sa)"
        $password = Read-Host "Nhập password" -AsSecureString
        $passwordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        $connectionString = "Server=$serverName;Database=CarRentalDb;User Id=$username;Password=$passwordText;TrustServerCertificate=True;"
        $useIntegratedSecurity = $false
        Write-Host "✓ Sử dụng: $serverName với SQL Authentication" -ForegroundColor Green
    }
    default {
        Write-Host "✗ Lựa chọn không hợp lệ" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Chạy SQL Script
Write-Host "Bước 4: Tạo Database..." -ForegroundColor Yellow

try {
    # Sử dụng sqlcmd để chạy script
    $sqlcmdPath = "sqlcmd"
    
    if ($useIntegratedSecurity) {
        & $sqlcmdPath -S $serverName -E -i $sqlFile
    } else {
        & $sqlcmdPath -S $serverName -U $username -P $passwordText -i $sqlFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database đã được tạo thành công!" -ForegroundColor Green
    } else {
        throw "sqlcmd returned error code: $LASTEXITCODE"
    }
} catch {
    Write-Host "✗ Lỗi khi tạo database: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Giải pháp thay thế:" -ForegroundColor Yellow
    Write-Host "1. Mở SQL Server Management Studio (SSMS)" -ForegroundColor White
    Write-Host "2. Mở file: $sqlFile" -ForegroundColor White
    Write-Host "3. Nhấn F5 để chạy script" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Cập nhật appsettings.json
Write-Host "Bước 5: Cập nhật appsettings.json..." -ForegroundColor Yellow

$appSettingsFile = Join-Path $scriptPath "appsettings.json"

if (Test-Path $appSettingsFile) {
    try {
        $appSettings = Get-Content $appSettingsFile -Raw | ConvertFrom-Json
        $appSettings.ConnectionStrings.DefaultConnection = $connectionString
        $appSettings | ConvertTo-Json -Depth 10 | Set-Content $appSettingsFile
        Write-Host "✓ Connection string đã được cập nhật" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Không thể cập nhật appsettings.json tự động" -ForegroundColor Yellow
        Write-Host "  Hãy cập nhật thủ công với connection string:" -ForegroundColor Yellow
        Write-Host "  $connectionString" -ForegroundColor White
    }
} else {
    Write-Host "⚠ Không tìm thấy appsettings.json" -ForegroundColor Yellow
}

Write-Host ""

# Kiểm tra database
Write-Host "Bước 6: Kiểm tra Database..." -ForegroundColor Yellow

if (Test-Path $checkFile) {
    try {
        if ($useIntegratedSecurity) {
            & sqlcmd -S $serverName -E -i $checkFile
        } else {
            & sqlcmd -S $serverName -U $username -P $passwordText -i $checkFile
        }
        Write-Host "✓ Database kiểm tra hoàn tất!" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Không thể chạy script kiểm tra" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SETUP HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tài khoản test:" -ForegroundColor Yellow
Write-Host "  Admin:    admin@carborrow.com    / Admin@123" -ForegroundColor White
Write-Host "  Staff:    staff@carborrow.com    / Admin@123" -ForegroundColor White
Write-Host "  Customer: customer@carborrow.com / Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Để chạy API, sử dụng lệnh:" -ForegroundColor Yellow
Write-Host "  dotnet run" -ForegroundColor White
Write-Host ""
Write-Host "Swagger UI: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "Health Check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""
