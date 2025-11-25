using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly CarRentalDbContext _context;

        public BookingController(CarRentalDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Create a new booking
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            try
            {
                // Parse dates from string to DateTime
                DateTime.TryParse(dto.PickupDate, out var pickupDate);
                DateTime.TryParse(dto.DropoffDate, out var dropoffDate);

                var booking = new Booking
                {
                    VehicleId = dto.VehicleId,
                    CustomerName = dto.CustomerName ?? "",
                    CustomerEmail = dto.CustomerEmail ?? "",
                    CustomerPhone = dto.CustomerPhone ?? "",
                    CustomerAddress = dto.CustomerAddress ?? "",
                    PickupDate = pickupDate,
                    DropoffDate = dropoffDate,
                    PickupTime = dto.PickupTime,
                    DropoffTime = dto.DropoffTime,
                    PickupLocationId = dto.PickupLocationId,
                    DropoffLocationId = dto.DropoffLocationId,
                    PickupLocation = dto.PickupLocation ?? "",
                    DropoffLocation = dto.DropoffLocation ?? "",
                    TotalAmount = dto.TotalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    Status = "pending",
                    PaymentStatus = "pending",
                    SpecialRequests = dto.SpecialRequests,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    bookingId = booking.Id, 
                    message = "Booking created successfully" 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get all bookings (admin only)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]  // Temporary for testing
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = _context.Bookings
                    .OrderByDescending(b => b.CreatedAt)
                    .ToList();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get booking by ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookingById(int id)
        {
            try
            {
                var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get bookings by customer email
        /// </summary>
        [HttpGet("customer/{email}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookingsByCustomer(string email)
        {
            try
            {
                var bookings = _context.Bookings
                    .Where(b => b.CustomerEmail == email)
                    .OrderByDescending(b => b.CreatedAt)
                    .ToList();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update booking status (admin only)
        /// </summary>
        [HttpPut("{id}/status")]
        [AllowAnonymous]  // Temporary for testing
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
        {
            try
            {
                var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                if (!string.IsNullOrEmpty(dto.Status))
                    booking.Status = dto.Status;
                    
                if (!string.IsNullOrEmpty(dto.PaymentStatus))
                    booking.PaymentStatus = dto.PaymentStatus;
                    
                booking.UpdatedAt = DateTime.UtcNow;

                _context.Bookings.Update(booking);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Booking updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Cancel booking
        /// </summary>
        [HttpPut("{id}/cancel")]
        [AllowAnonymous]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                booking.Status = "cancelled";
                booking.UpdatedAt = DateTime.UtcNow;

                _context.Bookings.Update(booking);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Booking cancelled successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    public class BookingCreateDto
    {
        public int VehicleId { get; set; }
        
        // Direct customer fields (for flat JSON structure)
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        
        // Nested customer object (for nested JSON structure) - optional
        public CustomerInfoDto? CustomerInfo { get; set; }
        
        public string? PickupDate { get; set; }
        public string? DropoffDate { get; set; }
        public string? PickupTime { get; set; }
        public string? DropoffTime { get; set; }
        
        // Location IDs (new)
        public int? PickupLocationId { get; set; }
        public int? DropoffLocationId { get; set; }
        
        // Location strings (backward compatibility)
        public string? PickupLocation { get; set; }
        public string? DropoffLocation { get; set; }
        
        public decimal TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? SpecialRequests { get; set; }
    }

    public class CustomerInfoDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class UpdateBookingStatusDto
    {
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
    }
}
