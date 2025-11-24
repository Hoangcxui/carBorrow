# ChatGPT Integration Guide

## 📱 Mobile App (React Native + Expo)

### Files Created:
1. **services/ChatApiService.ts** - API service để gọi ChatGPT backend
2. **components/ChatBox.tsx** - Chat UI component với bubble messages
3. **app/(tabs)/chat.tsx** - Chat screen trong tab navigation
4. **app/(tabs)/_layout.tsx** - Updated để thêm Chat tab

### Features:
- ✅ Real-time chat với ChatGPT
- ✅ Conversation history
- ✅ Message bubbles (user vs AI)
- ✅ Loading indicator
- ✅ Auto-scroll to bottom
- ✅ Keyboard avoiding view
- ✅ Character limit (500)
- ✅ Enter to send

### Usage:
```typescript
import ChatBox from '@/components/ChatBox';

<ChatBox 
  conversationId={conversationId}
  onConversationIdChange={setConversationId}
/>
```

### Access:
- Mở mobile app → Tab "AI Chat" (icon message)

---

## 🌐 Web Frontend (Next.js + TypeScript)

### Files Created:
1. **src/lib/chat.ts** - Chat API client
2. **src/components/ChatBox.tsx** - Chat UI component với Tailwind CSS
3. **src/app/chat/page.tsx** - Chat page

### Features:
- ✅ Real-time chat với ChatGPT
- ✅ Conversation management
- ✅ Beautiful UI với Tailwind CSS
- ✅ Typing indicator (animated dots)
- ✅ Auto-scroll
- ✅ Enter to send, Shift+Enter for new line
- ✅ Error handling với toast notifications

### Usage:
```tsx
import ChatBox from '@/components/ChatBox';

<ChatBox 
  conversationId={conversationId}
  onConversationIdChange={setConversationId}
/>
```

### Access:
- Truy cập: `http://localhost:3000/chat`

---

## 🔧 Backend API (ASP.NET Core)

### Endpoints:
- `POST /api/chat/message` - Send message to ChatGPT
- `GET /api/chat/conversation/{id}` - Get conversation history

### DTOs:
```csharp
// Request
public class ChatMessageRequestDto {
    public string Message { get; set; }
    public string? ConversationId { get; set; }
    public string? UserId { get; set; }
}

// Response
public class ChatMessageResponseDto {
    public string Response { get; set; }
    public string ConversationId { get; set; }
    public DateTime Timestamp { get; set; }
    public int? TokensUsed { get; set; }
}
```

### Configuration (appsettings.json):
```json
{
  "OpenAI": {
    "ApiKey": "your-api-key",
    "Model": "gpt-3.5-turbo",
    "SystemPrompt": "You are a helpful AI assistant for CarBorrow..."
  }
}
```

---

## 🎨 UI Design

### Mobile (React Native):
- iOS/Android native feel
- Blue user messages (#007AFF)
- White AI messages with shadow
- Rounded corners với speech bubble style
- Timestamp dưới mỗi message

### Web (Tailwind CSS):
- Modern, clean design
- Blue user messages (bg-blue-500)
- White AI messages with shadow
- Smooth animations
- Responsive layout

---

## 🚀 Testing

### Mobile:
1. Chạy backend: `cd backend && dotnet run`
2. Chạy mobile: `cd carRentMobile && npx expo start`
3. Mở app → Tab "AI Chat"
4. Gửi tin nhắn test

### Web:
1. Chạy backend: `cd backend && dotnet run`
2. Chạy frontend: `cd car-rent-frontend && npm run dev`
3. Truy cập: `http://localhost:3000/chat`
4. Gửi tin nhắn test

---

## 📝 Example Conversations

**User:** "How do I rent a car?"
**AI:** "To rent a car with CarBorrow, follow these steps: 1. Browse available vehicles..."

**User:** "What payment methods do you accept?"
**AI:** "We accept multiple payment methods including credit cards, VNPay, and bank transfers..."

---

## 🔒 Security

- ✅ JWT authentication (optional)
- ✅ API key stored in backend (not exposed to client)
- ✅ Rate limiting on backend
- ✅ Input validation (max 500 characters)
- ✅ XSS protection

---

## 🎯 Next Steps

1. ✅ Add user authentication để track conversations per user
2. ✅ Implement conversation list/history view
3. ✅ Add file upload support (images)
4. ✅ Voice input/output
5. ✅ Multi-language support
6. ✅ Analytics & monitoring

---

## �� Support

Nếu có vấn đề, check:
1. Backend có đang chạy không? (http://localhost:5000)
2. OpenAI API key có hợp lệ không?
3. CORS có được cấu hình đúng không?
4. Network connection có ổn không?

**API Base URLs:**
- Mobile (device): `http://10.21.3.234:5000`
- Mobile (web): `http://localhost:5000`
- Web: `http://localhost:5000`

---

Happy Chatting! 🎉
