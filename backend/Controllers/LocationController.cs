using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly CarRentalDbContext _context;
        private readonly ILogger<LocationController> _logger;

        public LocationController(CarRentalDbContext context, ILogger<LocationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/location
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            try
            {
                var locations = await _context.Locations
                    .Where(l => l.IsActive)
                    .OrderBy(l => l.Name)
                    .ToListAsync();
                
                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching locations");
                return StatusCode(500, new { message = "An error occurred while fetching locations" });
            }
        }

        // GET: api/location/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            try
            {
                var location = await _context.Locations.FindAsync(id);
                
                if (location == null || !location.IsActive)
                {
                    return NotFound(new { message = "Location not found" });
                }
                
                return Ok(location);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching location {LocationId}", id);
                return StatusCode(500, new { message = "An error occurred while fetching location" });
            }
        }
    }
}
