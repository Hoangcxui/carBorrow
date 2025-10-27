# CarBorrow - Docker Setup

## Yêu cầu
- Docker Desktop (đã cài đặt trên Mac)
- Docker Compose

## Cách chạy toàn bộ hệ thống

### 1. Chạy tất cả services (Database + Backend + Frontend)

```bash
docker-compose up -d
```

### 2. Xem logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem log của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### 3. Kiểm tra services đang chạy

```bash
docker-compose ps
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:1433
  - User: `sa`
  - Password: `YourStrong@Passw0rd`

### 5. Dừng tất cả services

```bash
docker-compose down
```

### 6. Dừng và xóa volumes (xóa dữ liệu database)

```bash
docker-compose down -v
```

### 7. Rebuild images (khi có thay đổi code)

```bash
docker-compose up -d --build
```

## Chạy từng service riêng lẻ

### Chỉ chạy Database:
```bash
docker-compose up -d database
```

### Chạy Database + Backend:
```bash
docker-compose up -d database backend
```

### Chạy tất cả:
```bash
docker-compose up -d
```

## Troubleshooting

### 1. Database không khởi động
```bash
docker-compose logs database
```

### 2. Backend không kết nối được database
- Đợi database khởi động hoàn toàn (khoảng 30-60 giây)
- Kiểm tra healthcheck: `docker-compose ps`

### 3. Frontend không kết nối được backend
- Kiểm tra backend đã chạy: `curl http://localhost:5000`
- Kiểm tra logs: `docker-compose logs backend`

### 4. Port bị chiếm
Nếu port 3000, 5000, hoặc 1433 đã được sử dụng, sửa file `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay 3000 thành port khác
```

## Database Setup

### Khởi tạo database lần đầu:

1. Chờ database khởi động
2. Chạy script tạo database:

```bash
docker exec -it carborrow-db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Passw0rd" \
  -i /docker-entrypoint-initdb.d/CreateDatabase.sql
```

### Truy cập SQL Server:

```bash
docker exec -it carborrow-db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Passw0rd"
```

## Development Mode

Để chạy Frontend ở development mode (hot reload):

1. Sửa file `docker-compose.yml`, thay:
```yaml
frontend:
  build:
    context: ./car-rent-frontend
    dockerfile: Dockerfile.dev  # Thay Dockerfile thành Dockerfile.dev
```

2. Thêm volumes để sync code:
```yaml
frontend:
  volumes:
    - ./car-rent-frontend:/app
    - /app/node_modules
    - /app/.next
```

## Useful Commands

```bash
# Xem resource usage
docker stats

# Xóa tất cả containers và images
docker-compose down --rmi all

# Vào trong container
docker exec -it carborrow-backend sh
docker exec -it carborrow-frontend sh

# Restart service
docker-compose restart backend
```

## Environment Variables

Có thể tạo file `.env` để override các biến môi trường:

```env
# .env
DB_PASSWORD=YourNewPassword123!
BACKEND_PORT=5001
FRONTEND_PORT=3001
```

Sau đó sửa `docker-compose.yml` để sử dụng biến:
```yaml
environment:
  - SA_PASSWORD=${DB_PASSWORD}
ports:
  - "${BACKEND_PORT}:5000"
```
