using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for AI chatbot functionality
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatGPTService _chatGPTService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IChatGPTService chatGPTService, ILogger<ChatController> logger)
        {
            _chatGPTService = chatGPTService;
            _logger = logger;
        }

        /// <summary>
        /// Send a message to the AI chatbot
        /// </summary>
        /// <param name="request">Chat message request</param>
        /// <returns>AI response</returns>
        /// <response code="200">Returns the AI response</response>
        /// <response code="400">If the request is invalid</response>
        /// <response code="500">If there's an error processing the message</response>
        [HttpPost("message")]
        [ProducesResponseType(typeof(ChatMessageResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequestDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Message))
                {
                    return BadRequest(new { error = "Message cannot be empty" });
                }

                _logger.LogInformation("Processing chat message for conversation: {ConversationId}", 
                    request.ConversationId ?? "new");

                var response = await _chatGPTService.SendMessageAsync(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat message");
                return StatusCode(500, new { error = "Failed to process your message. Please try again." });
            }
        }

        /// <summary>
        /// Get conversation history
        /// </summary>
        /// <param name="conversationId">Conversation ID</param>
        /// <returns>Conversation history</returns>
        /// <response code="200">Returns the conversation history</response>
        /// <response code="404">If conversation not found</response>
        [HttpGet("conversation/{conversationId}")]
        [ProducesResponseType(typeof(ConversationDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetConversation(string conversationId)
        {
            try
            {
                var conversation = await _chatGPTService.GetConversationHistoryAsync(conversationId);

                if (conversation == null)
                {
                    return NotFound(new { error = "Conversation not found" });
                }

                return Ok(conversation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving conversation: {ConversationId}", conversationId);
                return StatusCode(500, new { error = "Failed to retrieve conversation" });
            }
        }

        /// <summary>
        /// Clear conversation history
        /// </summary>
        /// <param name="conversationId">Conversation ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Conversation cleared successfully</response>
        [HttpDelete("conversation/{conversationId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ClearConversation(string conversationId)
        {
            try
            {
                await _chatGPTService.ClearConversationAsync(conversationId);
                return Ok(new { message = "Conversation cleared successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing conversation: {ConversationId}", conversationId);
                return StatusCode(500, new { error = "Failed to clear conversation" });
            }
        }

        /// <summary>
        /// Get all conversations for a user (requires authentication)
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>List of user conversations</returns>
        /// <response code="200">Returns user conversations</response>
        /// <response code="401">If user is not authenticated</response>
        [HttpGet("user/{userId}/conversations")]
        [Authorize]
        [ProducesResponseType(typeof(List<ConversationDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUserConversations(string userId)
        {
            try
            {
                var conversations = await _chatGPTService.GetUserConversationsAsync(userId);
                return Ok(conversations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user conversations: {UserId}", userId);
                return StatusCode(500, new { error = "Failed to retrieve conversations" });
            }
        }

        /// <summary>
        /// Health check for chat service
        /// </summary>
        /// <returns>Service status</returns>
        [HttpGet("health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult HealthCheck()
        {
            return Ok(new 
            { 
                status = "healthy",
                service = "ChatGPT Integration",
                timestamp = DateTime.UtcNow
            });
        }
    }
}
