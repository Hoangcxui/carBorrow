using backend.Models;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId);
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto createBookingDto);
        Task<BookingDto?> UpdateBookingAsync(int id, UpdateBookingDto updateBookingDto);
        Task<bool> UpdateBookingStatusAsync(int id, BookingStatusDto statusDto);
        Task<bool> CancelBookingAsync(int id, string reason);
        Task<decimal> CalculateTotalCostAsync(int vehicleId, DateTime startDate, DateTime endDate);
    }

    public class BookingService : IBookingService
    {
        private readonly CarRentalDbContext _context;
        private readonly IAuditService _auditService;

        public BookingService(CarRentalDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = $"{b.User.FirstName} {b.User.LastName}",
                    UserEmail = b.User.Email,
                    VehicleId = b.VehicleId,
                    VehicleMake = b.Vehicle.Make,
                    VehicleModel = b.Vehicle.Model,
                    VehicleYear = b.Vehicle.Year,
                    VehicleLicensePlate = b.Vehicle.LicensePlate,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    PickupLocation = b.PickupLocation,
                    ReturnLocation = b.ReturnLocation,
                    TotalCost = b.TotalCost,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings;
        }

        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Vehicle)
                .Where(b => b.UserId == userId)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    VehicleId = b.VehicleId,
                    VehicleMake = b.Vehicle.Make,
                    VehicleModel = b.Vehicle.Model,
                    VehicleYear = b.Vehicle.Year,
                    VehicleLicensePlate = b.Vehicle.LicensePlate,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    PickupLocation = b.PickupLocation,
                    ReturnLocation = b.ReturnLocation,
                    TotalCost = b.TotalCost,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings;
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .Where(b => b.Id == id)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = $"{b.User.FirstName} {b.User.LastName}",
                    UserEmail = b.User.Email,
                    VehicleId = b.VehicleId,
                    VehicleMake = b.Vehicle.Make,
                    VehicleModel = b.Vehicle.Model,
                    VehicleYear = b.Vehicle.Year,
                    VehicleLicensePlate = b.Vehicle.LicensePlate,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    PickupLocation = b.PickupLocation,
                    ReturnLocation = b.ReturnLocation,
                    TotalCost = b.TotalCost,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return booking;
        }

        public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto createBookingDto)
        {
            // Validate vehicle availability
            var isAvailable = await IsVehicleAvailableAsync(createBookingDto.VehicleId, createBookingDto.StartDate, createBookingDto.EndDate);
            if (!isAvailable)
                throw new InvalidOperationException("Vehicle is not available for the selected dates");

            // Calculate total cost
            var totalCost = await CalculateTotalCostAsync(createBookingDto.VehicleId, createBookingDto.StartDate, createBookingDto.EndDate);

            var booking = new Booking
            {
                UserId = userId,
                VehicleId = createBookingDto.VehicleId,
                StartDate = createBookingDto.StartDate,
                EndDate = createBookingDto.EndDate,
                PickupLocation = createBookingDto.PickupLocation,
                ReturnLocation = createBookingDto.ReturnLocation ?? createBookingDto.PickupLocation,
                TotalCost = totalCost,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return await GetBookingByIdAsync(booking.Id) ?? throw new InvalidOperationException("Failed to retrieve created booking");
        }

        public async Task<BookingDto?> UpdateBookingAsync(int id, UpdateBookingDto updateBookingDto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return null;

            // Only allow updates for pending bookings
            if (booking.Status != "Pending")
                throw new InvalidOperationException("Cannot update booking that is not in pending status");

            var recalculateTotal = false;

            // Update only provided fields
            if (updateBookingDto.StartDate.HasValue)
            {
                booking.StartDate = updateBookingDto.StartDate.Value;
                recalculateTotal = true;
            }

            if (updateBookingDto.EndDate.HasValue)
            {
                booking.EndDate = updateBookingDto.EndDate.Value;
                recalculateTotal = true;
            }

            if (updateBookingDto.PickupLocation != null)
                booking.PickupLocation = updateBookingDto.PickupLocation;

            if (updateBookingDto.ReturnLocation != null)
                booking.ReturnLocation = updateBookingDto.ReturnLocation;

            // Recalculate total if dates changed
            if (recalculateTotal)
            {
                var isAvailable = await IsVehicleAvailableAsync(booking.VehicleId, booking.StartDate, booking.EndDate, booking.Id);
                if (!isAvailable)
                    throw new InvalidOperationException("Vehicle is not available for the updated dates");

                booking.TotalCost = await CalculateTotalCostAsync(booking.VehicleId, booking.StartDate, booking.EndDate);
            }

            booking.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetBookingByIdAsync(id);
        }

        public async Task<bool> UpdateBookingStatusAsync(int id, BookingStatusDto statusDto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return false;

            var oldStatus = booking.Status;
            booking.Status = statusDto.Status;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log the status change
            await _auditService.LogAsync(booking.UserId, "BookingStatusChanged", 
                $"Booking {id} status changed from {oldStatus} to {statusDto.Status}. Reason: {statusDto.Reason}", "Booking", id);

            return true;
        }

        public async Task<bool> CancelBookingAsync(int id, string reason)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return false;

            // Only allow cancellation for certain statuses
            if (booking.Status == "Completed" || booking.Status == "Cancelled")
                return false;

            booking.Status = "Cancelled";
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log the cancellation
            await _auditService.LogAsync(booking.UserId, "BookingCancelled", 
                $"Booking {id} cancelled. Reason: {reason}", "Booking", id);

            return true;
        }

        public async Task<decimal> CalculateTotalCostAsync(int vehicleId, DateTime startDate, DateTime endDate)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
                throw new InvalidOperationException("Vehicle not found");

            var days = (int)Math.Ceiling((endDate - startDate).TotalDays);
            if (days <= 0)
                throw new InvalidOperationException("Invalid date range");

            return vehicle.DailyRate * days;
        }

        private async Task<bool> IsVehicleAvailableAsync(int vehicleId, DateTime startDate, DateTime endDate, int? excludeBookingId = null)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null || vehicle.IsDeleted || vehicle.Status != "Available")
                return false;

            var query = _context.Bookings.Where(b =>
                b.VehicleId == vehicleId &&
                b.Status != "Cancelled" &&
                b.StartDate < endDate &&
                b.EndDate > startDate);

            if (excludeBookingId.HasValue)
                query = query.Where(b => b.Id != excludeBookingId.Value);

            var hasConflictingBooking = await query.AnyAsync();

            return !hasConflictingBooking;
        }
    }
}