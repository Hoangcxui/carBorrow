using backend.Models;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IDashboardService
    {
        Task<AdminAnalyticsDto> GetAdminAnalyticsAsync();
        Task<CustomerDashboardDto> GetCustomerDashboardAsync(int userId);
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly CarRentalDbContext _context;

        public DashboardService(CarRentalDbContext context)
        {
            _context = context;
        }

        public async Task<AdminAnalyticsDto> GetAdminAnalyticsAsync()
        {
            var stats = await GetDashboardStatsAsync();
            var revenueChart = await GetRevenueChartAsync();
            var popularVehicles = await GetPopularVehiclesAsync();
            var recentBookings = await GetRecentBookingsAsync(10);

            return new AdminAnalyticsDto
            {
                Stats = stats,
                RevenueChart = revenueChart,
                PopularVehicles = popularVehicles,
                RecentBookings = recentBookings
            };
        }

        public async Task<CustomerDashboardDto> GetCustomerDashboardAsync(int userId)
        {
            var totalBookings = await _context.Bookings.CountAsync(b => b.UserId == userId);
            var upcomingBookings = await _context.Bookings.CountAsync(b => 
                b.UserId == userId && b.Status == "Confirmed" && b.StartDate > DateTime.Now);
            var completedBookings = await _context.Bookings.CountAsync(b => 
                b.UserId == userId && b.Status == "Completed");
            var totalSpent = await _context.Bookings
                .Where(b => b.UserId == userId && (b.Status == "Completed" || b.Status == "Active"))
                .SumAsync(b => b.TotalCost);

            var userRatings = await _context.Bookings
                .Where(b => b.UserId == userId && b.Rating.HasValue)
                .Select(b => b.Rating.Value)
                .ToListAsync();
            var averageRating = userRatings.Any() ? userRatings.Average() : 0;

            var recentBookings = await _context.Bookings
                .Include(b => b.Vehicle)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    VehicleId = b.VehicleId,
                    VehicleMake = b.Vehicle.Make,
                    VehicleModel = b.Vehicle.Model,
                    VehicleYear = b.Vehicle.Year,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    TotalCost = b.TotalCost,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            var recommendedVehicles = await GetRecommendedVehiclesForUser(userId);

            return new CustomerDashboardDto
            {
                TotalBookings = totalBookings,
                UpcomingBookings = upcomingBookings,
                CompletedBookings = completedBookings,
                TotalSpent = totalSpent,
                AverageRating = averageRating,
                FavoriteVehicles = 0, // TODO: Implement favorites table
                RecentBookings = recentBookings,
                RecommendedVehicles = recommendedVehicles
            };
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var totalVehicles = await _context.Vehicles.CountAsync(v => !v.IsDeleted);
            var availableVehicles = await _context.Vehicles.CountAsync(v => !v.IsDeleted && v.Status == "Available");
            var totalBookings = await _context.Bookings.CountAsync();
            var activeBookings = await _context.Bookings.CountAsync(b => b.Status == "Active");
            var totalUsers = await _context.Users.CountAsync();
            var newUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= firstDayOfMonth);
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed" || b.Status == "Active")
                .SumAsync(b => b.TotalCost);
            var revenueThisMonth = await _context.Bookings
                .Where(b => (b.Status == "Completed" || b.Status == "Active") && b.CreatedAt >= firstDayOfMonth)
                .SumAsync(b => b.TotalCost);
            
            var pendingComplaints = 0; // TODO: Implement complaints table count
            
            var allRatings = await _context.Bookings
                .Where(b => b.Rating.HasValue)
                .Select(b => b.Rating.Value)
                .ToListAsync();
            var averageRating = allRatings.Any() ? allRatings.Average() : 0;

            return new DashboardStatsDto
            {
                TotalVehicles = totalVehicles,
                AvailableVehicles = availableVehicles,
                TotalBookings = totalBookings,
                ActiveBookings = activeBookings,
                TotalUsers = totalUsers,
                NewUsersThisMonth = newUsersThisMonth,
                TotalRevenue = totalRevenue,
                RevenueThisMonth = revenueThisMonth,
                PendingComplaints = pendingComplaints,
                AverageRating = averageRating
            };
        }

        private async Task<List<RevenueChartDto>> GetRevenueChartAsync()
        {
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            
            var monthlyRevenue = await _context.Bookings
                .Where(b => (b.Status == "Completed" || b.Status == "Active") && b.CreatedAt >= sixMonthsAgo)
                .GroupBy(b => new { b.CreatedAt.Year, b.CreatedAt.Month })
                .Select(g => new RevenueChartDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Revenue = g.Sum(b => b.TotalCost),
                    BookingsCount = g.Count()
                })
                .OrderBy(r => r.Month)
                .ToListAsync();

            return monthlyRevenue;
        }

        private async Task<List<PopularVehicleDto>> GetPopularVehiclesAsync()
        {
            var popularVehicles = await _context.Vehicles
                .Include(v => v.Bookings)
                .Where(v => !v.IsDeleted)
                .Select(v => new PopularVehicleDto
                {
                    VehicleId = v.Id,
                    VehicleName = $"{v.Year} {v.Make} {v.Model}",
                    ImageUrl = v.ImageUrl,
                    BookingsCount = v.Bookings.Count(b => b.Status == "Completed"),
                    Revenue = v.Bookings.Where(b => b.Status == "Completed").Sum(b => b.TotalCost),
                    AverageRating = v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0
                })
                .OrderByDescending(v => v.BookingsCount)
                .Take(10)
                .ToListAsync();

            return popularVehicles;
        }

        private async Task<List<BookingDto>> GetRecentBookingsAsync(int count)
        {
            var recentBookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .OrderByDescending(b => b.CreatedAt)
                .Take(count)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = $"{b.User.FirstName} {b.User.LastName}",
                    VehicleId = b.VehicleId,
                    VehicleMake = b.Vehicle.Make,
                    VehicleModel = b.Vehicle.Model,
                    VehicleYear = b.Vehicle.Year,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    TotalCost = b.TotalCost,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return recentBookings;
        }

        private async Task<List<VehicleDto>> GetRecommendedVehiclesForUser(int userId)
        {
            // Get user's booking history to recommend similar vehicles
            var userBookings = await _context.Bookings
                .Include(b => b.Vehicle)
                .Where(b => b.UserId == userId && b.Status == "Completed")
                .ToListAsync();

            if (!userBookings.Any())
            {
                // If no history, return popular vehicles
                return await _context.Vehicles
                    .Include(v => v.Category)
                    .Where(v => !v.IsDeleted && v.Status == "Available")
                    .OrderByDescending(v => v.Bookings.Count(b => b.Status == "Completed"))
                    .Take(5)
                    .Select(v => new VehicleDto
                    {
                        Id = v.Id,
                        Make = v.Make,
                        Model = v.Model,
                        Year = v.Year,
                        DailyRate = v.DailyRate,
                        ImageUrl = v.ImageUrl,
                        CategoryName = v.Category.Name,
                        IsAvailable = true,
                        AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0)
                    })
                    .ToListAsync();
            }

            // Get categories user has booked before
            var preferredCategories = userBookings.Select(b => b.Vehicle.CategoryId).Distinct().ToList();

            var recommendedVehicles = await _context.Vehicles
                .Include(v => v.Category)
                .Where(v => !v.IsDeleted && v.Status == "Available" && preferredCategories.Contains(v.CategoryId))
                .Where(v => !userBookings.Select(b => b.VehicleId).Contains(v.Id)) // Exclude already booked vehicles
                .Take(5)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    DailyRate = v.DailyRate,
                    ImageUrl = v.ImageUrl,
                    CategoryName = v.Category.Name,
                    IsAvailable = true,
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0)
                })
                .ToListAsync();

            return recommendedVehicles;
        }
    }
}