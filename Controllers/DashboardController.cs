using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IDashboardService dashboardService,
            ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Get admin analytics dashboard (Admin/Staff only)
        /// </summary>
        [HttpGet("admin-analytics")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<AdminAnalyticsDto>> GetAdminAnalytics()
        {
            try
            {
                var analytics = await _dashboardService.GetAdminAnalyticsAsync();
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get customer dashboard for current user
        /// </summary>
        [HttpGet("customer")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<CustomerDashboardDto>> GetCustomerDashboard()
        {
            try
            {
                var userId = GetCurrentUserId();
                var dashboard = await _dashboardService.GetCustomerDashboardAsync(userId);
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer dashboard for user {UserId}", GetCurrentUserId());
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get dashboard statistics (Admin/Staff only)
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }
}