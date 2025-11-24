using backend.DTOs;

namespace backend.Services
{
    /// <summary>
    /// Interface for ChatGPT service
    /// </summary>
    public interface IChatGPTService
    {
        /// <summary>
        /// Send a message to ChatGPT and get a response
        /// </summary>
        /// <param name="request">Chat message request</param>
        /// <returns>Chat response from AI</returns>
        Task<ChatMessageResponseDto> SendMessageAsync(ChatMessageRequestDto request);

        /// <summary>
        /// Get conversation history
        /// </summary>
        /// <param name="conversationId">Conversation ID</param>
        /// <returns>Conversation history</returns>
        Task<ConversationDto?> GetConversationHistoryAsync(string conversationId);

        /// <summary>
        /// Clear conversation history
        /// </summary>
        /// <param name="conversationId">Conversation ID</param>
        Task ClearConversationAsync(string conversationId);

        /// <summary>
        /// Get all conversations for a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>List of conversations</returns>
        Task<List<ConversationDto>> GetUserConversationsAsync(string userId);
    }
}
