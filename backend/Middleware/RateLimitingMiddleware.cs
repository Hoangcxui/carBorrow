using System.Net;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly ILogger<RateLimitingMiddleware> _logger;

        public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache, ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _cache = cache;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            var rateLimitAttribute = endpoint?.Metadata?.GetMetadata<RateLimitAttribute>();

            if (rateLimitAttribute != null)
            {
                var key = GenerateClientIdKey(context, rateLimitAttribute.Policy);
                var clientStatistics = GetClientStatistics(key);

                if (clientStatistics.IsExceeded(rateLimitAttribute.Limit, rateLimitAttribute.Window))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    await context.Response.WriteAsync("Rate limit exceeded. Try again later.");
                    
                    _logger.LogWarning("Rate limit exceeded for {ClientId} on {Endpoint}", 
                        key, context.Request.Path);
                    return;
                }

                UpdateClientStatistics(key, clientStatistics);
            }

            await _next(context);
        }

        private string GenerateClientIdKey(HttpContext context, string policy)
        {
            var clientId = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            
            // For authenticated users, use user ID
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userId = context.User.FindFirst("sub")?.Value ?? 
                           context.User.FindFirst("id")?.Value ?? 
                           context.User.Identity.Name;
                clientId = userId ?? clientId;
            }

            return $"rate_limit_{policy}_{clientId}";
        }

        private ClientStatistics GetClientStatistics(string key)
        {
            return _cache.GetOrCreate(key, _ => new ClientStatistics());
        }

        private void UpdateClientStatistics(string key, ClientStatistics statistics)
        {
            statistics.LastRequestTime = DateTime.UtcNow;
            statistics.RequestCount++;

            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(2)
            };

            _cache.Set(key, statistics, cacheEntryOptions);
        }
    }

    public class ClientStatistics
    {
        public DateTime LastRequestTime { get; set; } = DateTime.UtcNow;
        public int RequestCount { get; set; } = 0;

        public bool IsExceeded(int limit, TimeSpan window)
        {
            var windowStart = DateTime.UtcNow.Subtract(window);
            if (LastRequestTime < windowStart)
            {
                RequestCount = 1;
                return false;
            }

            return RequestCount >= limit;
        }
    }

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class RateLimitAttribute : Attribute
    {
        public int Limit { get; }
        public TimeSpan Window { get; }
        public string Policy { get; }

        public RateLimitAttribute(int limit, int windowMinutes = 1, string policy = "default")
        {
            Limit = limit;
            Window = TimeSpan.FromMinutes(windowMinutes);
            Policy = policy;
        }
    }
}
