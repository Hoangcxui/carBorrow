# 🚀 Kết nối Backend với Mobile App - Hoàn tất!

## ✅ Tóm tắt những gì đã làm

### 1. Cấu hình API Base URL
✅ Cập nhật `config/index.ts` để sử dụng IP máy tính thay vì localhost
```typescript
API_BASE_URL: __DEV__ ? 'http://10.21.3.234:5000' : 'https://your-production-api.com'
```

### 2. Cập nhật ApiService
✅ ApiService sử dụng config từ file cấu hình
✅ Tự động thêm JWT token vào headers
✅ Tự động refresh token khi hết hạn
✅ Xử lý lỗi một cách thân thiện

### 3. Tạo các API Services
✅ `AuthApiService.ts` - Xử lý authentication (login, register, logout, profile)
✅ `VehicleApiService.ts` - Quản lý vehicles (list, detail, categories, availability)
✅ `BookingApiService.ts` - Quản lý bookings (create, update, cancel, price calculation)
✅ `TestConnectionService.ts` - Kiểm tra kết nối với backend

### 4. Tạo Test Connection Screen
✅ Màn hình test kết nối backend: `app/test-connection.tsx`
✅ Thêm link vào màn hình Features
✅ Có thể test connection và kiểm tra status của các endpoints

### 5. Documentation
✅ `MOBILE_BACKEND_CONNECTION.md` - Hướng dẫn chi tiết về kết nối
✅ Troubleshooting guide
✅ API usage examples

## 🎯 Cách sử dụng

### Khởi động Backend
```bash
cd backend
dotnet run
```
Backend chạy tại: http://localhost:5000

### Khởi động Mobile App
```bash
cd carRentMobile
npx expo start
```

### Test kết nối
1. Mở mobile app
2. Vào tab "Features" 
3. Click "Test Backend Connection"
4. Click "Test Connection" để kiểm tra

## 📱 Các cách chạy app

### 1. Trên điện thoại thật (khuyến nghị)
- Tải Expo Go từ App Store/Play Store
- Quét QR code từ terminal
- App sẽ kết nối đến backend qua IP: 10.21.3.234:5000

### 2. Trên iOS Simulator
```bash
# Trong terminal Expo, nhấn: i
```

### 3. Trên Android Emulator
```bash
# Trong terminal Expo, nhấn: a
```

### 4. Trên web browser
```bash
# Trong terminal Expo, nhấn: w
# Hoặc truy cập: http://localhost:8081
```

## 🔧 Cấu hình quan trọng

### Backend CORS (Program.cs)
```csharp
// Đã cấu hình cho phép mọi origin trong development
policy.AllowAnyOrigin()
      .AllowAnyHeader()
      .AllowAnyMethod();
```

### Mobile API Config (config/index.ts)
```typescript
API_BASE_URL: 'http://10.21.3.234:5000'  // IP máy tính
API_TIMEOUT: 10000
TOKEN_STORAGE_KEY: 'accessToken'
REFRESH_TOKEN_STORAGE_KEY: 'refreshToken'
```

## 📝 Sử dụng API Services

### Authentication
```typescript
import { AuthApiService } from '@/services';

// Đăng nhập
const result = await AuthApiService.login('user@example.com', 'password');
// Token tự động được lưu trong SecureStore

// Đăng ký
const result = await AuthApiService.register({
  email: 'user@example.com',
  password: 'password',
  fullName: 'User Name',
  phoneNumber: '0123456789'
});

// Lấy thông tin user hiện tại
const user = await AuthApiService.getCurrentUser();

// Đăng xuất
await AuthApiService.logout();
```

### Vehicles
```typescript
import { VehicleApiService } from '@/services';

// Lấy tất cả xe
const vehicles = await VehicleApiService.getVehicles();

// Lấy xe theo ID
const vehicle = await VehicleApiService.getVehicleById(1);

// Lấy xe với filter
const vehicles = await VehicleApiService.getVehicles({
  search: 'Toyota',
  minPrice: 500000,
  maxPrice: 1000000,
  categoryId: 1
});

// Kiểm tra xe có sẵn
const available = await VehicleApiService.checkAvailability(
  1, 
  '2025-11-15', 
  '2025-11-20'
);
```

