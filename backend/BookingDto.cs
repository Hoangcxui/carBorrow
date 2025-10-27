using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int VehicleId { get; set; }
        public string VehicleMake { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public int VehicleYear { get; set; }
        public string VehicleLicensePlate { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PickupLocation { get; set; } = string.Empty;
        public string ReturnLocation { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateBookingDto
    {
        [Required]
        public int VehicleId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required, StringLength(255)]
        public string PickupLocation { get; set; } = string.Empty;

        [StringLength(255)]
        public string ReturnLocation { get; set; } = string.Empty;

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
    }

    public class UpdateBookingDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        [StringLength(255)]
        public string? PickupLocation { get; set; }
        
        [StringLength(255)]
        public string? ReturnLocation { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class BookingStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Reason { get; set; }
    }
}