# Hướng dẫn kết nối Mobile App với Backend

## 📱 Kết nối Mobile với Backend API

Mobile app đã được cấu hình để kết nối với backend API. Dưới đây là hướng dẫn chi tiết.

## 🔧 Cấu hình hiện tại

### Backend API
- **URL**: http://10.21.3.234:5000
- **Port**: 5000
- **CORS**: Đã bật cho tất cả origins trong development mode

### Mobile App
- **Config file**: `carRentMobile/config/index.ts`
- **API Service**: `carRentMobile/services/ApiService.ts`
- **API Base URL**: http://10.21.3.234:5000 (development)

## 📝 Các bước đã thực hiện

### 1. Cập nhật API Base URL
```typescript
// carRentMobile/config/index.ts
API_BASE_URL: __DEV__ ? 'http://10.21.3.234:5000' : 'https://your-production-api.com',
```

### 2. Tạo Test Connection Service
- File: `services/TestConnectionService.ts`
- Chức năng:
  - Test connection đến backend
  - Kiểm tra các endpoints
  - Hiển thị thông báo lỗi chi tiết

### 3. Tạo Test Connection Screen
- File: `app/test-connection.tsx`
- Truy cập: Vào màn hình "Features" → Click "Test Backend Connection"
- Chức năng:
  - Test kết nối đến backend
  - Hiển thị status của các endpoints
  - Hướng dẫn troubleshooting

## 🚀 Cách sử dụng

### Bước 1: Đảm bảo Backend đang chạy
```bash
cd backend
dotnet run
```

Backend phải chạy trên port 5000.

### Bước 2: Kiểm tra IP máy tính
Lấy địa chỉ IP của máy tính (đã có từ Expo: 10.21.3.234)

### Bước 3: Cập nhật config (nếu IP thay đổi)
```typescript
// carRentMobile/config/index.ts
API_BASE_URL: 'http://[YOUR_IP]:5000'
```

### Bước 4: Test kết nối
1. Mở mobile app
2. Vào tab "Features" 
3. Click "Test Backend Connection"
4. Click "Test Connection" button

## 🔍 Kiểm tra kết nối

### Các endpoints quan trọng:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/health` | GET | Health check |
| `/api/auth/login` | POST | Đăng nhập |
| `/api/auth/register` | POST | Đăng ký |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/vehicles` | GET | Danh sách xe |
| `/api/booking` | GET | Danh sách booking |

### Test thủ công với curl:
```bash
# Test health check
curl http://10.21.3.234:5000/health

# Test API endpoint
curl http://10.21.3.234:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to backend"
**Nguyên nhân**: Backend không chạy hoặc firewall chặn

**Giải pháp**:
1. Kiểm tra backend đang chạy: `dotnet run`
2. Kiểm tra port 5000 có bị chiếm: `lsof -ti:5000`
3. Tắt firewall tạm thời hoặc cho phép port 5000

### Lỗi: "Network Error" / "ECONNREFUSED"
**Nguyên nhân**: Mobile không thể kết nối đến IP của máy tính

**Giải pháp**:
1. Đảm bảo điện thoại và máy tính cùng mạng WiFi
2. Kiểm tra IP máy tính: `ipconfig getifaddr en0` (Mac) hoặc `ipconfig` (Windows)
3. Cập nhật IP trong `config/index.ts`
4. Restart Expo: `r` trong terminal

### Lỗi: "CORS Error"
**Nguyên nhân**: Backend chặn request từ mobile app

**Giải pháp**:
Backend đã được cấu hình CORS cho phép tất cả origins trong development:
```csharp
// backend/Program.cs
policy.AllowAnyOrigin()
      .AllowAnyHeader()
      .AllowAnyMethod();
```

### Lỗi: 401 Unauthorized
**Nguyên nhân**: Token không hợp lệ hoặc hết hạn

**Giải pháp**:
- Đăng nhập lại
- Kiểm tra token trong secure storage
- API Service đã có refresh token tự động

## 📊 API Service Features

### 1. Tự động thêm JWT Token
```typescript
// Request interceptor tự động thêm Bearer token
config.headers.Authorization = `Bearer ${token}`;
```

### 2. Tự động Refresh Token
```typescript
// Response interceptor xử lý 401 và refresh token
if (error.response?.status === 401) {
  await this.refreshToken();
}
```

### 3. Generic API Methods
```typescript
// GET request
const response = await ApiService.get('/api/vehicles');

// POST request
const response = await ApiService.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// PUT request
const response = await ApiService.put('/api/booking/1', data);

// DELETE request
const response = await ApiService.delete('/api/booking/1');
```

## 🔐 Authentication Flow

### 1. Đăng ký
```typescript
const response = await ApiService.post('/api/auth/register', {
  email: 'user@example.com',
  password: 'password',
  fullName: 'User Name',
  phoneNumber: '0123456789'
});
```

### 2. Đăng nhập
```typescript
const response = await ApiService.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Lưu token
await SecureStore.setItemAsync('accessToken', response.data.token);
await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
```

### 3. Sử dụng API với token
```typescript
// Token tự động được thêm vào header
const vehicles = await ApiService.get('/api/vehicles');
```

## 📱 Test trên thiết bị

### iOS Simulator
- Có thể dùng `localhost:5000` hoặc IP máy tính
- Mở với: `npx expo start` → nhấn `i`

### Android Emulator
- Phải dùng `10.0.2.2:5000` cho localhost hoặc IP máy tính
- Mở với: `npx expo start` → nhấn `a`

### Thiết bị thật
- Phải dùng IP máy tính trên cùng mạng WiFi
- Quét QR code từ Expo Go

## 🎯 Kết quả mong đợi

Khi test connection thành công:
```
✅ Status: Success
✅ Connection successful!
✅ Health check endpoint: Available
✅ Auth endpoints: 400 (endpoint exists, just needs valid data)
```

## 📚 Tài liệu tham khảo

- [Expo API Reference](https://docs.expo.dev/)
- [React Native Networking](https://reactnative.dev/docs/network)
- [ASP.NET Core CORS](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [JWT Authentication](https://jwt.io/introduction)

## 🆘 Cần trợ giúp?

Nếu vẫn gặp vấn đề:
1. Kiểm tra logs trong terminal của backend
2. Kiểm tra logs trong React Native debugger
3. Dùng test connection screen để xem lỗi chi tiết
4. Kiểm tra network tab trong browser (nếu chạy web)
