using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            var result = _authService.Register(dto);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var result = _authService.Login(dto);
            if (!result.Success) return Unauthorized(result.Message);
            return Ok(result);
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var result = _authService.RefreshToken(dto);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail([FromQuery] string token)
        {
            var result = _authService.VerifyEmail(token);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result);
        }
    }
}
