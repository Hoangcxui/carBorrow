import apiClient from './api';

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

export const chatApi = {
  /**
   * Send a message to the chatbot
   */
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    const { data } = await apiClient.post<ChatMessageResponse>('/chat/message', request);
    return data;
  },

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<Conversation> {
    const { data } = await apiClient.get<Conversation>(`/chat/conversation/${conversationId}`);
    return data;
  },

  /**
   * Start a new conversation
   */
  startNewConversation(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};
