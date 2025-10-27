# Hướng dẫn Setup Database cho Car Rental System

## 📋 Yêu cầu
- SQL Server 2019 trở lên (hoặc SQL Server Express)
- SQL Server Management Studio (SSMS) hoặc Azure Data Studio
- .NET 7.0 SDK

## 🚀 Cách 1: Sử dụng SSMS (Khuyến nghị)

### Bước 1: Mở SSMS
1. Mở **SQL Server Management Studio**
2. Kết nối đến SQL Server instance của bạn:
   - Server name: `localhost` hoặc `(localdb)\MSSQLLocalDB`
   - Authentication: Windows Authentication hoặc SQL Server Authentication

### Bước 2: Chạy Script SQL
1. Trong SSMS, chọn **File > Open > File...**
2. Mở file `CreateDatabase.sql` trong thư mục dự án
3. Nhấn **F5** hoặc click nút **Execute**
4. Đợi script chạy xong (khoảng 5-10 giây)

### Bước 3: Kiểm tra Database
```sql
-- Kiểm tra database đã được tạo
USE CarRentalDb;
GO

-- Xem danh sách các bảng
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Kiểm tra dữ liệu mẫu
SELECT * FROM Roles;
SELECT * FROM Categories;
SELECT * FROM Users;
SELECT * FROM Vehicles;
```

### Bước 4: Cập nhật Connection String
1. Mở file `appsettings.json` trong dự án
2. Cập nhật connection string phù hợp với SQL Server của bạn:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CarRentalDb;Integrated Security=True;TrustServerCertificate=True;"
  }
}
```

**Lưu ý về Connection String:**
- Nếu dùng **Windows Authentication**: 
  ```
  Server=localhost;Database=CarRentalDb;Integrated Security=True;TrustServerCertificate=True;
  ```
- Nếu dùng **SQL Server Authentication**:
  ```
  Server=localhost;Database=CarRentalDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;
  ```
- Nếu dùng **LocalDB**:
  ```
  Server=(localdb)\\MSSQLLocalDB;Database=CarRentalDb;Integrated Security=True;TrustServerCertificate=True;
  ```

## 🔄 Cách 2: Sử dụng Entity Framework Migrations

### Bước 1: Xóa Migrations cũ (nếu có)
```powershell
cd c:\Users\minhh\Downloads\carBorrow-main\carBorrow-main
Remove-Item -Path "Migrations" -Recurse -Force
```

### Bước 2: Tạo Migration mới
```powershell
dotnet ef migrations add InitialCreate
```

### Bước 3: Update Database
```powershell
dotnet ef database update
```

### Bước 4: Seed dữ liệu
Chạy project, dữ liệu mẫu sẽ tự động được seed khi khởi động:
```powershell
dotnet run
```

## 📊 Cấu trúc Database

### Các bảng chính:

1. **Roles** - Vai trò người dùng
   - Admin, Staff, Customer

2. **Users** - Người dùng
   - Thông tin cá nhân, email, mật khẩu
   - Liên kết với Role

3. **Categories** - Danh mục xe
   - Sedan, SUV, Hatchback, Luxury, Van

4. **Vehicles** - Thông tin xe
   - Hãng xe, model, biển số, giá thuê
   - Liên kết với Category

5. **VehicleImages** - Ảnh xe
   - Nhiều ảnh cho mỗi xe

6. **Bookings** - Đơn đặt xe
   - Liên kết User và Vehicle
   - Thời gian thuê, tổng tiền, trạng thái

7. **RefreshTokens** - Token xác thực
   - JWT refresh token cho người dùng

8. **AuditLogs** - Nhật ký hệ thống
   - Ghi lại các hành động của người dùng

## 🔐 Tài khoản mẫu

Sau khi chạy script, bạn có thể đăng nhập bằng các tài khoản sau:

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@carborrow.com | Admin@123 |
| Staff | staff@carborrow.com | Admin@123 |
| Customer | customer@carborrow.com | Admin@123 |

## 🛠️ Troubleshooting

### Lỗi: "Cannot open database 'CarRentalDb'"
- Kiểm tra SQL Server có đang chạy không
- Chạy lại script `CreateDatabase.sql`

### Lỗi: "Login failed for user"
- Kiểm tra connection string
- Đảm bảo user có quyền truy cập database

### Lỗi: "A network-related or instance-specific error"
- Kiểm tra SQL Server service có chạy không
- Kiểm tra firewall không chặn port 1433
- Thử dùng `(localdb)\MSSQLLocalDB` thay vì `localhost`

## 🧪 Test Connection

Sau khi setup xong, chạy lệnh để test:

```powershell
dotnet run
```

Mở trình duyệt và truy cập:
- API Docs: http://localhost:5000/swagger
- Health Check: http://localhost:5000/health

## 📝 Ghi chú

- Database sử dụng **IDENTITY** cho Primary Keys
- Tất cả timestamps sử dụng **GETUTCDATE()** (UTC time)
- Có indexes được tạo sẵn cho performance
- Có constraints kiểm tra dữ liệu (Rating 1-5, EndDate > StartDate)
- Có stored procedure và view sẵn cho dashboard

## 🔄 Reset Database

Nếu muốn reset lại database từ đầu:

```sql
USE master;
GO

ALTER DATABASE CarRentalDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE CarRentalDb;
GO
```

Sau đó chạy lại script `CreateDatabase.sql`.
