# 🏦 Hướng dẫn Setup VietQR Banking - KHÔNG CẦN ĐĂNG KÝ

## ✅ Giải pháp cho Local Development

Vì anh đang chạy local và không thể đăng ký VNPay sandbox, em đã thêm **VietQR** - phương thức thanh toán QR Banking **100% miễn phí** và **KHÔNG CẦN merchant account**!

## 🎯 Ưu điểm VietQR

- ✅ **Không cần đăng ký**: Không cần TmnCode, HashSecret hay bất kỳ merchant nào
- ✅ **100% Miễn phí**: API công khai từ vietqr.io
- ✅ **Dùng ngay**: Chỉ cần số tài khoản ngân hàng của anh
- ✅ **Test thật**: Có thể test với tài khoản ngân hàng thật
- ✅ **30+ ngân hàng**: Hỗ trợ hầu hết ngân hàng Việt Nam

## 🚀 Setup nhanh (3 bước - 2 phút)

### Bước 1: Cập nhật thông tin ngân hàng của anh

Mở file `backend/appsettings.Development.json` và thay thế:

```json
{
  "VietQR": {
    "BankCode": "970422",              // ← Mã ngân hàng (xem bảng bên dưới)
    "AccountNumber": "0123456789",     // ← Số tài khoản của ANH
    "AccountName": "NGUYEN VAN A"      // ← Tên chủ tài khoản của ANH
  }
}
```

**Lưu ý**: 
- Đây là tài khoản **THẬT** của anh (để nhận tiền test)
- Hoặc dùng tài khoản test nếu không muốn dùng tài khoản thật

### Bước 2: Restart Backend

```powershell
cd backend
dotnet run
```

### Bước 3: Test ngay!

1. Login vào hệ thống
2. Tạo booking
3. Click "Thanh toán" → Chọn "Chuyển khoản ngân hàng"
4. Quét QR bằng app ngân hàng của anh
5. **Nội dung chuyển khoản** sẽ tự động điền: `CARBORROW 123`
6. Xác nhận chuyển khoản
7. Admin vào xác nhận thủ công (vì local không có webhook)

## 📋 Danh sách mã ngân hàng (BankCode)

| Mã      | Tên ngân hàng           | Tên viết tắt |
|---------|-------------------------|--------------|
| 970422  | MB Bank                 | MBBank       |
| 970436  | Vietcombank             | VCB          |
| 970407  | Techcombank             | TCB          |
| 970416  | ACB                     | ACB          |
| 970415  | Vietinbank              | VTB          |
| 970432  | VPBank                  | VPB          |
| 970423  | TPBank                  | TPB          |
| 970403  | Sacombank               | STB          |
| 970418  | BIDV                    | BIDV         |
| 970448  | OCB                     | OCB          |
| 970405  | Agribank                | AGB          |
| 970437  | HDBank                  | HDB          |
| 970441  | VIB                     | VIB          |
| 970443  | SHB                     | SHB          |
| 970440  | SeABank                 | SAB          |
| 970426  | MSB                     | MSB          |
| 970429  | SCB                     | SCB          |
| 970449  | LienVietPostBank        | LPB          |

Ví dụ config với **Vietcombank**:
```json
{
  "VietQR": {
    "BankCode": "970436",
    "AccountNumber": "0011223344556",
    "AccountName": "NGUYEN VAN A"
  }
}
```

## 🔧 API Endpoints (Backend đã sẵn sàng)

### 1. Tạo QR Chuyển khoản
```http
POST /api/payment/create-vietqr-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 123
}

Response 200:
{
  "paymentId": 456,
  "qrCodeUrl": "https://img.vietqr.io/image/970422-0123456789-compact2.png?amount=1500000&addInfo=CARBORROW%20123",
  "amount": 1500000,
  "bankCode": "970422",
  "bankName": "MB Bank (MBBank)",
  "accountNumber": "0123456789",
  "accountName": "NGUYEN VAN A",
  "content": "CARBORROW 123",
  "note": "⚠️ Vui lòng chuyển khoản ĐÚNG NỘI DUNG để Admin có thể xác nhận thanh toán"
}
```

