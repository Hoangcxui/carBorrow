using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required, StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required, StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required, EmailAddress, StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        public bool IsEmailConfirmed { get; set; } = false;
        
        [StringLength(500)]
        public string EmailVerificationToken { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
        
        // Computed properties
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
        
        [NotMapped]
        public string Phone => PhoneNumber;
    }

    public class Role
    {
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;
        
        public ICollection<User> Users { get; set; } = new List<User>();
    }

    public class Category
    {
        public int Id { get; set; }
        
        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    }

    public class Vehicle
    {
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Make { get; set; } = string.Empty;
        
        [Required, StringLength(50)]
        public string Model { get; set; } = string.Empty;
        
        public int Year { get; set; }
        
        [StringLength(30)]
        public string Color { get; set; } = string.Empty;
        
        [Required, StringLength(20)]
        public string LicensePlate { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal DailyRate { get; set; }
        
        public int Seats { get; set; } = 5;
        
        [StringLength(50)]
        public string Transmission { get; set; } = string.Empty;
        
        [StringLength(30)]
        public string FuelType { get; set; } = string.Empty;
        
        public double Mileage { get; set; } = 0;
        
        [StringLength(1000)]
        public string Features { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Status { get; set; } = "Available";
        
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public class VehicleImage
    {
        public int Id { get; set; }
        
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        
        [Required, StringLength(500)]
        public string ImagePath { get; set; } = string.Empty;
        
        public bool IsPrimary { get; set; } = false;
        public DateTime UploadedAt { get; set; }
    }

    public class Booking
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        [StringLength(255)]
        public string PickupLocation { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string ReturnLocation { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalCost { get; set; }
        
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Active, Completed, Cancelled
        
        public int? Rating { get; set; }
        
        [StringLength(1000)]
        public string Review { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class RefreshToken
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        public string Token { get; set; } = string.Empty;
        
        public DateTime Expires { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Alias properties for compatibility
        [NotMapped]
        public DateTime ExpiresAt => Expires;
        
        [NotMapped]
        public DateTime? RevokedAt => Revoked;
    }

    public class AuditLog
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required, StringLength(100)]
        public string Action { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Details { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string EntityType { get; set; } = string.Empty;
        
        public int? EntityId { get; set; }
        
        [StringLength(45)]
        public string IpAddress { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
    }
}
