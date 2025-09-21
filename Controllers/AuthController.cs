using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
using backend.Services;
using backend.Middleware;
using System.Security.Claims;

namespace backend.Controllers
{
    /// <summary>
    /// Authentication controller for user login, registration, and token management
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        private readonly IAuditService _auditService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService, 
            ITokenService tokenService,
            IAuditService auditService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _tokenService = tokenService;
            _auditService = auditService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="registerDto">User registration data</param>
        /// <returns>Success message</returns>
        [HttpPost("register")]
        [RateLimit(5, 10)] // 5 requests per 10 minutes
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                await _authService.RegisterAsync(registerDto);
                
                _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);
                
                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for {Email}", registerDto.Email);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Login user and return JWT token
        /// </summary>
        /// <param name="loginDto">User login credentials</param>
        /// <returns>JWT token and user information</returns>
        [HttpPost("login")]
        [RateLimit(10, 5)] // 10 requests per 5 minutes
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _authService.AuthenticateAsync(loginDto.Email, loginDto.Password);
                if (user == null)
                {
                    _logger.LogWarning("Login failed for {Email}", loginDto.Email);
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                var tokenResponse = await _tokenService.GenerateTokenAsync(user);
                
                await _auditService.LogAsync(
                    user.Id, 
                    "LOGIN", 
                    $"User logged in from {HttpContext.Connection.RemoteIpAddress}", 
                    "User", 
                    user.Id,
                    HttpContext.Connection.RemoteIpAddress?.ToString() ?? ""
                );

                _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);

                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for {Email}", loginDto.Email);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Refresh JWT token using refresh token
        /// </summary>
        /// <param name="refreshDto">Token refresh data</param>
        /// <returns>New JWT token</returns>
        [HttpPost("refresh")]
        [RateLimit(20, 5)] // 20 requests per 5 minutes
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto refreshDto)
        {
            try
            {
                var tokenResponse = await _tokenService.RefreshTokenAsync(refreshDto);
                
                _logger.LogInformation("Token refreshed successfully");
                
                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Token refresh failed");
                return Unauthorized(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Revoke refresh token (logout)
        /// </summary>
        /// <param name="revokeDto">Token revocation data</param>
        /// <returns>Success message</returns>
        [HttpPost("revoke")]
        [Authorize]
        public async Task<IActionResult> Revoke([FromBody] RevokeTokenDto revokeDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                var result = await _tokenService.RevokeTokenAsync(revokeDto.RefreshToken);
                if (!result)
                {
                    return BadRequest(new { message = "Invalid refresh token" });
                }

                await _auditService.LogAsync(
                    userId, 
                    "LOGOUT", 
                    "User logged out", 
                    "User", 
                    userId,
                    HttpContext.Connection.RemoteIpAddress?.ToString() ?? ""
                );

                _logger.LogInformation("User logged out: {UserId}", userId);

                return Ok(new { message = "Token revoked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Token revocation failed");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        /// <returns>User profile information</returns>
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var user = await _authService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    role = user.Role?.Name
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get user profile");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
