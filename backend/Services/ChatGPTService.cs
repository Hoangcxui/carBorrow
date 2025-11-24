using backend.DTOs;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.Services
{
    /// <summary>
    /// Service for integrating with OpenAI ChatGPT API
    /// </summary>
    public class ChatGPTService : IChatGPTService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ChatGPTService> _logger;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly string _systemPrompt;

        public ChatGPTService(
            HttpClient httpClient,
            IConfiguration configuration,
            IMemoryCache cache,
            ILogger<ChatGPTService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _cache = cache;
            _logger = logger;

            // Get API key from configuration
            _apiKey = _configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI API key not configured");
            _model = _configuration["OpenAI:Model"] ?? "gpt-3.5-turbo";
            _systemPrompt = _configuration["OpenAI:SystemPrompt"] ?? 
                "You are a helpful assistant for a car rental system. Help users with questions about renting cars, booking, payments, and general inquiries.";

            // Configure HttpClient
            _httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        /// <inheritdoc/>
        public async Task<ChatMessageResponseDto> SendMessageAsync(ChatMessageRequestDto request)
        {
            try
            {
                // Generate or use existing conversation ID
                var conversationId = request.ConversationId ?? Guid.NewGuid().ToString();

                // Get conversation history from cache
                var conversation = await GetConversationHistoryAsync(conversationId);
                var messages = conversation?.Messages ?? new List<ChatHistoryDto>();

                // Add user message to history
                messages.Add(new ChatHistoryDto
                {
                    Role = "user",
                    Content = request.Message,
                    Timestamp = DateTime.UtcNow
                });

                // Prepare OpenAI API request
                var chatRequest = new
                {
                    model = _model,
                    messages = new List<object>
                    {
                        new { role = "system", content = _systemPrompt }
                    }.Concat(messages.Select(m => new { role = m.Role, content = m.Content })).ToList(),
                    temperature = 0.7,
                    max_tokens = 1000
                };

                var jsonContent = JsonSerializer.Serialize(chatRequest);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // Send request to OpenAI
                var response = await _httpClient.PostAsync("chat/completions", content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var chatResponse = JsonSerializer.Deserialize<OpenAIChatResponse>(responseContent);

                if (chatResponse?.Choices == null || chatResponse.Choices.Count == 0)
                {
                    throw new Exception("No response from OpenAI API");
                }

                var assistantMessage = chatResponse.Choices[0].Message.Content;

                // Add assistant response to history
                messages.Add(new ChatHistoryDto
                {
                    Role = "assistant",
                    Content = assistantMessage,
                    Timestamp = DateTime.UtcNow
                });

                // Update conversation in cache
                var updatedConversation = new ConversationDto
                {
                    ConversationId = conversationId,
                    UserId = request.UserId,
                    Messages = messages,
                    CreatedAt = conversation?.CreatedAt ?? DateTime.UtcNow
                };

                _cache.Set($"conversation_{conversationId}", updatedConversation, TimeSpan.FromHours(24));

                // Store user conversations index
                if (!string.IsNullOrEmpty(request.UserId))
                {
                    var userConversations = _cache.Get<List<string>>($"user_conversations_{request.UserId}") ?? new List<string>();
                    if (!userConversations.Contains(conversationId))
                    {
                        userConversations.Add(conversationId);
                        _cache.Set($"user_conversations_{request.UserId}", userConversations, TimeSpan.FromDays(7));
                    }
                }

                return new ChatMessageResponseDto
                {
                    Response = assistantMessage,
                    ConversationId = conversationId,
                    Timestamp = DateTime.UtcNow,
                    TokensUsed = chatResponse.Usage?.TotalTokens
                };
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error calling OpenAI API");
                throw new Exception("Failed to communicate with AI service", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat message");
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<ConversationDto?> GetConversationHistoryAsync(string conversationId)
        {
            return await Task.FromResult(_cache.Get<ConversationDto>($"conversation_{conversationId}"));
        }

        /// <inheritdoc/>
        public async Task ClearConversationAsync(string conversationId)
        {
            _cache.Remove($"conversation_{conversationId}");
            await Task.CompletedTask;
        }

        /// <inheritdoc/>
        public async Task<List<ConversationDto>> GetUserConversationsAsync(string userId)
        {
            var conversationIds = _cache.Get<List<string>>($"user_conversations_{userId}") ?? new List<string>();
            var conversations = new List<ConversationDto>();

            foreach (var conversationId in conversationIds)
            {
                var conversation = await GetConversationHistoryAsync(conversationId);
                if (conversation != null)
                {
                    conversations.Add(conversation);
                }
            }

            return conversations.OrderByDescending(c => c.CreatedAt).ToList();
        }

        #region OpenAI API Response Models

        private class OpenAIChatResponse
        {
            [JsonPropertyName("id")]
            public string Id { get; set; } = string.Empty;

            [JsonPropertyName("choices")]
            public List<Choice> Choices { get; set; } = new();

            [JsonPropertyName("usage")]
            public Usage? Usage { get; set; }
        }

        private class Choice
        {
            [JsonPropertyName("message")]
            public Message Message { get; set; } = new();

            [JsonPropertyName("finish_reason")]
            public string FinishReason { get; set; } = string.Empty;
        }

        private class Message
        {
            [JsonPropertyName("role")]
            public string Role { get; set; } = string.Empty;

            [JsonPropertyName("content")]
            public string Content { get; set; } = string.Empty;
        }

        private class Usage
        {
            [JsonPropertyName("prompt_tokens")]
            public int PromptTokens { get; set; }

            [JsonPropertyName("completion_tokens")]
            public int CompletionTokens { get; set; }

            [JsonPropertyName("total_tokens")]
            public int TotalTokens { get; set; }
        }

        #endregion
    }
}
