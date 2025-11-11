# 💳 Hướng dẫn tích hợp thanh toán QR Code VNPay

## 📋 Tổng quan

Hệ thống đã được tích hợp thanh toán QR Code thông qua cổng thanh toán VNPay, cho phép khách hàng thanh toán đặt xe một cách nhanh chóng và tiện lợi.

## ✅ Các tính năng đã implement

### Backend (ASP.NET Core)
- ✅ Payment entity với các trường: PaymentMethod, Amount, Status, TransactionId, QRCode, ExpiresAt
- ✅ VNPayService để tạo payment URL và xử lý callback/IPN
- ✅ PaymentController với các endpoints:
  - `POST /api/payment/create-qr-payment` - Tạo QR code thanh toán
  - `GET /api/payment/vnpay-callback` - Xử lý callback từ VNPay
  - `POST /api/payment/vnpay-ipn` - Instant Payment Notification
  - `GET /api/payment/{id}` - Lấy thông tin payment
  - `GET /api/payment/booking/{bookingId}` - Lấy payments theo booking
  - `POST /api/payment/confirm-manual/{paymentId}` - Admin xác nhận thủ công
- ✅ QRCoder library để generate QR code từ payment URL
- ✅ Payment validation và expiration (15 phút)
- ✅ Tự động cập nhật booking status khi thanh toán thành công

### Frontend (Next.js)
- ✅ QRPayment component với countdown timer
- ✅ VNPay Return page với success/failure handling
- ✅ Responsive design cho mobile và desktop
- ✅ Auto-refresh payment status
- ✅ User-friendly error messages

## 🔧 Cấu hình VNPay

### Bước 1: Đăng ký VNPay Sandbox (để test)

1. Truy cập: https://sandbox.vnpayment.vn/devreg/
2. Đăng ký tài khoản sandbox
3. Sau khi đăng ký, bạn sẽ nhận được:
   - **TmnCode**: Mã merchant (ví dụ: `TESTCODE123`)
   - **HashSecret**: Secret key để mã hóa (ví dụ: `YOURSECRETKEY...`)

### Bước 2: Cập nhật Backend Configuration

Mở file `backend/appsettings.Development.json` và thay thế các giá trị:

```json
{
  "VNPay": {
    "TmnCode": "YOUR_SANDBOX_TMN_CODE",        // ← Thay bằng TmnCode của bạn
    "HashSecret": "YOUR_SANDBOX_HASH_SECRET",  // ← Thay bằng HashSecret của bạn
    "Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://localhost:3000/payment/vnpay-return",
    "IpnUrl": "http://localhost:5000/api/payment/vnpay-ipn"
  }
}
```

**Lưu ý quan trọng:**
- Trong môi trường **development**, dùng các giá trị trên
- Trong môi trường **production**, cập nhật `appsettings.json` với credentials production và đổi URL sang `https://vnpayment.vn/paymentv2/vpcpay.html`

### Bước 3: Tạo Migration và Update Database

```powershell
cd backend
dotnet ef migrations add AddPaymentTable
dotnet ef database update
```

Nếu bạn đang dùng Docker, restart container backend để migration tự động chạy.

## 🚀 Hướng dẫn sử dụng

### Cho Developers

#### 1. Start Backend
```powershell
cd backend
dotnet run
```
Backend sẽ chạy tại: http://localhost:5000
Swagger UI: http://localhost:5000/swagger

#### 2. Start Frontend
```powershell
cd car-rent-frontend
npm install  # nếu chưa cài
npm run dev
```
Frontend sẽ chạy tại: http://localhost:3000

#### 3. Test thanh toán

**Flow thanh toán:**
1. Khách hàng đặt xe (tạo booking)
2. Khách hàng click "Thanh toán" trên booking detail page
3. Hệ thống hiển thị QR Payment modal
4. API `/api/payment/create-qr-payment` được gọi:
   - Tạo Payment record (status: Pending)
   - Generate VNPay payment URL
   - Tạo QR code từ URL
   - Return QR code (base64) và payment URL
