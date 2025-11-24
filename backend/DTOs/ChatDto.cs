namespace backend.DTOs
{
    /// <summary>
    /// DTO for chat message request
    /// </summary>
    public class ChatMessageRequestDto
    {
        /// <summary>
        /// User's message to the chatbot
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Optional conversation ID to maintain context
        /// </summary>
        public string? ConversationId { get; set; }

        /// <summary>
        /// Optional user ID for personalized responses
        /// </summary>
        public string? UserId { get; set; }
    }

    /// <summary>
    /// DTO for chat message response
    /// </summary>
    public class ChatMessageResponseDto
    {
        /// <summary>
        /// AI's response message
        /// </summary>
        public string Response { get; set; } = string.Empty;

        /// <summary>
        /// Conversation ID for context maintenance
        /// </summary>
        public string ConversationId { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp of the response
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Tokens used in the request
        /// </summary>
        public int? TokensUsed { get; set; }
    }

    /// <summary>
    /// DTO for chat history
    /// </summary>
    public class ChatHistoryDto
    {
        /// <summary>
        /// Message content
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// Role (user or assistant)
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp of the message
        /// </summary>
        public DateTime Timestamp { get; set; }
    }

    /// <summary>
    /// DTO for conversation summary
    /// </summary>
    public class ConversationDto
    {
        /// <summary>
        /// Conversation ID
        /// </summary>
        public string ConversationId { get; set; } = string.Empty;

        /// <summary>
        /// User ID
        /// </summary>
        public string? UserId { get; set; }

        /// <summary>
        /// Chat messages in the conversation
        /// </summary>
        public List<ChatHistoryDto> Messages { get; set; } = new List<ChatHistoryDto>();

        /// <summary>
        /// When the conversation started
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}
