using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;
        private readonly IAuditService _auditService;
        private readonly ILogger<VehiclesController> _logger;

        public VehiclesController(
            IVehicleService vehicleService,
            IAuditService auditService,
            ILogger<VehiclesController> logger)
        {
            _vehicleService = vehicleService;
            _auditService = auditService;
            _logger = logger;
        }

        /// <summary>
        /// Get all vehicles
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAllVehicles()
        {
            try
            {
                var vehicles = await _vehicleService.GetAllVehiclesAsync();
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all vehicles");
                return StatusCode(500, "Internal server error");
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
                var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
                if (vehicle == null)
                    return NotFound("Vehicle not found");

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vehicle {VehicleId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Search vehicles with filters
        /// </summary>
        [HttpPost("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> SearchVehicles(VehicleSearchDto searchDto)
        {
            try
            {
                var vehicles = await _vehicleService.SearchVehiclesAsync(searchDto);
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching vehicles");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Create a new vehicle (Admin/Staff only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<VehicleDto>> CreateVehicle(CreateVehicleDto createVehicleDto)
        {
            try
            {
                var vehicle = await _vehicleService.CreateVehicleAsync(createVehicleDto);
                
                var currentUserId = GetCurrentUserId();
                await _auditService.LogAsync(currentUserId, "VehicleCreated", $"Created vehicle {vehicle.Id}", "Vehicle", vehicle.Id);

                return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating vehicle");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update a vehicle (Admin/Staff only)</summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<VehicleDto>> UpdateVehicle(int id, UpdateVehicleDto updateVehicleDto)
        {
            try
            {
                var vehicle = await _vehicleService.UpdateVehicleAsync(id, updateVehicleDto);
                if (vehicle == null)
                    return NotFound("Vehicle not found");

                var currentUserId = GetCurrentUserId();
                await _auditService.LogAsync(currentUserId, "VehicleUpdated", $"Updated vehicle {id}", "Vehicle", id);

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating vehicle {VehicleId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a vehicle (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            try
            {
                var success = await _vehicleService.DeleteVehicleAsync(id);
                if (!success)
                    return NotFound("Vehicle not found");

                var currentUserId = GetCurrentUserId();
                await _auditService.LogAsync(currentUserId, "VehicleDeleted", $"Deleted vehicle {id}", "Vehicle", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting vehicle {VehicleId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check vehicle availability
        /// </summary>
        [HttpPost("{id}/check-availability")]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> CheckAvailability(int id, [FromBody] CheckAvailabilityDto checkDto)
        {
            try
            {
                var isAvailable = await _vehicleService.IsVehicleAvailableAsync(id, checkDto.StartDate, checkDto.EndDate);
                return Ok(new { IsAvailable = isAvailable });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking availability for vehicle {VehicleId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
    }

    public class CheckAvailabilityDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
