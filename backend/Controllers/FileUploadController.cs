using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Services;
using backend.Middleware;

namespace backend.Controllers
{
    /// <summary>
    /// File upload controller for vehicle images
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;
        private readonly IAuditService _auditService;
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(
            IFileUploadService fileUploadService,
            IAuditService auditService,
            ILogger<FileUploadController> logger)
        {
            _fileUploadService = fileUploadService;
            _auditService = auditService;
            _logger = logger;
        }

        /// <summary>
        /// Upload image for a vehicle
        /// </summary>
        /// <param name="vehicleId">Vehicle ID</param>
        /// <param name="file">Image file</param>
        /// <param name="isPrimary">Set as primary image</param>
        /// <returns>Image upload result</returns>
        [HttpPost("vehicle/{vehicleId}/image")]
        [Authorize(Policy = "StaffOrAdmin")]
        [RateLimit(10, 5)] // 10 uploads per 5 minutes
        public async Task<IActionResult> UploadVehicleImage(
            int vehicleId, 
            IFormFile file, 
            [FromForm] bool isPrimary = false)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file provided" });
                }

                if (!_fileUploadService.IsValidImageFile(file))
                {
                    return BadRequest(new { message = "Invalid file type or size. Only JPG, PNG, GIF, WEBP files under 5MB are allowed" });
                }

                var imagePath = await _fileUploadService.UploadVehicleImageAsync(file, vehicleId, isPrimary);

                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _auditService.LogAsync(
                    userId,
                    "UPLOAD_IMAGE",
                    $"Uploaded image for vehicle {vehicleId}: {file.FileName}",
                    "VehicleImage",
                    vehicleId,
                    HttpContext.Connection.RemoteIpAddress?.ToString() ?? ""
                );

                _logger.LogInformation("Image uploaded for vehicle {VehicleId} by user {UserId}", vehicleId, userId);

                return Ok(new 
                { 
                    message = "Image uploaded successfully", 
                    imagePath,
                    isPrimary 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to upload image for vehicle {VehicleId}", vehicleId);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete vehicle image
        /// </summary>
        /// <param name="imageId">Image ID</param>
        /// <returns>Delete result</returns>
        [HttpDelete("vehicle/image/{imageId}")]
        [Authorize(Policy = "StaffOrAdmin")]
        public async Task<IActionResult> DeleteVehicleImage(int imageId)
        {
            try
            {
                var result = await _fileUploadService.DeleteVehicleImageAsync(imageId);
                if (!result)
                {
                    return NotFound(new { message = "Image not found" });
                }

                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _auditService.LogAsync(
                    userId,
                    "DELETE_IMAGE",
                    $"Deleted vehicle image {imageId}",
                    "VehicleImage",
                    imageId,
                    HttpContext.Connection.RemoteIpAddress?.ToString() ?? ""
                );

                _logger.LogInformation("Image {ImageId} deleted by user {UserId}", imageId, userId);

                return Ok(new { message = "Image deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete image {ImageId}", imageId);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all images for a vehicle
        /// </summary>
        /// <param name="vehicleId">Vehicle ID</param>
        /// <returns>List of vehicle images</returns>
        [HttpGet("vehicle/{vehicleId}/images")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVehicleImages(int vehicleId)
        {
            try
            {
                var images = await _fileUploadService.GetVehicleImagesAsync(vehicleId);
                return Ok(images.Select(img => new
                {
                    id = img.Id,
                    imagePath = img.ImagePath,
                    isPrimary = img.IsPrimary,
                    uploadedAt = img.UploadedAt
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get images for vehicle {VehicleId}", vehicleId);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
