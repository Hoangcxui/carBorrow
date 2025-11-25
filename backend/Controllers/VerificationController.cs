using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : ControllerBase
    {
        private readonly CarRentalDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<VerificationController> _logger;

        public VerificationController(
            CarRentalDbContext context,
            IEmailService emailService,
            ILogger<VerificationController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        /// <summary>
        /// Send verification code to email
        /// </summary>
        [HttpPost("send-code")]
        [AllowAnonymous]
        public async Task<IActionResult> SendVerificationCode([FromBody] SendCodeDto dto)
        {
            try
            {
                // Check if email already exists
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email đã được đăng ký" });
                }

                // Generate 6-digit code
                var code = new Random().Next(100000, 999999).ToString();

                // Delete old codes for this email
                var oldCodes = _context.VerificationCodes
                    .Where(vc => vc.Email == dto.Email && vc.Purpose == "registration")
                    .ToList();
                _context.VerificationCodes.RemoveRange(oldCodes);

                // Create new verification code
                var verificationCode = new VerificationCode
                {
                    Email = dto.Email,
                    Code = code,
                    Purpose = "registration",
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                    IsUsed = false
                };

                _context.VerificationCodes.Add(verificationCode);
                await _context.SaveChangesAsync();

                // Send email
                await _emailService.SendVerificationEmailAsync(dto.Email, code);

                _logger.LogInformation($"Verification code sent to {dto.Email}");

                return Ok(new { 
                    success = true, 
                    message = "Mã xác thực đã được gửi đến email của bạn",
                    expiresIn = 600 // seconds
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending verification code to {dto.Email}");
                return StatusCode(500, new { message = "Lỗi khi gửi mã xác thực" });
            }
        }

        /// <summary>
        /// Verify code
        /// </summary>
        [HttpPost("verify-code")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto dto)
        {
            try
            {
                var verificationCode = _context.VerificationCodes
                    .FirstOrDefault(vc => 
                        vc.Email == dto.Email && 
                        vc.Code == dto.Code && 
                        vc.Purpose == "registration" &&
                        !vc.IsUsed &&
                        vc.ExpiresAt > DateTime.UtcNow);

                if (verificationCode == null)
                {
                    return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc đã hết hạn" });
                }

                // Mark as used
                verificationCode.IsUsed = true;
                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = "Xác thực thành công" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying code");
                return StatusCode(500, new { message = "Lỗi khi xác thực mã" });
            }
        }
    }

    public class SendCodeDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyCodeDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}
