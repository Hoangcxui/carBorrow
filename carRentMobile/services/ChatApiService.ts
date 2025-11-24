import ApiService from './ApiService';

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface ChatMessageResponse {
  response: string;
  conversationId: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface Conversation {
  conversationId: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ChatApiService {
  /**
   * Send a message to the chatbot
   * @param request Chat message request
   * @returns Chat response from AI
   */
  async sendMessage(request: ChatMessageRequest): Promise<ApiResponse<ChatMessageResponse>> {
    try {
      const response = await ApiService.post<ChatMessageResponse>('/chat/message', request);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error('Send message error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send message',
      };
    }
  }

  /**
   * Get conversation history
   * @param conversationId Conversation ID
   * @returns Conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ApiResponse<Conversation>> {
    try {
      const response = await ApiService.get<Conversation>(`/chat/conversation/${conversationId}`);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error('Get conversation history error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get conversation',
      };
    }
  }

  /**
   * Start a new conversation
   * @returns New conversation ID
   */
  async startNewConversation(): Promise<string> {
    // Generate a unique conversation ID
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new ChatApiService();