### 2. Admin xác nhận thanh toán thủ công
```http
POST /api/payment/confirm-manual/456
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "transactionId": "MB12345678",
  "note": "Đã nhận chuyển khoản từ khách"
}

Response 200:
{
  "message": "Xác nhận thanh toán thành công"
}
```

### 3. Lấy danh sách ngân hàng hỗ trợ
```http
GET /api/payment/supported-banks

Response 200:
[
  { "code": "970422", "name": "MB Bank (MBBank)" },
  { "code": "970436", "name": "Vietcombank (VCB)" },
  ...
]
```

## 🎨 Frontend Component (Đã tạo sẵn)

Component `QRPayment.tsx` đã hỗ trợ hiển thị VietQR. Chỉ cần gọi:

```tsx
<QRPayment
  bookingId={123}
  amount={1500000}
  paymentMethod="vietqr"  // ← Chọn vietqr thay vì vnpay
  onSuccess={() => console.log('Success!')}
  onCancel={() => console.log('Cancelled')}
/>
```

## 🧪 Testing Flow

### Luồng thanh toán VietQR:

1. **Khách hàng tạo booking**
2. **Click "Thanh toán" → Chọn "Chuyển khoản ngân hàng"**
3. **API `/api/payment/create-vietqr-payment` được gọi**:
   - Tạo Payment record (status: Pending)
   - Generate VietQR URL với thông tin: BankCode + AccountNumber + Amount + Content
   - Return QR code URL
4. **Khách hàng quét QR bằng app ngân hàng**:
   - Thông tin tự động điền đầy đủ
   - Nội dung: `CARBORROW 123` (quan trọng!)
   - Số tiền đã điền sẵn
5. **Khách hàng xác nhận chuyển khoản**
6. **Admin kiểm tra app banking**:
   - Thấy chuyển khoản từ khách với nội dung `CARBORROW 123`
   - Login vào Admin Dashboard
   - Vào "Payments" → Tìm payment ID
   - Click "Xác nhận thanh toán"
7. **Hệ thống tự động**:
   - Cập nhật Payment status = "Success"
   - Cập nhật Booking status = "Confirmed"
   - Gửi email xác nhận (nếu có)

## 📸 Demo Screenshots

### QR Code hiển thị cho khách:
```
╔════════════════════════════╗
║   [QR CODE IMAGE]          ║
║                            ║
║   Số tiền: 1,500,000 VNĐ   ║
║   Nội dung: CARBORROW 123  ║
║   Ngân hàng: MB Bank       ║
║   STK: 0123456789          ║
║   Chủ TK: NGUYEN VAN A     ║
╚════════════════════════════╝
```

### App Banking sau khi quét:
```
Chuyển tiền
━━━━━━━━━━━━━━━━━━━━━
Ngân hàng:     MB Bank
Số TK:         0123456789
Tên:           NGUYEN VAN A
Số tiền:       1,500,000 VNĐ
Nội dung:      CARBORROW 123
━━━━━━━━━━━━━━━━━━━━━
         [Xác nhận]
```

## ⚠️ Lưu ý quan trọng

### 1. Nội dung chuyển khoản
- **BẮT BUỘC** phải đúng format: `CARBORROW {BookingId}`
- Ví dụ: `CARBORROW 123`, `CARBORROW 456`
- Admin dựa vào nội dung này để đối soát

### 2. Xác nhận thủ công
- VietQR **KHÔNG có callback tự động** như VNPay
- Admin phải **xác nhận thủ công** sau khi nhận tiền
- Có thể tự động hóa bằng cách:
  - Tích hợp API Banking (cần đăng ký với ngân hàng)
  - Dùng OCR để đọc SMS banking
  - Crawl lịch sử giao dịch định kỳ

### 3. Thời gian hết hạn
- QR VietQR hết hạn sau **24 giờ** (khác VNPay là 15 phút)
- Vì chuyển khoản ngân hàng có thể mất thời gian

