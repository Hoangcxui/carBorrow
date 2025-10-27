using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IAuditService _auditService;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(
            IBookingService bookingService, 
            IAuditService auditService,
            ILogger<BookingsController> logger)
        {
            _bookingService = bookingService;
            _auditService = auditService;
            _logger = logger;
        }

        /// <summary>
        /// Get all bookings (Admin/Staff only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all bookings");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get current user's bookings
        /// </summary>
        [HttpGet("my-bookings")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings()
        {
            try
            {
                var userId = GetCurrentUserId();
                var bookings = await _bookingService.GetUserBookingsAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user bookings for user {UserId}", GetCurrentUserId());
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get bookings for a specific user (Admin/Staff only)
        /// </summary>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetUserBookings(int userId)
        {
            try
            {
                var bookings = await _bookingService.GetUserBookingsAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bookings for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get booking by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            try
            {
                var booking = await _bookingService.GetBookingByIdAsync(id);
                if (booking == null)
                    return NotFound("Booking not found");

                var currentUserId = GetCurrentUserId();
                var currentUserRole = GetCurrentUserRole();

                // Users can only see their own bookings, Admin/Staff can see all
                if (booking.UserId != currentUserId && !IsAdminOrStaff(currentUserRole))
                    return Forbid();

                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving booking {BookingId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Create a new booking
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto createBookingDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var booking = await _bookingService.CreateBookingAsync(userId, createBookingDto);

                await _auditService.LogAsync(userId, "BookingCreated", $"Created booking {booking.Id}", "Booking", booking.Id);

                return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking for user {UserId}", GetCurrentUserId());
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update a booking (only pending bookings)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<BookingDto>> UpdateBooking(int id, UpdateBookingDto updateBookingDto)
        {
            try
            {
                var existingBooking = await _bookingService.GetBookingByIdAsync(id);
                if (existingBooking == null)
                    return NotFound("Booking not found");

                var currentUserId = GetCurrentUserId();
                var currentUserRole = GetCurrentUserRole();

                // Users can only update their own bookings, Admin/Staff can update any
                if (existingBooking.UserId != currentUserId && !IsAdminOrStaff(currentUserRole))
                    return Forbid();

                var updatedBooking = await _bookingService.UpdateBookingAsync(id, updateBookingDto);
                if (updatedBooking == null)
                    return NotFound("Booking not found");

                await _auditService.LogAsync(currentUserId, "BookingUpdated", $"Updated booking {id}", "Booking", id);

                return Ok(updatedBooking);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating booking {BookingId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update booking status (Admin/Staff only)
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateBookingStatus(int id, BookingStatusDto statusDto)
        {
            try
            {
                var success = await _bookingService.UpdateBookingStatusAsync(id, statusDto);
                if (!success)
                    return NotFound("Booking not found");

                var currentUserId = GetCurrentUserId();
                await _auditService.LogAsync(currentUserId, "BookingStatusUpdated", 
                    $"Updated booking {id} status to {statusDto.Status}. Reason: {statusDto.Reason}", "Booking", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating booking status for booking {BookingId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Cancel a booking
        /// </summary>
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id, [FromBody] string reason = "")
        {
            try
            {
                var existingBooking = await _bookingService.GetBookingByIdAsync(id);
                if (existingBooking == null)
                    return NotFound("Booking not found");

                var currentUserId = GetCurrentUserId();
                var currentUserRole = GetCurrentUserRole();

                // Users can only cancel their own bookings, Admin/Staff can cancel any
                if (existingBooking.UserId != currentUserId && !IsAdminOrStaff(currentUserRole))
                    return Forbid();

                var success = await _bookingService.CancelBookingAsync(id, reason);
                if (!success)
                    return BadRequest("Cannot cancel this booking");

                await _auditService.LogAsync(currentUserId, "BookingCancelled", 
                    $"Cancelled booking {id}. Reason: {reason}", "Booking", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling booking {BookingId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Calculate booking cost
        /// </summary>
        [HttpPost("calculate-cost")]
        [AllowAnonymous]
        public async Task<ActionResult<decimal>> CalculateBookingCost([FromBody] CalculateCostDto calculateCostDto)
        {
            try
            {
                var totalCost = await _bookingService.CalculateTotalCostAsync(
                    calculateCostDto.VehicleId, 
                    calculateCostDto.StartDate, 
                    calculateCostDto.EndDate);

                return Ok(new { TotalCost = totalCost });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating cost for vehicle {VehicleId}", calculateCostDto.VehicleId);
                return StatusCode(500, "Internal server error");
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? "";
        }

        private bool IsAdminOrStaff(string role)
        {
            return role == "Admin" || role == "Staff";
        }
    }

    public class CalculateCostDto
    {
        public int VehicleId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}