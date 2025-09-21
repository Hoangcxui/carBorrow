using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using backend.Services;
using backend.Models;
using backend.DTOs;
using AutoMapper;
using backend.Profiles;

namespace backend.Tests.Services
{
    public class AuthServiceTests : IDisposable
    {
        private readonly CarRentalDbContext _context;
        private readonly Mock<ILogger<AuthService>> _mockLogger;
        private readonly IMapper _mapper;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            var options = new DbContextOptionsBuilder<CarRentalDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new CarRentalDbContext(options);
            _mockLogger = new Mock<ILogger<AuthService>>();

            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();

            _authService = new AuthService(_context, _mapper, _mockLogger.Object);

            SeedTestData();
        }

        private void SeedTestData()
        {
            var customerRole = new Role { Id = 1, Name = "Customer", Description = "Customer role" };
            var adminRole = new Role { Id = 2, Name = "Admin", Description = "Admin role" };

            _context.Roles.AddRange(customerRole, adminRole);
            _context.SaveChanges();
        }

        [Fact]
        public async Task RegisterAsync_ValidUser_ShouldCreateUser()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@test.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            // Act
            var result = await _authService.RegisterAsync(registerDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(registerDto.Email, result.Email);
            Assert.True(BCrypt.Net.BCrypt.Verify(registerDto.Password, result.PasswordHash));

            var userInDb = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            Assert.NotNull(userInDb);
        }

        [Fact]
        public async Task RegisterAsync_DuplicateEmail_ShouldThrowException()
        {
            // Arrange
            var registerDto1 = new RegisterDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "duplicate@test.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            var registerDto2 = new RegisterDto
            {
                FirstName = "Jane",
                LastName = "Doe",
                Email = "duplicate@test.com",
                Password = "Password123!",
                PhoneNumber = "0987654321"
            };

            // Act & Assert
            await _authService.RegisterAsync(registerDto1);
            await Assert.ThrowsAsync<ArgumentException>(() => _authService.RegisterAsync(registerDto2));
        }

        [Fact]
        public async Task AuthenticateAsync_ValidCredentials_ShouldReturnUser()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            await _authService.RegisterAsync(registerDto);

            // Act
            var result = await _authService.AuthenticateAsync("test@example.com", "Password123!");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task AuthenticateAsync_InvalidCredentials_ShouldReturnNull()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test2@example.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            await _authService.RegisterAsync(registerDto);

            // Act
            var result = await _authService.AuthenticateAsync("test2@example.com", "WrongPassword");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByIdAsync_ExistingUser_ShouldReturnUser()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Get",
                LastName = "Test",
                Email = "gettest@example.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            var createdUser = await _authService.RegisterAsync(registerDto);

            // Act
            var result = await _authService.GetUserByIdAsync(createdUser.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createdUser.Id, result.Id);
            Assert.Equal(createdUser.Email, result.Email);
        }

        [Fact]
        public async Task GetUserByIdAsync_NonExistingUser_ShouldReturnNull()
        {
            // Act
            var result = await _authService.GetUserByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
