using backend.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace backend.Services
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(CarRentalDbContext context)
        {
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
                    new Category { Name = "Sedan", Description = "Comfortable family cars" },
                    new Category { Name = "SUV", Description = "Spacious utility vehicles" },
                    new Category { Name = "Luxury", Description = "Premium vehicles" },
                    new Category { Name = "Van", Description = "Large passenger vehicles" }
                };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            // Seed Vehicles
            if (!await context.Vehicles.AnyAsync())
            {
                var economyCategory = await context.Categories.FirstAsync(c => c.Name == "Economy");
                var sedanCategory = await context.Categories.FirstAsync(c => c.Name == "Sedan");
                var suvCategory = await context.Categories.FirstAsync(c => c.Name == "SUV");

                var vehicles = new[]
                {
                    new Vehicle
                    {
                        Make = "Toyota",
                        Model = "Vios",
                        Year = 2023,
                        Color = "White",
                        LicensePlate = "51A-12345",
                        DailyRate = 500000,
                        Seats = 5,
                        Transmission = "Automatic",
                        FuelType = "Gasoline",
                        Mileage = 15000,
                        Features = "Air conditioning, Bluetooth, GPS",
                        Description = "Reliable and fuel-efficient sedan",
                        ImageUrl = "/images/toyota-vios.jpg",
                        Status = "Available",
                        CategoryId = economyCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Honda",
                        Model = "City",
                        Year = 2023,
                        Color = "Silver",
                        LicensePlate = "51B-67890",
                        DailyRate = 550000,
                        Seats = 5,
                        Transmission = "Automatic",
                        FuelType = "Gasoline",
                        Mileage = 12000,
                        Features = "Air conditioning, Bluetooth, GPS, Backup camera",
                        Description = "Modern and stylish sedan",
                        ImageUrl = "/images/honda-city.jpg",
                        Status = "Available",
                        CategoryId = sedanCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Toyota",
                        Model = "Fortuner",
                        Year = 2022,
                        Color = "Black",
                        LicensePlate = "51C-11111",
                        DailyRate = 1200000,
                        Seats = 7,
                        Transmission = "Automatic",
                        FuelType = "Diesel",
                        Mileage = 25000,
                        Features = "4WD, Air conditioning, Leather seats, GPS, Parking sensors",
                        Description = "Powerful and spacious SUV",
                        ImageUrl = "/images/toyota-fortuner.jpg",
                        Status = "Available",
                        CategoryId = suvCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Vehicles.AddRangeAsync(vehicles);
                await context.SaveChangesAsync();
            }

            // Seed Locations (4 cơ sở HUFLIT)
            if (!await context.Locations.AnyAsync())
            {
                var locations = new[]
                {
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở Sư Vạn Hạnh (Main Campus)",
                        Address = "828 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
                        Latitude = 10.7714,
                        Longitude = 106.6653,
                        PhoneNumber = "028 3863 6636",
                        Description = "Cơ sở chính - Trụ sở Hành chính và Học tập",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở Trường Sơn",
                        Address = "32 Trường Sơn, Phường 4, Quận Tân Bình, TP.HCM",
                        Latitude = 10.8013,
                        Longitude = 106.6582,
                        PhoneNumber = "028 3844 0091",
                        Description = "Cơ sở học tập và thực hành gần sân bay",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở Ba Gia",
                        Address = "52-70 Ba Gia, Phường 2, Quận Tân Bình, TP.HCM",
                        Latitude = 10.8025,
                        Longitude = 106.6519,
                        PhoneNumber = "028 3842 3377",
                        Description = "Cơ sở phụ trợ và hoạt động sinh viên",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở Hóc Môn",
                        Address = "806 Lê Quang Đạo, Phường Tân Thới Nhất, Quận 12, TP.HCM",
                        Latitude = 10.8547,
                        Longitude = 106.6271,
                        PhoneNumber = "028 3755 5555",
                        Description = "Cơ sở mở rộng và đào tạo từ xa",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Locations.AddRangeAsync(locations);
                await context.SaveChangesAsync();
            }
        }
    }
}
