using backend.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace backend.Services
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(CarRentalDbContext context)
        {
            // For InMemory database, no need to ensure creation

            // Seed Roles
            if (!await context.Roles.AnyAsync())
            {
                var roles = new[]
                {
                    new Role { Name = "Admin", Description = "System Administrator" },
                    new Role { Name = "Staff", Description = "Staff Member" },
                    new Role { Name = "Customer", Description = "Customer" }
                };

                await context.Roles.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }

            // Seed Admin User
            if (!await context.Users.AnyAsync(u => u.Email == "admin@carborrow.com"))
            {
                var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");
                var adminUser = new User
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@carborrow.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    PhoneNumber = "0123456789",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    RoleId = adminRole.Id
                };

                await context.Users.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }

            // Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                var categories = new[]
                {
                    new Category { Name = "Economy", Description = "Budget-friendly vehicles" },
                    new Category { Name = "Compact", Description = "Small, efficient cars" },
                    new Category { Name = "SUV", Description = "Sport Utility Vehicles" },
                    new Category { Name = "Luxury", Description = "High-end luxury vehicles" }
                };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            // Seed Sample Vehicles
            if (!await context.Vehicles.AnyAsync())
            {
                var economyCategory = await context.Categories.FirstAsync(c => c.Name == "Economy");
                var suvCategory = await context.Categories.FirstAsync(c => c.Name == "SUV");

                var vehicles = new[]
                {
                    new Vehicle
                    {
                        Make = "Toyota",
                        Model = "Camry",
                        Year = 2022,
                        Color = "White",
                        LicensePlate = "ABC-123",
                        DailyRate = 50.00m,
                        Status = "Available",
                        CategoryId = economyCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Honda",
                        Model = "CR-V",
                        Year = 2023,
                        Color = "Black",
                        LicensePlate = "XYZ-789",
                        DailyRate = 75.00m,
                        Status = "Available",
                        CategoryId = suvCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Vehicles.AddRangeAsync(vehicles);
                await context.SaveChangesAsync();
            }
        }
    }
}
