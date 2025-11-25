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
        
        public int? UserId { get; set; }
        public User User { get; set; } = null!;
        
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        
        // Customer Information
        [Required, StringLength(255)]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required, EmailAddress, StringLength(255)]
        public string CustomerEmail { get; set; } = string.Empty;
        
        [Required, StringLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string CustomerAddress { get; set; } = string.Empty;
        
        // Booking Details
        [Required]
        public DateTime PickupDate { get; set; }
        
        [Required]
        public DateTime DropoffDate { get; set; }
        
        [StringLength(10)]
        public string PickupTime { get; set; } = string.Empty;
        
        [StringLength(10)]
        public string DropoffTime { get; set; } = string.Empty;
        
        // Location FKs
        public int? PickupLocationId { get; set; }
        public Location? PickupLocationNav { get; set; }
        
        public int? DropoffLocationId { get; set; }
        public Location? DropoffLocationNav { get; set; }
        
        // Keep string fields for backward compatibility
        [StringLength(255)]
        public string PickupLocation { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string DropoffLocation { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }
        
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // qr, cod, card, transfer
        
        [StringLength(50)]
        public string PaymentStatus { get; set; } = "pending"; // pending, completed, failed
        
        [StringLength(50)]
        public string Status { get; set; } = "pending"; // pending, confirmed, active, completed, cancelled
        
        [StringLength(1000)]
        public string SpecialRequests { get; set; } = string.Empty;
        
        public int? Rating { get; set; }
        
        [StringLength(1000)]
        public string Review { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class Payment
    {
        public int Id { get; set; }
        
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        
        [Required, StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // QR, Cash, Card, BankTransfer
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }
        
        [Required, StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Success, Failed, Cancelled
        
        [StringLength(100)]
        public string TransactionId { get; set; } = string.Empty; // Mã giao dịch từ VNPay/Bank
        
        [StringLength(500)]
        public string QRCodeUrl { get; set; } = string.Empty; // URL hoặc Base64 của QR code
        
        [StringLength(1000)]
        public string PaymentDescription { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? ExpiresAt { get; set; } // QR code expiration time
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

    public class VerificationCode
    {
        public int Id { get; set; }
        
        [Required, EmailAddress, StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required, StringLength(10)]
        public string Code { get; set; } = string.Empty;
        
        [Required, StringLength(50)]
        public string Purpose { get; set; } = string.Empty; // "registration", "password-reset"
        
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
