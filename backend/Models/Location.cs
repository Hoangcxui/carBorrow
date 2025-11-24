using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Location
    {
        public int Id { get; set; }
        
        [Required, StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required, StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public double Latitude { get; set; }
        
        [Required]
        public double Longitude { get; set; }
        
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<Booking> PickupBookings { get; set; } = new List<Booking>();
        public ICollection<Booking> ReturnBookings { get; set; } = new List<Booking>();
    }
}
