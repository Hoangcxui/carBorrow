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
                var luxuryCategory = await context.Categories.FirstAsync(c => c.Name == "Luxury");
                var vanCategory = await context.Categories.FirstAsync(c => c.Name == "Van");

                var vehicles = new[]
                {
                    new Vehicle
                    {
                        Make = "Toyota",
                        Model = "Vios",
                        Year = 2023,
                        Color = "Trắng Ngọc Trai",
                        LicensePlate = "51A-12345",
                        DailyRate = 500000,
                        Seats = 5,
                        Transmission = "Số tự động",
                        FuelType = "Xăng",
                        Mileage = 15000,
                        Features = "Điều hòa, Bluetooth, GPS, Camera lùi, Cảm biến lùi",
                        Description = "Toyota Vios 2023 - Xe sedan kinh tế, tiết kiệm nhiên liệu, phù hợp cho gia đình và di chuyển trong thành phố",
                        ImageUrl = "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
                        Status = "Available",
                        CategoryId = economyCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Honda",
                        Model = "City",
                        Year = 2023,
                        Color = "Bạc Titan",
                        LicensePlate = "51B-67890",
                        DailyRate = 550000,
                        Seats = 5,
                        Transmission = "Số tự động CVT",
                        FuelType = "Xăng",
                        Mileage = 12000,
                        Features = "Điều hòa tự động, Bluetooth, GPS, Camera 360, Cảm biến va chạm, Cruise Control",
                        Description = "Honda City 2023 - Sedan hiện đại, thiết kế trẻ trung, trang bị công nghệ tiên tiến",
                        ImageUrl = "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
                        Status = "Available",
                        CategoryId = sedanCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Toyota",
                        Model = "Fortuner",
                        Year = 2022,
                        Color = "Đen Ánh Kim",
                        LicensePlate = "51C-11111",
                        DailyRate = 1200000,
                        Seats = 7,
                        Transmission = "Số tự động",
                        FuelType = "Dầu Diesel",
                        Mileage = 25000,
                        Features = "4WD, Điều hòa 2 chiều, Ghế da cao cấp, GPS, Camera 360, Cảm biến đỗ xe, Phanh tự động",
                        Description = "Toyota Fortuner 2022 - SUV 7 chỗ mạnh mẽ, sang trọng, phù hợp cho du lịch gia đình và địa hình khó",
                        ImageUrl = "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
                        Status = "Available",
                        CategoryId = suvCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Mazda",
                        Model = "CX-5",
                        Year = 2023,
                        Color = "Đỏ Pha Lê",
                        LicensePlate = "51D-22222",
                        DailyRate = 950000,
                        Seats = 5,
                        Transmission = "Số tự động 6 cấp",
                        FuelType = "Xăng",
                        Mileage = 8000,
                        Features = "Điều hòa tự động 2 vùng, Ghế da, Cửa sổ trời Panorama, Camera 360, HUD, Cruise Control",
                        Description = "Mazda CX-5 2023 - SUV hạng trung sang trọng với thiết kế KODO đẳng cấp",
                        ImageUrl = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
                        Status = "Available",
                        CategoryId = suvCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Mercedes-Benz",
                        Model = "E-Class",
                        Year = 2022,
                        Color = "Đen Obsidian",
                        LicensePlate = "51E-33333",
                        DailyRate = 2500000,
                        Seats = 5,
                        Transmission = "Số tự động 9 cấp",
                        FuelType = "Xăng",
                        Mileage = 18000,
                        Features = "Ghế massage, Âm thanh Burmester, Điều hòa 4 vùng, HUD, Hệ thống lái tự động, Camera 360",
                        Description = "Mercedes-Benz E-Class 2022 - Sedan hạng sang đỉnh cao của sự thoải mái và công nghệ",
                        ImageUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
                        Status = "Available",
                        CategoryId = luxuryCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "BMW",
                        Model = "X5",
                        Year = 2023,
                        Color = "Xanh Alpine",
                        LicensePlate = "51F-44444",
                        DailyRate = 2800000,
                        Seats = 7,
                        Transmission = "Số tự động 8 cấp",
                        FuelType = "Xăng",
                        Mileage = 5000,
                        Features = "4WD xDrive, Ghế thể thao, Âm thanh Harman Kardon, HUD, Hệ thống lái 4 bánh, Phanh tự động",
                        Description = "BMW X5 2023 - SUV thể thao hạng sang với khả năng vận hành đỉnh cao",
                        ImageUrl = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
                        Status = "Available",
                        CategoryId = luxuryCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Hyundai",
                        Model = "Stargazer",
                        Year = 2023,
                        Color = "Bạc Sáng",
                        LicensePlate = "51G-55555",
                        DailyRate = 650000,
                        Seats = 7,
                        Transmission = "Số tự động CVT",
                        FuelType = "Xăng",
                        Mileage = 10000,
                        Features = "Điều hòa tự động, 3 hàng ghế, Bluetooth, USB, Camera lùi",
                        Description = "Hyundai Stargazer 2023 - MPV 7 chỗ hiện đại, rộng rãi, phù hợp cho gia đình đông người",
                        ImageUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
                        Status = "Available",
                        CategoryId = vanCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Vehicle
                    {
                        Make = "Ford",
                        Model = "Transit",
                        Year = 2022,
                        Color = "Trắng",
                        LicensePlate = "51H-66666",
                        DailyRate = 1100000,
                        Seats = 16,
                        Transmission = "Số tự động",
                        FuelType = "Dầu Diesel",
                        Mileage = 35000,
                        Features = "Điều hòa mát lạnh, Ghế bọc da, Bluetooth, USB mỗi hàng ghế, Camera lùi",
                        Description = "Ford Transit 2022 - Xe 16 chỗ cao cấp, phù hợp cho du lịch nhóm đông, đưa đón công ty",
                        ImageUrl = "https://images.unsplash.com/photo-1570733577920-d9f9c3f34f04?w=800",
                        Status = "Available",
                        CategoryId = vanCategory.Id,
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
