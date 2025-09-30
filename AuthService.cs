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
        private readonly IAuditService _auditService;
        
        public AuthService(CarRentalDbContext db, IConfiguration config, IAuditService auditService)
        {
            _db = db;
            _config = config;
            _auditService = auditService;
        }

        public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
        {
            // Check if email exists
            var existingUser = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);
                
            if (existingUser != null)
                return new AuthResultDto { Success = false, Message = "Email đã tồn tại" };

            // Find Customer role
            var customerRole = await _db.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
            if (customerRole == null)
            {
                return new AuthResultDto { Success = false, Message = "Role Customer không tồn tại" };
            }

            // Create new user
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                RoleId = customerRole.Id,
                IsEmailConfirmed = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // Log audit
            await _auditService.LogAsync(user.Id, "Register", "User registered successfully", "User", user.Id);

            return new AuthResultDto
            {
                Success = true,
                Message = "Đăng ký thành công!"
            };
        }

        public async Task<AuthResultDto> AuthenticateAsync(LoginDto dto)
        {
            // Find user with role
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                // Try to log audit for failed login (no user ID available)
                return new AuthResultDto { Success = false, Message = "Email hoặc mật khẩu không đúng" };
            }

            // Generate tokens
            var accessToken = GenerateAccessToken(user);
            var refreshToken = await GenerateRefreshTokenAsync(user);

            // Log audit
            await _auditService.LogAsync(user.Id, "Login", "User logged in successfully", "User", user.Id);

            return new AuthResultDto
            {
                Success = true,
                Message = "Đăng nhập thành công",
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };
        }

        public async Task<AuthResultDto> RefreshTokenAsync(RefreshTokenDto dto)
        {
            // Find refresh token
            var refreshToken = await _db.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);

            // Check if token is valid
            if (refreshToken == null || refreshToken.Expires < DateTime.UtcNow || refreshToken.Revoked.HasValue)
                return new AuthResultDto { Success = false, Message = "Token không hợp lệ" };

            // Revoke old token
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.IsActive = false;

            // Generate new tokens
            var newAccessToken = GenerateAccessToken(refreshToken.User);
            var newRefreshToken = await GenerateRefreshTokenAsync(refreshToken.User);

            await _db.SaveChangesAsync();

            return new AuthResultDto
            {
                Success = true,
                Message = "Token đã được làm mới",
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<AuthResultDto> VerifyEmailAsync(string token)
        {
            // Note: This is a simplified version. In a real app, you'd store email verification tokens
            await Task.Delay(1); // Just to make it truly async
            return new AuthResultDto { Success = true, Message = "Email đã được xác thực" };
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role?.Name ?? "Customer",
                CreatedAt = user.CreatedAt
            };
        }

        private string GenerateAccessToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "your-secret-key-here"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "Customer"),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "CarRental",
                audience: _config["Jwt:Audience"] ?? "CarRental",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<RefreshToken> GenerateRefreshTokenAsync(User user)
        {
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = user.Id,
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                IsActive = true
            };

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            return refreshToken;
        }
    }
}