5. Khách hàng có 2 lựa chọn:
   - Quét QR code bằng app ngân hàng/VNPay
   - Click button "Mở trang thanh toán VNPay"
6. Sau khi thanh toán:
   - VNPay redirect về `/payment/vnpay-return?success=true&bookingId=...`
   - Hệ thống cập nhật Payment status = "Success"
   - Booking status = "Confirmed"

### Cho End Users

#### Thanh toán bằng QR Code:
1. Đăng nhập vào hệ thống
2. Chọn xe và tạo booking
3. Vào "Đơn đặt xe của tôi" → Click "Thanh toán"
4. Quét mã QR hiển thị bằng app ngân hàng
5. Xác nhận thanh toán
6. Đợi hệ thống tự động cập nhật (hoặc F5 lại trang)

#### Thanh toán bằng Web:
1. Sau khi hiển thị QR code, click "Mở trang thanh toán VNPay"
2. Chọn ngân hàng và nhập thông tin thẻ
3. Xác thực OTP
4. Hoàn tất thanh toán

## 🧪 Test với VNPay Sandbox

VNPay Sandbox cung cấp các thẻ test:

### Thẻ ATM Nội địa (NCB):
- **Số thẻ**: 9704198526191432198
- **Tên chủ thẻ**: NGUYEN VAN A
- **Ngày phát hành**: 07/15
- **Mật khẩu OTP**: 123456

### Thẻ Quốc tế (Visa):
- **Số thẻ**: 4111111111111111
- **Tên chủ thẻ**: NGUYEN VAN A
- **Ngày hết hạn**: 12/25
- **CVV**: 123

### Các response codes quan trọng:
- `00`: Giao dịch thành công
- `07`: Trừ tiền thành công nhưng nghi ngờ gian lận
- `09`: Thẻ chưa đăng ký Internet Banking
- `10`: Xác thực sai quá 3 lần
- `11`: Hết hạn chờ thanh toán
- `12`: Thẻ bị khóa
- `24`: Khách hàng hủy giao dịch
- `51`: Tài khoản không đủ số dư
- `65`: Vượt quá hạn mức giao dịch
- `75`: Ngân hàng đang bảo trì

## 📊 Database Schema

### Bảng Payments

| Column             | Type          | Description                        |
|--------------------|---------------|------------------------------------|
| Id                 | int           | Primary key                        |
| BookingId          | int           | Foreign key to Bookings            |
| PaymentMethod      | varchar(50)   | "QR", "Cash", "Card", "BankTransfer" |
| Amount             | decimal(10,2) | Số tiền thanh toán                 |
| PaymentStatus      | varchar(50)   | "Pending", "Success", "Failed", "Cancelled" |
| TransactionId      | varchar(100)  | Mã giao dịch từ VNPay              |
| QRCodeUrl          | varchar(500)  | Base64 data URL của QR code        |
| PaymentDescription | varchar(1000) | Mô tả thanh toán                   |
| CreatedAt          | datetime      | Thời gian tạo                      |
| PaidAt             | datetime?     | Thời gian thanh toán thành công    |
| ExpiresAt          | datetime?     | Thời gian hết hạn QR (15 phút)     |

### Relationships
- Payment ← Booking (many-to-one)
- Booking có thể có nhiều Payment records (nếu khách hàng tạo QR nhiều lần)

## 🔐 Bảo mật

1. **HMAC-SHA512 Signature**: Tất cả requests/responses đều được verify bằng HMAC
2. **HTTPS Only**: Production phải dùng HTTPS cho tất cả callbacks
3. **Token Expiration**: QR code hết hạn sau 15 phút
4. **IP Whitelist**: VNPay yêu cầu whitelist IP cho IPN endpoint trong production
5. **Payment Validation**: Kiểm tra duplicate payments và booking status

## 🐛 Troubleshooting

### 1. QR Code không hiển thị
- Kiểm tra TmnCode và HashSecret đã được cấu hình chưa
- Check console log để xem error message
- Verify token authentication (phải login)

