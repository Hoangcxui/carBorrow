# CarBorrow ChatGPT Integration - Quick Start Guide

## 🚀 Hướng dẫn nhanh

### Bước 1: Cài đặt OpenAI API Key

1. Truy cập: https://platform.openai.com/
2. Đăng nhập hoặc đăng ký tài khoản
3. Vào **API Keys** → **Create new secret key**
4. Copy API key vừa tạo

### Bước 2: Cấu hình Backend

Mở file `backend/appsettings.json` và thay thế `YOUR_OPENAI_API_KEY_HERE`:

```json
"OpenAI": {
  "ApiKey": "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "Model": "gpt-3.5-turbo",
  "SystemPrompt": "..."
}
```

**Lưu ý:** Không commit API key vào Git!

### Bước 3: Khởi động Backend

```bash
cd backend
dotnet restore
dotnet run
```

Đợi backend khởi động thành công. Bạn sẽ thấy:
```
Now listening on: http://localhost:5000
```

### Bước 4: Mở Chatbot

Mở trình duyệt và truy cập:
```
http://localhost:5000/chatbot.html
```

### Bước 5: Test Chatbot

Thử các câu hỏi sau:
- "Xin chào, tôi muốn thuê xe"
- "Có xe 7 chỗ nào không?"
- "Giá thuê xe trong 3 ngày là bao nhiêu?"

## 📱 Test API trực tiếp

### Sử dụng cURL:

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tôi muốn thuê xe cho cuối tuần"
  }'
```

### Sử dụng Swagger UI:

1. Truy cập: http://localhost:5000/swagger
2. Tìm **ChatController**
3. Expand **/api/chat/message**
4. Click **Try it out**
5. Nhập message và click **Execute**

## ✅ Kiểm tra

### Health Check:
```bash
curl http://localhost:5000/api/chat/health
```

Kết quả mong đợi:
```json
{
  "status": "healthy",
  "service": "ChatGPT Integration",
  "timestamp": "2025-11-12T..."
}
```

## 🎨 Giao diện Chatbox

Chatbox có:
- ✅ Design hiện đại với gradient
- ✅ Typing indicator
- ✅ Chat history
- ✅ Clear chat button
- ✅ Responsive

## ⚙️ Tuỳ chỉnh

### Thay đổi model AI:

Trong `appsettings.json`:
```json
"Model": "gpt-4"  // Hoặc "gpt-3.5-turbo"
```

### Tuỳ chỉnh system prompt:

Trong `appsettings.json`, chỉnh `SystemPrompt` để chatbot có personality khác:
```json
"SystemPrompt": "Bạn là chuyên gia tư vấn cho thuê xe..."
```

### Thay đổi API base URL trong chatbot.html:

Mở `backend/wwwroot/chatbot.html`, tìm dòng:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Đổi thành URL backend của bạn.

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "OpenAI API key not configured"
→ Chưa cấu hình API key trong appsettings.json

### Lỗi: "Unauthorized" từ OpenAI
→ API key sai hoặc hết hạn, kiểm tra lại

### Lỗi: CORS
→ Kiểm tra CORS policy trong Program.cs

### Chatbot không hiển thị
→ Đảm bảo wwwroot/chatbot.html tồn tại và UseStaticFiles() đã được enable

## 📊 Chi phí dự kiến

**GPT-3.5-turbo:**
- ~$0.002 / 1,000 tokens
- 1 cuộc hội thoại trung bình: ~500 tokens
- Chi phí: ~$0.001 / cuộc hội thoại

**GPT-4:**
- ~$0.03 / 1,000 tokens  
- Đắt hơn ~15 lần GPT-3.5

→ Khuyến nghị dùng GPT-3.5-turbo cho development

## 📚 Tài liệu đầy đủ

Xem file `CHATBOT_README.md` để biết thêm chi tiết về:
- API endpoints đầy đủ
- Tích hợp với frontend
- Security best practices
- Deployment guide
- Troubleshooting

## 🎯 Next Steps

1. ✅ Test chatbot cơ bản
2. ✅ Đọc full documentation
3. ⚡ Tích hợp vào frontend React/Next.js
4. 🔒 Setup environment variables cho production
5. 📊 Monitor usage và chi phí

---

**Hỗ trợ:** Nếu gặp vấn đề, check logs tại `backend/logs/` hoặc xem Swagger UI tại `/swagger`
