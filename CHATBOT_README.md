# ChatGPT Integration - CarBorrow Chatbot

## 📋 Tổng quan

Dự án CarBorrow đã được tích hợp chatbot AI sử dụng OpenAI ChatGPT API. Chatbot có thể hỗ trợ khách hàng với các câu hỏi về thuê xe, đặt xe, thanh toán và các thông tin liên quan.

## 🚀 Tính năng

- ✅ Trò chuyện thời gian thực với AI
- ✅ Lưu trữ lịch sử hội thoại (24 giờ trong memory cache)
- ✅ Hỗ trợ nhiều cuộc hội thoại đồng thời
- ✅ Tích hợp với hệ thống xác thực người dùng
- ✅ API RESTful đầy đủ
- ✅ Giao diện chatbox đẹp mắt
- ✅ Responsive design

## 📁 Cấu trúc file mới

```
backend/
├── Controllers/
│   └── ChatController.cs          # API endpoints cho chatbot
├── Services/
│   ├── IChatGPTService.cs         # Interface
│   └── ChatGPTService.cs          # Service tích hợp OpenAI
├── DTOs/
│   └── ChatDto.cs                 # Data Transfer Objects
└── wwwroot/
    └── chatbot.html               # Giao diện chatbox
```

## 🔧 Cài đặt

### 1. Cấu hình OpenAI API Key

Cập nhật file `appsettings.json`:

```json
{
  "OpenAI": {
    "ApiKey": "YOUR_OPENAI_API_KEY_HERE",
    "Model": "gpt-3.5-turbo",
    "SystemPrompt": "You are a helpful AI assistant for a car rental system..."
  }
}
```

### 2. Lấy API Key từ OpenAI

1. Đăng ký tài khoản tại: https://platform.openai.com/
2. Vào **API Keys** section
3. Tạo API key mới
4. Copy và paste vào `appsettings.json`

### 3. Khởi động Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

Backend sẽ chạy tại: `http://localhost:5000`

### 4. Mở Chatbot

Truy cập: `http://localhost:5000/chatbot.html`

## 📡 API Endpoints

### 1. Gửi tin nhắn

```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "Tôi muốn thuê xe cho chuyến đi cuối tuần",
  "conversationId": "optional-conversation-id",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "response": "Tôi có thể giúp bạn tìm xe phù hợp...",
  "conversationId": "abc-123-def-456",
  "timestamp": "2025-11-12T10:30:00Z",
  "tokensUsed": 150
}
```

### 2. Lấy lịch sử hội thoại

```http
GET /api/chat/conversation/{conversationId}
```

### 3. Xóa hội thoại

```http
DELETE /api/chat/conversation/{conversationId}
```

### 4. Lấy tất cả hội thoại của user (yêu cầu xác thực)

```http
GET /api/chat/user/{userId}/conversations
Authorization: Bearer {token}
```

### 5. Health check

```http
GET /api/chat/health
```

## 🎨 Giao diện Chatbox

Chatbox có các tính năng:
- Design hiện đại với gradient màu đẹp mắt
- Hiển thị trạng thái online
- Typing indicator khi AI đang trả lời
- Timestamp cho mỗi tin nhắn
- Nút xóa lịch sử trò chuyện
- Responsive trên mọi thiết bị

## 🔒 Bảo mật

- API key được lưu trong appsettings.json (không commit vào git)
- Sử dụng HTTPS trong production
- Rate limiting middleware đã được cấu hình
- JWT authentication cho các endpoint cần bảo vệ

## 💡 Sử dụng

### Ví dụ câu hỏi:

1. "Tôi muốn thuê xe 7 chỗ cho chuyến đi gia đình"
2. "Giá thuê xe trong 3 ngày là bao nhiêu?"
3. "Có xe tự động nào không?"
4. "Quy trình đặt xe như thế nào?"
5. "Tôi cần giấy tờ gì để thuê xe?"

## 🧪 Testing

### Test API với cURL:

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Xin chào, tôi cần thuê xe"
  }'
```

### Test với Postman:

1. Import collection từ Swagger: `http://localhost:5000/swagger`
2. Test các endpoints trong ChatController

## 📊 Giám sát

- Logs được ghi vào `logs/log-{date}.txt`
- Sử dụng Serilog để tracking
- Monitor token usage từ response

## 🔄 Tích hợp với Frontend

### React/Next.js Example:

```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('http://localhost:5000/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversationId: localStorage.getItem('conversationId'),
      userId: currentUser?.id
    })
  });
  
  const data = await response.json();
  localStorage.setItem('conversationId', data.conversationId);
  return data;
};
```

## 💰 Chi phí

OpenAI API có tính phí:
- GPT-3.5-turbo: ~$0.002 / 1K tokens
- GPT-4: ~$0.03 / 1K tokens

Monitor usage tại: https://platform.openai.com/usage

## 🐛 Troubleshooting

### Lỗi "Unauthorized" từ OpenAI:
- Kiểm tra API key có đúng không
- Đảm bảo tài khoản OpenAI có credit

### Lỗi CORS:
- Kiểm tra CORS policy trong Program.cs
- Đảm bảo frontend origin được allow

### Chatbot không phản hồi:
- Kiểm tra backend logs
- Verify API endpoint đang hoạt động
- Test với Swagger UI

## 📚 Tài liệu tham khảo

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [HttpClient Best Practices](https://docs.microsoft.com/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests)

## 🎯 Roadmap

- [ ] Streaming responses (real-time typing)
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Integration with vehicle database for real-time availability
- [ ] Sentiment analysis
- [ ] Persistent storage (database) cho chat history
- [ ] Rate limiting per user
- [ ] Analytics dashboard

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng:
1. Kiểm tra logs trong thư mục `logs/`
2. Xem Swagger documentation tại `/swagger`
3. Liên hệ team support

---

**Lưu ý:** Đảm bảo không commit API key vào Git. Sử dụng environment variables hoặc Azure Key Vault trong production.
