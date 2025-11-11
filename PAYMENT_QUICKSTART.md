# 💳 Quick Start - Thanh toán QR

## 🚀 Cách nhanh nhất (2 phút)

### Bước 1: Cập nhật thông tin ngân hàng
Mở `backend/appsettings.Development.json`:

```json
{
  "VietQR": {
    "BankCode": "970422",           // Mã ngân hàng (MB Bank)
    "AccountNumber": "0123456789",  // SỐ TÀI KHOẢN CỦA ANH
    "AccountName": "NGUYEN VAN A"   // TÊN CHỦ TÀI KHOẢN
  }
}
```

**Danh sách mã ngân hàng phổ biến:**
- `970422` - MB Bank
- `970436` - Vietcombank
- `970407` - Techcombank
- `970416` - ACB
- `970418` - BIDV

### Bước 2: Restart Backend
```powershell
cd backend
dotnet run
```

### Bước 3: Test!
1. Login vào http://localhost:3000
2. Tạo booking
3. Click "Thanh toán"
4. Quét QR bằng app ngân hàng
5. Chuyển tiền (test với 1,000 VNĐ)
6. Admin vào xác nhận

## 📚 Hướng dẫn chi tiết

- **VietQR (Khuyến nghị cho local)**: Xem `VIETQR_SETUP_GUIDE.md`
- **VNPay (Cho production)**: Xem `VNPAY_INTEGRATION_GUIDE.md`

## 🎯 2 phương thức thanh toán

### 1. VietQR - Chuyển khoản ngân hàng ✅ (Dễ nhất)
- ✅ Không cần đăng ký
- ✅ Dùng ngay với số TK thật
- ✅ 100% miễn phí
- ❌ Admin phải xác nhận thủ công

**API Endpoint:**
```
POST /api/payment/create-vietqr-payment
```

### 2. VNPay - Cổng thanh toán (Production)
- ❌ Cần đăng ký merchant
- ❌ Khó test trên local
- ✅ Tự động xác nhận
- ✅ Professional

**API Endpoint:**
```
POST /api/payment/create-qr-payment
```

## 🛠️ Troubleshooting

### QR không hiển thị?
```powershell
# Check logs
cat backend/logs/log-*.txt
```

### Database chưa có bảng Payments?
```powershell
cd backend
dotnet ef migrations add AddPaymentTable
dotnet ef database update
```

### Build lỗi?
```powershell
cd backend
dotnet restore
dotnet build
```

## 📞 Support

- Issues: https://github.com/Hoangcxui/carBorrow/issues
- Email: support@carborrow.com
