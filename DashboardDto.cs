namespace backend.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalVehicles { get; set; }
        public int AvailableVehicles { get; set; }
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public int TotalUsers { get; set; }
        public int NewUsersThisMonth { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public int PendingComplaints { get; set; }
        public double AverageRating { get; set; }
    }

    public class RevenueChartDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int BookingsCount { get; set; }
    }

    public class PopularVehicleDto
    {
        public int VehicleId { get; set; }
        public string VehicleName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int BookingsCount { get; set; }
        public decimal Revenue { get; set; }
        public double AverageRating { get; set; }
    }

    public class CustomerDashboardDto
    {
        public int TotalBookings { get; set; }
        public int UpcomingBookings { get; set; }
        public int CompletedBookings { get; set; }
        public decimal TotalSpent { get; set; }
        public double AverageRating { get; set; }
        public int FavoriteVehicles { get; set; }
        public List<BookingDto> RecentBookings { get; set; } = new List<BookingDto>();
        public List<VehicleDto> RecommendedVehicles { get; set; } = new List<VehicleDto>();
    }

    public class AdminAnalyticsDto
    {
        public DashboardStatsDto Stats { get; set; } = new DashboardStatsDto();
        public List<RevenueChartDto> RevenueChart { get; set; } = new List<RevenueChartDto>();
        public List<PopularVehicleDto> PopularVehicles { get; set; } = new List<PopularVehicleDto>();
        public List<BookingDto> RecentBookings { get; set; } = new List<BookingDto>();
    }
}