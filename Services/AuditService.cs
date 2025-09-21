using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IAuditService
    {
        Task LogAsync(int userId, string action, string details, string entityType, int? entityId = null, string ipAddress = "");
        Task<IEnumerable<AuditLog>> GetAuditLogsAsync(int? userId = null, string? entityType = null, DateTime? from = null, DateTime? to = null);
    }

    public class AuditService : IAuditService
    {
        private readonly CarRentalDbContext _context;
        private readonly ILogger<AuditService> _logger;

        public AuditService(CarRentalDbContext context, ILogger<AuditService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task LogAsync(int userId, string action, string details, string entityType, int? entityId = null, string ipAddress = "")
        {
            try
            {
                var auditLog = new AuditLog
                {
                    UserId = userId,
                    Action = action,
                    Details = details,
                    EntityType = entityType,
                    EntityId = entityId,
                    IpAddress = ipAddress,
                    CreatedAt = DateTime.UtcNow
                };

                _context.AuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Audit log created: {Action} by User {UserId}", action, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create audit log for action: {Action} by User {UserId}", action, userId);
            }
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync(int? userId = null, string? entityType = null, DateTime? from = null, DateTime? to = null)
        {
            var query = _context.AuditLogs.Include(a => a.User).AsQueryable();

            if (userId.HasValue)
                query = query.Where(a => a.UserId == userId.Value);

            if (!string.IsNullOrEmpty(entityType))
                query = query.Where(a => a.EntityType == entityType);

            if (from.HasValue)
                query = query.Where(a => a.CreatedAt >= from.Value);

            if (to.HasValue)
                query = query.Where(a => a.CreatedAt <= to.Value);

            return await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
        }
    }
}
