using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly CarRentalDbContext _db;
        public UserController(CarRentalDbContext db)
        {
            _db = db;
        }

        // Chỉ Admin và Staff được xem danh sách user
        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetAllUsers()
        {
            var users = _db.Users.Select(u => new {
                u.Id, u.Email, u.FullName, u.Phone, u.Role, u.IsEmailConfirmed, u.CreatedAt
            }).ToList();
            return Ok(users);
        }

        // Chỉ chính user hoặc Admin được sửa thông tin user
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateUser(Guid id, [FromBody] User update)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound("User không tồn tại");
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var currentRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (currentUserId != user.Id.ToString() && currentRole != "Admin")
                return Forbid("Bạn không có quyền sửa user này");
            user.FullName = update.FullName;
            user.Phone = update.Phone;
            user.UpdatedAt = DateTime.UtcNow;
            _db.SaveChanges();
            return Ok("Cập nhật user thành công");
        }

        // Chỉ Admin mới được xóa user
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(Guid id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound("User không tồn tại");
            _db.Users.Remove(user);
            _db.SaveChanges();
            return Ok("Xóa user thành công");
        }
    }
}
