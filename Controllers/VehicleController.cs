using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly CarRentalDbContext _db;
        public VehicleController(CarRentalDbContext db)
        {
            _db = db;
        }

        // Lấy danh sách xe
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var vehicles = _db.Vehicles.Select(v => new {
                v.Id, v.Make, v.Model, v.Year, v.Type, v.Seats, v.Transmission, v.FuelType, v.PricePerDay, v.Status, v.Description, v.CreatedAt
            }).ToList();
            return Ok(vehicles);
        }

        // Xem chi tiết xe
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(Guid id)
        {
            var v = _db.Vehicles.Find(id);
            if (v == null) return NotFound("Xe không tồn tại");
            return Ok(v);
        }

        // Thêm xe mới (Admin, Staff)
        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult Create([FromBody] Vehicle vehicle)
        {
            vehicle.Id = Guid.NewGuid();
            vehicle.CreatedAt = DateTime.UtcNow;
            _db.Vehicles.Add(vehicle);
            _db.SaveChanges();
            return Ok(vehicle);
        }

        // Cập nhật thông tin xe (Admin, Staff)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult Update(Guid id, [FromBody] Vehicle update)
        {
            var v = _db.Vehicles.Find(id);
            if (v == null) return NotFound("Xe không tồn tại");
            v.Make = update.Make;
            v.Model = update.Model;
            v.Year = update.Year;
            v.Type = update.Type;
            v.Seats = update.Seats;
            v.Transmission = update.Transmission;
            v.FuelType = update.FuelType;
            v.PricePerDay = update.PricePerDay;
            v.Status = update.Status;
            v.Description = update.Description;
            v.CreatedAt = v.CreatedAt;
            _db.SaveChanges();
            return Ok(v);
        }

        // Xóa xe (chỉ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(Guid id)
        {
            var v = _db.Vehicles.Find(id);
            if (v == null) return NotFound("Xe không tồn tại");
            _db.Vehicles.Remove(v);
            _db.SaveChanges();
            return Ok("Xóa xe thành công");
        }
    }
}
