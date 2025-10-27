using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResultDto> RegisterAsync(RegisterDto dto);
        Task<AuthResultDto> AuthenticateAsync(LoginDto dto);
        Task<AuthResultDto> RefreshTokenAsync(RefreshTokenDto dto);
        Task<AuthResultDto> VerifyEmailAsync(string token);
        Task<UserDto?> GetUserByIdAsync(int userId);
    }
}
