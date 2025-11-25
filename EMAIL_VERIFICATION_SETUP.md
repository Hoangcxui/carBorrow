# Email Verification Setup Guide

## Tổng quan
Hệ thống CarBorrow đã tích hợp tính năng xác thực email khi đăng ký. Người dùng sẽ nhận mã OTP 6 chữ số qua email để xác thực tài khoản.

## Cấu hình Email Service

### 1. Tạo App Password cho Gmail

Để gửi email qua Gmail SMTP, bạn cần tạo App Password:

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập Gmail của bạn
3. Chọn "Mail" làm app type
4. Chọn "Windows Computer" làm device
5. Click "Generate"
6. Lưu lại password 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

### 2. Cập nhật appsettings.json

Mở file `backend/appsettings.json` và cập nhật:

```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "FromEmail": "your-email@gmail.com",  // ← Thay email của bạn
    "FromName": "CarBorrow",
    "Username": "your-email@gmail.com",    // ← Thay email của bạn
    "Password": "abcd efgh ijkl mnop"      // ← Thay App Password vừa tạo
  }
}
```

### 3. Restart Backend

```powershell
cd d:\carBorrow
docker-compose restart backend
```

## Kiểm tra Database

Table `VerificationCodes` đã được tạo với cấu trúc:

```sql
SELECT * FROM VerificationCodes;
```

| Column    | Type          | Description                          |
|-----------|---------------|--------------------------------------|
| Id        | INT           | Primary key                          |
| Email     | NVARCHAR(255) | Email nhận mã                        |
| Code      | NVARCHAR(10)  | Mã OTP 6 chữ số                      |
| Purpose   | NVARCHAR(50)  | "registration" hoặc "password-reset" |
| CreatedAt | DATETIME2     | Thời gian tạo                        |
| ExpiresAt | DATETIME2     | Thời gian hết hạn (10 phút)          |
| IsUsed    | BIT           | Đã sử dụng chưa                      |

## API Endpoints

### 1. Send Verification Code

**POST** `/api/verification/send-code`

Request:
```json
{
  "email": "user@example.com"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Mã xác thực đã được gửi đến email của bạn",
  "expiresIn": 600
}
```

Response (Error):
```json
{
  "message": "Email đã được đăng ký"
}
```

### 2. Verify Code

**POST** `/api/verification/verify-code`

Request:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Xác thực thành công"
}
```

Response (Error):
```json
{
  "message": "Mã xác thực không hợp lệ hoặc đã hết hạn"
}
```

## Frontend Integration

### Registration Flow

1. User điền form đăng ký
2. Click "Create account"
3. Modal hiển thị yêu cầu nhập OTP
4. Mã OTP được gửi tự động qua email
5. User nhập mã 6 chữ số
6. Click "Xác thực"
7. Nếu đúng → Hoàn tất đăng ký
8. Nếu sai → Hiển thị lỗi, cho phép gửi lại

### Components

- `EmailVerification.tsx`: Modal component cho OTP verification
- `register/page.tsx`: Updated để tích hợp email verification

### Features

- ✅ Auto-send OTP khi modal mở
- ✅ Countdown timer 60 giây cho resend
- ✅ Input validation (6 chữ số)
- ✅ Error handling
- ✅ Loading states

## Testing

### 1. Test Backend API

```powershell
# Send code
Invoke-RestMethod -Uri "http://localhost:5001/api/verification/send-code" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"test@gmail.com"}'

# Verify code (check email for code)
Invoke-RestMethod -Uri "http://localhost:5001/api/verification/verify-code" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"test@gmail.com","code":"123456"}'
```

### 2. Test Frontend

1. Mở http://localhost:3000/register
2. Điền thông tin đăng ký
3. Click "Create account"
4. Kiểm tra email inbox
5. Nhập mã OTP vào modal
6. Click "Xác thực"

## Email Template

Email gửi đi sẽ có định dạng HTML:

**Subject:** Mã xác thực tài khoản CarBorrow

**Body:**
```
Xin chào,

Mã xác thực của bạn là: 123456

Mã này sẽ hết hạn sau 10 phút.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

Trân trọng,
CarBorrow Team
```

## Security Notes

1. **App Password**: Không commit vào Git
2. **Rate Limiting**: Old codes tự động xóa khi gửi mã mới
3. **Expiration**: Mã hết hạn sau 10 phút
4. **One-time Use**: Mã chỉ dùng được 1 lần (IsUsed flag)
5. **Index**: Email/Code/Purpose được index để tối ưu query

## Troubleshooting

### Lỗi "Authentication Required"

**Nguyên nhân**: Chưa cấu hình email credentials hoặc App Password sai

**Giải pháp**:
1. Kiểm tra `appsettings.json` có đúng email/password không
2. Đảm bảo đã tạo App Password (không dùng mật khẩu Gmail thông thường)
3. Restart backend container

### Lỗi "Email đã được đăng ký"

**Nguyên nhân**: Email đã tồn tại trong bảng Users

**Giải pháp**: Dùng email khác hoặc xóa user cũ

### Lỗi "Mã xác thực không hợp lệ"

**Nguyên nhân**: 
- Mã đã hết hạn (>10 phút)
- Mã đã được sử dụng
- Mã nhập sai

**Giải pháp**: Click "Gửi lại mã" để nhận mã mới

### Email không đến inbox

**Kiểm tra**:
1. Folder Spam/Junk
2. Email address đúng chưa
3. Backend logs: `docker logs carborrow-backend --tail 50`
4. SMTP settings trong appsettings.json

## Next Steps

Sau khi setup xong email verification:

1. ✅ Test flow đăng ký với email thật
2. ✅ Verify email nhận được
3. ✅ Test resend functionality
4. ✅ Test expiration (đợi >10 phút)
5. ✅ Test error cases

## Alternative Email Providers

Nếu không dùng Gmail, có thể dùng:

### SendGrid
```json
{
  "SmtpHost": "smtp.sendgrid.net",
  "SmtpPort": 587,
  "Username": "apikey",
  "Password": "YOUR_SENDGRID_API_KEY"
}
```

### Mailgun
```json
{
  "SmtpHost": "smtp.mailgun.org",
  "SmtpPort": 587,
  "Username": "postmaster@yourdomain.mailgun.org",
  "Password": "YOUR_MAILGUN_PASSWORD"
}
```

### Outlook
```json
{
  "SmtpHost": "smtp-mail.outlook.com",
  "SmtpPort": 587,
  "Username": "your-email@outlook.com",
  "Password": "your-password"
}
```

## Production Checklist

Trước khi deploy production:

- [ ] Cấu hình email service provider chính thức
- [ ] Set Email credentials vào environment variables (không hard-code)
- [ ] Enable rate limiting cho send-code endpoint
- [ ] Add CAPTCHA để chống spam
- [ ] Log failed verification attempts
- [ ] Setup email templates với branding
- [ ] Test với nhiều email providers
- [ ] Monitor email delivery rate

---

**Tài liệu cập nhật**: 2025-11-25
**Phiên bản**: 1.0