### 2. Callback không hoạt động
- Đảm bảo ReturnUrl đúng format: `http://localhost:3000/payment/vnpay-return`
- Check network tab xem VNPay có redirect về chưa
- Verify signature validation trong logs

### 3. IPN không được gọi
- IPN chỉ hoạt động khi có public IP/domain
- Trong development, IPN sẽ không được VNPay gọi
- Dùng ngrok/tunneling nếu cần test IPN locally

### 4. Payment status không update
- Check database logs để xem callback có được xử lý chưa
- Verify BookingId trong callback response
- Check Payment record status trong database

### 5. Migration lỗi
- Đảm bảo đã cài `dotnet tool install --global dotnet-ef`
- Nếu lỗi conflict, run: `dotnet ef migrations remove` rồi add lại
- Check connection string trong appsettings.json

## 📝 API Endpoints chi tiết

### 1. Create QR Payment
```http
POST /api/payment/create-qr-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 123
}

Response 200:
{
  "paymentId": 456,
  "qrCodeUrl": "data:image/png;base64,...",
  "paymentUrl": "https://sandbox.vnpayment.vn/...",
  "amount": 1500000,
  "expiresAt": "2025-11-11T16:00:00Z",
  "paymentDescription": "Thanh toán đặt xe #123..."
}
```

### 2. VNPay Callback
```http
GET /api/payment/vnpay-callback?vnp_Amount=150000000&vnp_TxnRef=123_...&vnp_SecureHash=...

Response: Redirect to frontend
http://localhost:3000/payment/vnpay-return?success=true&bookingId=123&transactionId=14012583
```

### 3. Get Payment Info
```http
GET /api/payment/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": 456,
  "bookingId": 123,
  "paymentMethod": "QR",
  "amount": 1500000,
  "paymentStatus": "Success",
  "transactionId": "14012583",
  "createdAt": "2025-11-11T15:00:00Z",
  "paidAt": "2025-11-11T15:05:00Z"
}
```

### 4. Admin Confirm Manual Payment
```http
POST /api/payment/confirm-manual/456
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "transactionId": "BANK_TRANSFER_123",
  "note": "Khách đã chuyển khoản"
}

Response 200:
{
  "message": "Xác nhận thanh toán thành công",
  "payment": { ... }
}
```

## 📱 Integration vào existing Booking Flow

### Booking Detail Page (Frontend)

```tsx
import { useState } from 'react';
import QRPayment from '@/components/QRPayment';

function BookingDetailPage({ booking }) {
  const [showQRPayment, setShowQRPayment] = useState(false);

  const handlePayment = () => {
    setShowQRPayment(true);
  };

  return (
    <div>
      {/* Booking details */}
      
      {booking.status === 'Pending' && (
        <button onClick={handlePayment}>
          Thanh toán ngay
        </button>
      )}

      {showQRPayment && (
        <QRPayment
          bookingId={booking.id}
          amount={booking.totalCost}
          onSuccess={() => {
            setShowQRPayment(false);
            // Refresh booking data
            router.refresh();
          }}
          onCancel={() => setShowQRPayment(false)}
        />
      )}
    </div>
  );
}
```

## 🌐 Production Deployment Checklist

- [ ] Đăng ký VNPay merchant account production
- [ ] Cập nhật TmnCode và HashSecret production vào `appsettings.json`
- [ ] Đổi VNPay URL sang `https://vnpayment.vn/paymentv2/vpcpay.html`
- [ ] Cập nhật ReturnUrl và IpnUrl với domain production
- [ ] Whitelist IP server production trên VNPay portal
- [ ] Test toàn bộ flow trên production với thẻ thật
- [ ] Setup monitoring và alerting cho payment failures
- [ ] Configure backup payment method (manual confirmation)
- [ ] Document support process cho payment issues

## 📞 Liên hệ & Hỗ trợ

- **VNPay Documentation**: https://sandbox.vnpayment.vn/apis/docs/
- **VNPay Support**: hotro@vnpay.vn
- **Project Issues**: https://github.com/Hoangcxui/carBorrow/issues

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.
