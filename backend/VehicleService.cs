using backend.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.DTOs;

namespace backend.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync();
        Task<VehicleDto?> GetVehicleByIdAsync(int id);
        Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto);
        Task<VehicleDto?> UpdateVehicleAsync(int id, UpdateVehicleDto updateVehicleDto);
        Task<bool> DeleteVehicleAsync(int id);
        Task<IEnumerable<VehicleDto>> SearchVehiclesAsync(VehicleSearchDto searchVehicleDto);
        Task<IEnumerable<VehicleDto>> GetAvailableVehiclesAsync();
        Task<IEnumerable<VehicleDto>> GetVehiclesByCategoryAsync(int categoryId);
        Task<bool> IsVehicleAvailableAsync(int vehicleId, DateTime startDate, DateTime endDate);
    }

    public class VehicleService : IVehicleService
    {
        private readonly CarRentalDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<VehicleService> _logger;

        public VehicleService(CarRentalDbContext context, IMapper mapper, ILogger<VehicleService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Category)
                .Include(v => v.Bookings)
                .Where(v => !v.IsDeleted)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    Color = v.Color,
                    LicensePlate = v.LicensePlate,
                    DailyRate = v.DailyRate,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelType = v.FuelType,
                    Mileage = (int)v.Mileage,
                    Features = v.Features,
                    Status = v.Status,
                    Description = v.Description,
                    ImageUrl = v.ImageUrl,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category.Name,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    IsAvailable = v.Status == "Available",
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0),
                    TotalBookings = v.Bookings.Count(b => b.Status == "Completed")
                })
                .ToListAsync();

            return vehicles;
        }

        public async Task<VehicleDto?> GetVehicleByIdAsync(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Category)
                .Include(v => v.Bookings)
                .Where(v => v.Id == id && !v.IsDeleted)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    Color = v.Color,
                    LicensePlate = v.LicensePlate,
                    DailyRate = v.DailyRate,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelType = v.FuelType,
                    Mileage = (int)v.Mileage,
                    Features = v.Features,
                    Status = v.Status,
                    Description = v.Description,
                    ImageUrl = v.ImageUrl,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category.Name,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    IsAvailable = v.Status == "Available",
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0),
                    TotalBookings = v.Bookings.Count(b => b.Status == "Completed")
                })
                .FirstOrDefaultAsync();

            return vehicle;
        }

        public async Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto)
        {
            var vehicle = _mapper.Map<Vehicle>(createVehicleDto);
            vehicle.CreatedAt = DateTime.UtcNow;
            vehicle.UpdatedAt = DateTime.UtcNow;
            vehicle.IsDeleted = false;
            vehicle.Status = "Available";

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return new VehicleDto
            {
                Id = vehicle.Id,
                Make = vehicle.Make,
                Model = vehicle.Model,
                Year = vehicle.Year,
                Color = vehicle.Color,
                LicensePlate = vehicle.LicensePlate,
                DailyRate = vehicle.DailyRate,
                Seats = vehicle.Seats,
                Transmission = vehicle.Transmission,
                FuelType = vehicle.FuelType,
                Mileage = (int)vehicle.Mileage,
                Features = vehicle.Features,
                Status = vehicle.Status,
                Description = vehicle.Description,
                ImageUrl = vehicle.ImageUrl,
                CategoryId = vehicle.CategoryId,
                CreatedAt = vehicle.CreatedAt,
                UpdatedAt = vehicle.UpdatedAt,
                IsAvailable = true,
                AverageRating = 0,
                TotalBookings = 0
            };
        }

        public async Task<VehicleDto?> UpdateVehicleAsync(int id, UpdateVehicleDto updateVehicleDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null || vehicle.IsDeleted)
            {
                return null;
            }

            _mapper.Map(updateVehicleDto, vehicle);
            vehicle.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetVehicleByIdAsync(id);
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null || vehicle.IsDeleted)
            {
                return false;
            }

            vehicle.IsDeleted = true;
            vehicle.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<VehicleDto>> SearchVehiclesAsync(VehicleSearchDto searchVehicleDto)
        {
            var query = _context.Vehicles
                .Include(v => v.Category)
                .Include(v => v.Bookings)
                .Where(v => !v.IsDeleted);

            if (!string.IsNullOrEmpty(searchVehicleDto.Make))
            {
                query = query.Where(v => v.Make.Contains(searchVehicleDto.Make));
            }

            if (!string.IsNullOrEmpty(searchVehicleDto.Model))
            {
                query = query.Where(v => v.Model.Contains(searchVehicleDto.Model));
            }

            if (searchVehicleDto.CategoryId.HasValue)
            {
                query = query.Where(v => v.CategoryId == searchVehicleDto.CategoryId.Value);
            }

            if (searchVehicleDto.MinPrice.HasValue)
            {
                query = query.Where(v => v.DailyRate >= searchVehicleDto.MinPrice.Value);
            }

            if (searchVehicleDto.MaxPrice.HasValue)
            {
                query = query.Where(v => v.DailyRate <= searchVehicleDto.MaxPrice.Value);
            }

            if (searchVehicleDto.MinSeats.HasValue)
            {
                query = query.Where(v => v.Seats >= searchVehicleDto.MinSeats.Value);
            }

            if (!string.IsNullOrEmpty(searchVehicleDto.Transmission))
            {
                query = query.Where(v => v.Transmission == searchVehicleDto.Transmission);
            }

            if (!string.IsNullOrEmpty(searchVehicleDto.FuelType))
            {
                query = query.Where(v => v.FuelType == searchVehicleDto.FuelType);
            }

            var vehicles = await query
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    Color = v.Color,
                    LicensePlate = v.LicensePlate,
                    DailyRate = v.DailyRate,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelType = v.FuelType,
                    Mileage = (int)v.Mileage,
                    Features = v.Features,
                    Status = v.Status,
                    Description = v.Description,
                    ImageUrl = v.ImageUrl,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category.Name,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    IsAvailable = v.Status == "Available",
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0),
                    TotalBookings = v.Bookings.Count(b => b.Status == "Completed")
                })
                .ToListAsync();

            return vehicles;
        }

        public async Task<IEnumerable<VehicleDto>> GetAvailableVehiclesAsync()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Category)
                .Include(v => v.Bookings)
                .Where(v => !v.IsDeleted && v.Status == "Available")
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    Color = v.Color,
                    LicensePlate = v.LicensePlate,
                    DailyRate = v.DailyRate,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelType = v.FuelType,
                    Mileage = (int)v.Mileage,
                    Features = v.Features,
                    Status = v.Status,
                    Description = v.Description,
                    ImageUrl = v.ImageUrl,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category.Name,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    IsAvailable = true,
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0),
                    TotalBookings = v.Bookings.Count(b => b.Status == "Completed")
                })
                .ToListAsync();

            return vehicles;
        }

        public async Task<IEnumerable<VehicleDto>> GetVehiclesByCategoryAsync(int categoryId)
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Category)
                .Include(v => v.Bookings)
                .Where(v => !v.IsDeleted && v.CategoryId == categoryId)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    Color = v.Color,
                    LicensePlate = v.LicensePlate,
                    DailyRate = v.DailyRate,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelType = v.FuelType,
                    Mileage = (int)v.Mileage,
                    Features = v.Features,
                    Status = v.Status,
                    Description = v.Description,
                    ImageUrl = v.ImageUrl,
                    CategoryId = v.CategoryId,
                    CategoryName = v.Category.Name,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    IsAvailable = v.Status == "Available",
                    AverageRating = (decimal)(v.Bookings.Where(b => b.Rating.HasValue).Average(b => (double?)b.Rating) ?? 0),
                    TotalBookings = v.Bookings.Count(b => b.Status == "Completed")
                })
                .ToListAsync();

            return vehicles;
        }

        public async Task<bool> IsVehicleAvailableAsync(int vehicleId, DateTime startDate, DateTime endDate)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null || vehicle.IsDeleted || vehicle.Status != "Available")
            {
                return false;
            }

            // Check if there are any conflicting bookings
            var conflictingBookings = await _context.Bookings
                .Where(b => b.VehicleId == vehicleId && 
                           b.Status != "Cancelled" && 
                           b.Status != "Completed" &&
                           ((b.StartDate <= startDate && b.EndDate >= startDate) || 
                            (b.StartDate <= endDate && b.EndDate >= endDate) ||
                            (b.StartDate >= startDate && b.EndDate <= endDate)))
                .AnyAsync();

            return !conflictingBookings;
        }
    }
}