### Bookings
```typescript
import { BookingApiService } from '@/services';

// Tạo booking mới
const booking = await BookingApiService.createBooking({
  vehicleId: 1,
  startDate: '2025-11-15',
  endDate: '2025-11-20',
  pickupLocation: 'Ho Chi Minh City',
  dropoffLocation: 'Ha Noi'
});

// Lấy bookings của user
const myBookings = await BookingApiService.getMyBookings();

// Tính giá booking
const price = await BookingApiService.calculatePrice(
  1,
  '2025-11-15',
  '2025-11-20'
);

// Hủy booking
await BookingApiService.cancelBooking(1, 'Change of plans');
```

## 🔍 Troubleshooting

### App không kết nối được backend?
**Checklist:**
- [ ] Backend đang chạy trên port 5000?
- [ ] Điện thoại và máy tính cùng mạng WiFi?
- [ ] IP trong config đúng (10.21.3.234)?
- [ ] Firewall không chặn port 5000?
- [ ] Đã reload app sau khi thay đổi config?

### Lỗi "Network Error"?
```bash
# Kiểm tra IP máy tính
ipconfig getifaddr en0   # Mac
ipconfig                 # Windows

# Cập nhật IP trong config/index.ts nếu khác
API_BASE_URL: 'http://[YOUR_IP]:5000'

# Restart Expo
# Trong terminal, nhấn: r
```

### Backend trả về 401 Unauthorized?
- Token đã hết hạn → Đăng nhập lại
- Token không hợp lệ → Clear storage và đăng nhập lại
- API Service tự động refresh token nếu có refreshToken

### Backend trả về 500 Internal Server Error?
- Kiểm tra logs của backend
- Có thể do database chưa chạy (SQL Server)
- Kiểm tra data gửi lên có đúng format không

## 🎉 Kết quả

✅ Mobile app có thể kết nối đến backend API
✅ JWT authentication hoạt động tự động
✅ Refresh token tự động khi hết hạn
✅ Có thể gọi tất cả endpoints của backend
✅ Error handling thân thiện với người dùng
✅ Test connection screen để troubleshoot

## 📚 Files đã tạo/sửa

### Created:
1. `carRentMobile/services/TestConnectionService.ts`
2. `carRentMobile/services/AuthApiService.ts`
3. `carRentMobile/services/VehicleApiService.ts`
4. `carRentMobile/services/BookingApiService.ts`
5. `carRentMobile/services/index.ts`
6. `carRentMobile/app/test-connection.tsx`
7. `MOBILE_BACKEND_CONNECTION.md`
8. `MOBILE_BACKEND_SETUP_COMPLETE.md` (this file)

### Modified:
1. `carRentMobile/config/index.ts` - Cập nhật API_BASE_URL
2. `carRentMobile/services/ApiService.ts` - Sử dụng config
3. `carRentMobile/app/features.tsx` - Thêm test connection link

## 🚀 Next Steps

### Tích hợp vào các màn hình hiện có:
1. Màn hình Login → Sử dụng `AuthApiService.login()`
2. Màn hình Register → Sử dụng `AuthApiService.register()`
3. Màn hình Vehicles → Sử dụng `VehicleApiService.getVehicles()`
4. Màn hình Booking → Sử dụng `BookingApiService.createBooking()`

### Ví dụ tích hợp Login:
```typescript
// app/(auth)/login.tsx
import { AuthApiService } from '@/services';
import * as SecureStore from 'expo-secure-store';

const handleLogin = async () => {
  try {
    setLoading(true);
    const response = await AuthApiService.login(email, password);
    
    // Save tokens
    await SecureStore.setItemAsync('accessToken', response.data.token);
    await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
    
    // Navigate to home
    router.replace('/(tabs)');
  } catch (error: any) {
    Alert.alert('Login Failed', error.message);
  } finally {
    setLoading(false);
  }
};
```

## 📞 Support

Nếu cần hỗ trợ thêm:
1. Đọc `MOBILE_BACKEND_CONNECTION.md` cho chi tiết
2. Check logs trong terminal (backend + mobile)
3. Sử dụng Test Connection screen để diagnose

---

**Status**: ✅ HOÀN TẤT - Mobile app đã sẵn sàng kết nối với backend!
