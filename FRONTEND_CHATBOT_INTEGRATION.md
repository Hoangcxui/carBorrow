# Tích hợp Chatbot vào Frontend (Next.js/React)

## 📦 Cách sử dụng

### 1. Copy component

Component `Chatbot.tsx` đã được tạo tại:
```
car-rent-frontend/src/components/Chatbot.tsx
```

### 2. Import và sử dụng

Trong `app/layout.tsx` hoặc bất kỳ page nào:

```tsx
import Chatbot from '@/components/Chatbot';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Chatbot 
          apiBaseUrl="http://localhost:5000/api"
          userId={session?.user?.id} // Optional: nếu có user authentication
        />
      </body>
    </html>
  );
}
```

### 3. Hoặc thêm vào specific page

```tsx
// app/page.tsx
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <main>
      <h1>Welcome to CarBorrow</h1>
      {/* Your content */}
      
      <Chatbot />
    </main>
  );
}
```

## 🎨 Tính năng

- ✅ Floating chat button ở góc dưới phải
- ✅ Click để mở/đóng chat window
- ✅ Typing indicator khi AI đang trả lời
- ✅ Chat history được lưu
- ✅ Responsive design với Tailwind CSS
- ✅ Smooth animations
- ✅ Clear chat button
- ✅ Timestamp cho mỗi message

## ⚙️ Props

```typescript
interface ChatbotProps {
  apiBaseUrl?: string;  // Default: 'http://localhost:5000/api'
  userId?: string;      // Optional: User ID cho personalization
}
```

## 🎨 Customization

### Thay đổi màu sắc:

Tìm và thay thế các class Tailwind:
```tsx
// Gradient chính
from-purple-600 to-indigo-600  →  from-blue-600 to-cyan-600

// Button màu
bg-gradient-to-r from-purple-600  →  bg-gradient-to-r from-green-600
```

### Thay đổi vị trí:

```tsx
// Từ bottom-right sang bottom-left
className="fixed bottom-6 right-6"  →  className="fixed bottom-6 left-6"
```

### Thay đổi kích thước:

```tsx
// Window size
className="w-96 h-[600px]"  →  className="w-full max-w-md h-[700px]"
```

## 🔧 Development Setup

### Cài đặt dependencies (nếu cần):

```bash
cd car-rent-frontend
npm install
# hoặc
yarn install
```

### Chạy development server:

```bash
npm run dev
```

Truy cập: `http://localhost:3000`

## 🌐 Production Setup

### Environment Variables:

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
```

Sử dụng trong component:

```tsx
<Chatbot 
  apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
  userId={user?.id}
/>
```

## 🔒 Authentication Integration

Nếu bạn có authentication system:

```tsx
'use client';

import { useSession } from 'next-auth/react'; // hoặc auth library khác
import Chatbot from '@/components/Chatbot';

export default function ChatbotWrapper() {
  const { data: session } = useSession();
  
  return (
    <Chatbot 
      apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
      userId={session?.user?.id}
    />
  );
}
```

## 📱 Mobile Responsive

Component đã responsive mặc định. Trên mobile:
- Chatbot button tự động điều chỉnh kích thước
- Chat window full width trên màn hình nhỏ
- Touch-friendly buttons

### Tuỳ chỉnh mobile:

```tsx
// Thêm responsive classes
className="fixed bottom-6 right-6 w-96 md:w-full md:max-w-md h-[600px]"
```

## 🎯 Advanced Features

### 1. Load conversation history:

```tsx
const loadConversation = async (conversationId: string) => {
  const response = await fetch(`${apiBaseUrl}/chat/conversation/${conversationId}`);
  const data = await response.json();
  setMessages(data.messages);
};
```

### 2. File upload (future enhancement):

```tsx
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  // Send to backend...
};
```

### 3. Voice input (future enhancement):

```tsx
const startVoiceRecording = () => {
  // Web Speech API implementation
};
```

## 🐛 Troubleshooting

### Chatbot không hiển thị:

1. Check browser console for errors
2. Verify component import path
3. Ensure Tailwind CSS is configured

### CORS errors:

Backend `Program.cs` phải có:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### Styling không đúng:

Đảm bảo Tailwind CSS đã được setup trong `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
```

## 📊 Analytics (Optional)

Thêm tracking:

```tsx
const sendMessage = async () => {
  // ... existing code ...
  
  // Track event
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'chat_message_sent', {
      message_length: input.length,
    });
  }
};
```

## 🚀 Next Steps

1. ✅ Test chatbot trên development
2. 🎨 Customize styling theo brand
3. 🔐 Integrate với authentication
4. 📊 Add analytics tracking
5. 🌍 Deploy to production

---

**Support:** Nếu gặp vấn đề, check console logs và backend API health endpoint
