using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IFileUploadService
    {
        Task<string> UploadVehicleImageAsync(IFormFile file, int vehicleId, bool isPrimary = false);
        Task<bool> DeleteVehicleImageAsync(int imageId);
        Task<IEnumerable<VehicleImage>> GetVehicleImagesAsync(int vehicleId);
        bool IsValidImageFile(IFormFile file);
    }

    public class FileUploadService : IFileUploadService
    {
        private readonly CarRentalDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileUploadService> _logger;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public FileUploadService(CarRentalDbContext context, IWebHostEnvironment environment, ILogger<FileUploadService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<string> UploadVehicleImageAsync(IFormFile file, int vehicleId, bool isPrimary = false)
        {
            if (!IsValidImageFile(file))
            {
                throw new ArgumentException("Invalid file type or size");
            }

            // Check if vehicle exists
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
            {
                throw new ArgumentException("Vehicle not found");
            }

            // Create uploads directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "vehicles");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"{vehicleId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // If this is primary image, set all other images as not primary
            if (isPrimary)
            {
                var existingImages = await _context.VehicleImages
                    .Where(vi => vi.VehicleId == vehicleId)
                    .ToListAsync();

                foreach (var img in existingImages)
                {
                    img.IsPrimary = false;
                }
            }

            // Save to database
            var vehicleImage = new VehicleImage
            {
                VehicleId = vehicleId,
                ImagePath = $"uploads/vehicles/{fileName}",
                IsPrimary = isPrimary,
                UploadedAt = DateTime.UtcNow
            };

            _context.VehicleImages.Add(vehicleImage);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Image uploaded for vehicle {VehicleId}: {ImagePath}", vehicleId, vehicleImage.ImagePath);

            return vehicleImage.ImagePath;
        }

        public async Task<bool> DeleteVehicleImageAsync(int imageId)
        {
            var image = await _context.VehicleImages.FindAsync(imageId);
            if (image == null) return false;

            // Delete file from disk
            var filePath = Path.Combine(_environment.WebRootPath, image.ImagePath);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            // Remove from database
            _context.VehicleImages.Remove(image);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Image deleted: {ImagePath}", image.ImagePath);

            return true;
        }

        public async Task<IEnumerable<VehicleImage>> GetVehicleImagesAsync(int vehicleId)
        {
            return await _context.VehicleImages
                .Where(vi => vi.VehicleId == vehicleId)
                .OrderByDescending(vi => vi.IsPrimary)
                .ThenBy(vi => vi.UploadedAt)
                .ToListAsync();
        }

        public bool IsValidImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return false;
            if (file.Length > _maxFileSize) return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension)) return false;

            // Additional MIME type check
            var allowedMimeTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
            if (!allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant())) return false;

            return true;
        }
    }
}
