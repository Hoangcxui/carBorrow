using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Text;
using System.Text.Json;
using backend.DTOs;
using System.Net;

namespace backend.Tests.Integration
{
    public class AuthControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AuthControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext registration
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CarRentalDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add InMemory database for testing
                    services.AddDbContext<CarRentalDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb");
                    });
                });
            });

            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Register_ValidUser_ReturnsSuccess()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Integration",
                LastName = "Test",
                Email = "integration@test.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            var json = JsonSerializer.Serialize(registerDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/register", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("User registered successfully", responseContent);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            // Arrange - First register a user
            var registerDto = new RegisterDto
            {
                FirstName = "Login",
                LastName = "Test",
                Email = "login@test.com",
                Password = "Password123!",
                PhoneNumber = "1234567890"
            };

            var registerJson = JsonSerializer.Serialize(registerDto);
            var registerContent = new StringContent(registerJson, Encoding.UTF8, "application/json");
            await _client.PostAsync("/api/auth/register", registerContent);

            // Act - Try to login
            var loginDto = new LoginDto
            {
                Email = "login@test.com",
                Password = "Password123!"
            };

            var loginJson = JsonSerializer.Serialize(loginDto);
            var loginContent = new StringContent(loginJson, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/api/auth/login", loginContent);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("token", responseContent);
            Assert.Contains("refreshToken", responseContent);
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "nonexistent@test.com",
                Password = "WrongPassword"
            };

            var json = JsonSerializer.Serialize(loginDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/login", content);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Theory]
        [InlineData("", "Password123!", "FirstName is required")]
        [InlineData("John", "", "Password is required")]
        [InlineData("John", "123", "Password must be at least 8 characters")]
        [InlineData("John", "password", "Password must contain at least one uppercase letter")]
        public async Task Register_InvalidData_ReturnsBadRequest(string firstName, string password, string expectedError)
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = firstName,
                LastName = "Doe",
                Email = "test@example.com",
                Password = password,
                PhoneNumber = "1234567890"
            };

            var json = JsonSerializer.Serialize(registerDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/auth/register", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
