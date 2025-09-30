using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RefreshTokenDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;
        
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class TokenResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class RevokeTokenDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