### 4. Bảo mật
- Không public số tài khoản ngân hàng ra ngoài
- Chỉ hiển thị cho khách hàng đã login
- Admin access có audit log

## 🆚 So sánh VNPay vs VietQR

| Tính năng          | VNPay                    | VietQR                 |
|--------------------|--------------------------|------------------------|
| Đăng ký merchant   | ✅ Cần                   | ❌ Không cần          |
| Setup              | Phức tạp                 | ✅ Cực đơn giản       |
| Phí dịch vụ        | 1.5% - 3%                | ✅ Miễn phí           |
| Callback tự động   | ✅ Có                    | ❌ Không (cần manual) |
| Test trên local    | ❌ Khó (cần ngrok)       | ✅ Dễ dàng            |
| QR expiration      | 15 phút                  | 24 giờ                |
| Xác nhận thanh toán| Tự động                  | Thủ công              |
| Phù hợp cho        | Production, tự động hóa  | ✅ Local dev, MVP     |

## 🚀 Nâng cao: Tự động hóa VietQR (Optional)

Nếu anh muốn tự động hóa việc xác nhận thanh toán VietQR, có thể:

### Option 1: API Banking (Khuyến nghị cho Production)
- Đăng ký API Banking với ngân hàng (VCB, TCB, MB có API)
- Poll transaction history mỗi 1-5 phút
- Tự động match theo nội dung `CARBORROW {BookingId}`
- Update payment status tự động

### Option 2: SMS Banking + OCR
- Đọc SMS banking notification
- Extract booking ID từ nội dung
- Auto-confirm payment

### Option 3: Manual Dashboard
- Admin vào dashboard
- Xem list pending payments
- Check app banking
- Click "Confirm" button

## 💡 Tips

1. **Test với số tiền nhỏ**: 1,000 - 10,000 VNĐ
2. **Dùng tài khoản test**: Tạo tài khoản ngân hàng riêng cho dev
3. **Screenshot để proof**: Chụp màn hình mỗi lần test
4. **Audit log**: Mọi manual confirmation đều có log

## 📞 Troubleshooting

### QR code không hiển thị
- Check config trong `appsettings.Development.json`
- Verify BankCode đúng format (6 chữ số)
- Check logs: `logs/log-*.txt`

### QR code hiển thị nhưng thông tin sai
- Double-check AccountNumber
- Verify AccountName không có ký tự đặc biệt
- BankCode phải đúng với ngân hàng của anh

### Admin không thấy payment
- Check database: `SELECT * FROM Payments WHERE PaymentStatus = 'Pending'`
- Verify BookingId
- Check API response trong Network tab

### Không confirm được payment
- Check role: phải là Admin hoặc Staff
- Verify paymentId đúng
- Check logs xem có error gì

## ✅ Checklist Setup

- [ ] Cập nhật BankCode trong `appsettings.Development.json`
- [ ] Cập nhật AccountNumber (số tài khoản thật của anh)
- [ ] Cập nhật AccountName (tên chủ tài khoản)
- [ ] Restart backend: `dotnet run`
- [ ] Test tạo booking
- [ ] Test tạo QR payment
- [ ] Quét QR bằng app ngân hàng
- [ ] Chuyển tiền test (1,000 VNĐ)
- [ ] Admin confirm payment
- [ ] Verify booking status = "Confirmed"

## 🎉 Kết luận

VietQR là giải pháp **hoàn hảo cho local development** khi không thể đăng ký VNPay sandbox. 

**Ưu điểm lớn nhất**: 
- ✅ Setup trong 2 phút
- ✅ Không cần đăng ký gì cả
- ✅ Test với tài khoản thật
- ✅ 100% miễn phí

**Nhược điểm**:
- ❌ Phải confirm thủ công
- ❌ Không có callback tự động

Khi deploy production và có nhiều transaction, anh nên chuyển sang VNPay hoặc tích hợp API Banking để tự động hóa!

---

**Có thắc mắc gì cứ hỏi em nhé anh! 💪**
