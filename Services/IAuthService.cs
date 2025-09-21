using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        AuthResultDto Register(RegisterDto dto);
        AuthResultDto Login(LoginDto dto);
        AuthResultDto RefreshToken(RefreshTokenDto dto);
        AuthResultDto VerifyEmail(string token);
    }
}
