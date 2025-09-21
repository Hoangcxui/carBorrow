using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BCrypt.Net;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly CarRentalDbContext _db;
        private readonly IConfiguration _config;
        public AuthService(CarRentalDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public AuthResultDto Register(RegisterDto dto)
        {
            if (_db.Users.Any(u => u.Email == dto.Email))
                return new AuthResultDto { Success = false, Message = "Email đã tồn tại" };

            var emailToken = Guid.NewGuid().ToString();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Phone = dto.Phone,
                Role = "Customer",
                IsEmailConfirmed = false,
                EmailVerificationToken = emailToken,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            _db.SaveChanges();
            // Demo: log gửi email xác thực
            Console.WriteLine($"Gửi email xác thực tới {user.Email} với token: {emailToken}");
            var tokens = GenerateTokens(user);
            return new AuthResultDto { Success = true, Message = "Đăng ký thành công. Vui lòng xác thực email.", AccessToken = tokens.AccessToken, RefreshToken = tokens.RefreshToken };
        }

        public AuthResultDto Login(LoginDto dto)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return new AuthResultDto { Success = false, Message = "Email hoặc mật khẩu không đúng" };
            var tokens = GenerateTokens(user);
            return new AuthResultDto { Success = true, Message = "Đăng nhập thành công", AccessToken = tokens.AccessToken, RefreshToken = tokens.RefreshToken };
        }

        public AuthResultDto RefreshToken(RefreshTokenDto dto)
        {
            var refresh = _db.RefreshTokens.Include(r => r.User).FirstOrDefault(r => r.Token == dto.RefreshToken && r.RevokedAt == null && r.ExpiresAt > DateTime.UtcNow);
            if (refresh == null)
                return new AuthResultDto { Success = false, Message = "Refresh token không hợp lệ" };
            var tokens = GenerateTokens(refresh.User);
            refresh.RevokedAt = DateTime.UtcNow;
            _db.SaveChanges();
            return new AuthResultDto { Success = true, Message = "Làm mới token thành công", AccessToken = tokens.AccessToken, RefreshToken = tokens.RefreshToken };
        }

        public AuthResultDto VerifyEmail(string token)
        {
            var user = _db.Users.FirstOrDefault(u => u.EmailVerificationToken == token && !u.IsEmailConfirmed);
            if (user == null)
                return new AuthResultDto { Success = false, Message = "Token xác thực không hợp lệ hoặc đã xác thực." };
            user.IsEmailConfirmed = true;
            user.EmailVerificationToken = null;
            user.UpdatedAt = DateTime.UtcNow;
            _db.SaveChanges();
            return new AuthResultDto { Success = true, Message = "Xác thực email thành công." };
        }

        private (string AccessToken, string RefreshToken) GenerateTokens(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? "Customer")
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "supersecretkey"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "carborrow",
                audience: _config["Jwt:Audience"] ?? "carborrow",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString();
            var refresh = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            _db.RefreshTokens.Add(refresh);
            _db.SaveChanges();
            return (accessToken, refreshToken);
        }
    }

    public class AuthResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
