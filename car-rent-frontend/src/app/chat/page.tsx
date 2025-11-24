'use client';

import React, { useState } from 'react';
import ChatBox from '@/components/ChatBox';

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | undefined>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
            {/* Header */}
            <div className="bg-blue-500 text-white px-6 py-4 flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <div>
                <h1 className="text-xl font-bold">AI Assistant</h1>
                <p className="text-sm text-blue-100">Powered by ChatGPT</p>
              </div>
            </div>

            {/* Chat Box */}
            <div style={{ height: 'calc(100% - 80px)' }}>
              <ChatBox
                conversationId={conversationId}
                onConversationIdChange={setConversationId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
