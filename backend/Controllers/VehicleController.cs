using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly CarRentalDbContext _context;
        private readonly ILogger<VehicleController> _logger;

        public VehicleController(CarRentalDbContext context, ILogger<VehicleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all vehicles with optional filtering
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetVehicles(
            [FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Vehicles
                    .Include(v => v.Category)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(v => 
                        v.Make.Contains(search) || 
                        v.Model.Contains(search) ||
                        v.LicensePlate.Contains(search));
                }

                if (categoryId.HasValue)
                {
                    query = query.Where(v => v.CategoryId == categoryId.Value);
                }

                if (minPrice.HasValue)
                {
                    query = query.Where(v => v.DailyRate >= minPrice.Value);
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(v => v.DailyRate <= maxPrice.Value);
                }

                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(v => v.Status == status);
                }

                // Pagination
                var totalCount = await query.CountAsync();
                var vehicles = await query
                    .OrderBy(v => v.Make)
                    .ThenBy(v => v.Model)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(v => new VehicleDto
                    {
                        Id = v.Id,
                        Make = v.Make,
                        Model = v.Model,
                        Year = v.Year,
                        Color = v.Color,
                        LicensePlate = v.LicensePlate,
                        DailyRate = v.DailyRate,
                        IsAvailable = v.Status == "Available",
                        CategoryId = v.CategoryId,
                        CategoryName = v.Category.Name,
                        Seats = v.Seats,
                        Transmission = v.Transmission,
                        FuelType = v.FuelType,
                        Mileage = v.Mileage,
                        Features = v.Features,
                        Status = v.Status,
                        Description = v.Description,
                        ImageUrl = v.ImageUrl,
                        CreatedAt = v.CreatedAt,
                        UpdatedAt = v.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = vehicles,
                    page,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicles");
                return StatusCode(500, new { message = "An error occurred while fetching vehicles" });
            }
        }

        /// <summary>
        /// Get vehicle by ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<VehicleDto>> GetVehicle(int id)
        {
            try
            {
                var vehicle = await _context.Vehicles
                    .Include(v => v.Category)
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                var vehicleDto = new VehicleDto
                {
                    Id = vehicle.Id,
                    Make = vehicle.Make,
                    Model = vehicle.Model,
                    Year = vehicle.Year,
                    Color = vehicle.Color,
                    LicensePlate = vehicle.LicensePlate,
                    DailyRate = vehicle.DailyRate,
                    IsAvailable = vehicle.Status == "Available",
                    CategoryId = vehicle.CategoryId,
                    CategoryName = vehicle.Category.Name,
                    Seats = vehicle.Seats,
                    Transmission = vehicle.Transmission,
                    FuelType = vehicle.FuelType,
                    Mileage = vehicle.Mileage,
                    Features = vehicle.Features,
                    Status = vehicle.Status,
                    Description = vehicle.Description,
                    ImageUrl = vehicle.ImageUrl,
                    CreatedAt = vehicle.CreatedAt,
                    UpdatedAt = vehicle.UpdatedAt
                };

                return Ok(vehicleDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle {VehicleId}", id);
                return StatusCode(500, new { message = "An error occurred while fetching vehicle" });
            }
        }

        /// <summary>
        /// Get vehicle categories
        /// </summary>
        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching categories");
                return StatusCode(500, new { message = "An error occurred while fetching categories" });
            }
        }

        /// <summary>
        /// Check vehicle availability
        /// </summary>
        [HttpPost("check-availability")]
        [AllowAnonymous]
        public async Task<ActionResult> CheckAvailability([FromBody] CheckAvailabilityDto dto)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(dto.VehicleId);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                // Check if vehicle has any conflicting bookings
                var hasConflict = await _context.Bookings
                    .AnyAsync(b => 
                        b.VehicleId == dto.VehicleId &&
                        b.Status != "Cancelled" &&
                        b.Status != "Completed" &&
                        (
                            (b.PickupDate <= dto.StartDate && b.DropoffDate >= dto.StartDate) ||
                            (b.PickupDate <= dto.EndDate && b.DropoffDate >= dto.EndDate) ||
                            (b.PickupDate >= dto.StartDate && b.DropoffDate <= dto.EndDate)
                        )
                    );

                return Ok(new
                {
                    isAvailable = !hasConflict && vehicle.Status == "Available",
                    vehicleStatus = vehicle.Status
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking availability");
                return StatusCode(500, new { message = "An error occurred while checking availability" });
            }
        }

        /// <summary>
        /// Get featured vehicles
        /// </summary>
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetFeaturedVehicles()
        {
            try
            {
                var vehicles = await _context.Vehicles
                    .Include(v => v.Category)
                    .Where(v => v.Status == "Available")
                    .OrderByDescending(v => v.CreatedAt)
                    .Take(6)
                    .Select(v => new VehicleDto
                    {
                        Id = v.Id,
                        Make = v.Make,
                        Model = v.Model,
                        Year = v.Year,
                        Color = v.Color,
                        LicensePlate = v.LicensePlate,
                        DailyRate = v.DailyRate,
                        IsAvailable = v.Status == "Available",
                        CategoryId = v.CategoryId,
                        CategoryName = v.Category.Name,
                        Seats = v.Seats,
                        Transmission = v.Transmission,
                        FuelType = v.FuelType,
                        Mileage = v.Mileage,
                        Features = v.Features,
                        Status = v.Status,
                        Description = v.Description,
                        ImageUrl = v.ImageUrl,
                        CreatedAt = v.CreatedAt,
                        UpdatedAt = v.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching featured vehicles");
                return StatusCode(500, new { message = "An error occurred while fetching featured vehicles" });
            }
        }
    }

    public class CheckAvailabilityDto
    {
        public int VehicleId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
