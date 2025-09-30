using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Color { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }
        public bool IsAvailable { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        // Additional properties that services expect
        public int Seats { get; set; }
        public string Transmission { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public int Mileage { get; set; }
        public string Features { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Calculated properties
        public decimal AverageRating { get; set; }
        public int TotalBookings { get; set; }
    }

    public class CreateVehicleDto
    {
        [Required]
        [StringLength(50)]
        public string Make { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Model { get; set; } = string.Empty;

        [Range(1900, 2030)]
        public int Year { get; set; }

        [Required]
        [StringLength(30)]
        public string Color { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [Range(0.01, 10000)]
        public decimal DailyRate { get; set; }

        [Required]
        public int CategoryId { get; set; }
        
        // Additional fields
        [Range(1, 8)]
        public int Seats { get; set; }
        
        [Required]
        public string Transmission { get; set; } = string.Empty;
        
        [Required]  
        public string FuelType { get; set; } = string.Empty;
        
        public int Mileage { get; set; }
        public string Features { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }



    public class UpdateVehicleDto
    {
        [StringLength(50)]
        public string? Make { get; set; }

        [StringLength(50)]
        public string? Model { get; set; }

        [Range(1900, 2030)]
        public int? Year { get; set; }

        [StringLength(30)]
        public string? Color { get; set; }

        [StringLength(20)]
        public string? LicensePlate { get; set; }

        [Range(0, 10000)]
        public decimal? DailyRate { get; set; }

        [Range(1, 50)]
        public int? Seats { get; set; }

        [StringLength(50)]
        public string? Transmission { get; set; }

        [StringLength(50)]
        public string? FuelType { get; set; }

        [Range(0, 999999)]
        public double? Mileage { get; set; }

        [StringLength(1000)]
        public string? Features { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public int? CategoryId { get; set; }

        public string? Status { get; set; }
    }

    public class VehicleSearchDto
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinSeats { get; set; }
        public string? Transmission { get; set; }
        public string? FuelType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
