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
                        Name = "HUFLIT - Cơ sở 1 (Đinh Tiên Hoàng)",
                        Address = "71 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM",
                        Latitude = 10.7888,
                        Longitude = 106.6951,
                        PhoneNumber = "028 3822 2122",
                        Description = "Cơ sở chính - Trụ sở Hành chính",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở 2 (Nguyễn Thị Minh Khai)",
                        Address = "60 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM",
                        Latitude = 10.7769,
                        Longitude = 106.6878,
                        PhoneNumber = "028 3930 0124",
                        Description = "Khu học tập và thực hành",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở 3 (Trần Quang Khải)",
                        Address = "252 Trần Quang Khải, Phường Tân Định, Quận 1, TP.HCM",
                        Latitude = 10.7893,
                        Longitude = 106.6918,
                        PhoneNumber = "028 3822 7575",
                        Description = "Khu giảng đường và phòng lab",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Location
                    {
                        Name = "HUFLIT - Cơ sở 4 (Pasteur)",
                        Address = "98 Pasteur, Phường Nguyễn Thái Bình, Quận 1, TP.HCM",
                        Latitude = 10.7794,
                        Longitude = 106.6947,
                        PhoneNumber = "028 3824 9999",
                        Description = "Khu ký túc xá và hoạt động sinh viên",
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
