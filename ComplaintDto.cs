using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int? BookingId { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Resolution { get; set; } = string.Empty;
        public int? AssignedToId { get; set; }
        public string AssignedToName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class CreateComplaintDto
    {
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required, StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        public int? BookingId { get; set; }

        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [StringLength(20)]
        public string Priority { get; set; } = "Medium";
    }

    public class UpdateComplaintDto
    {
        [StringLength(200)]
        public string? Subject { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(20)]
        public string? Priority { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        [StringLength(2000)]
        public string? Resolution { get; set; }

        public int? AssignedToId { get; set; }
    }

    public class ComplaintResponseDto
    {
        public int Id { get; set; }
        public int ComplaintId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsStaffResponse { get; set; }
    }

    public class CreateComplaintResponseDto
    {
        [Required, StringLength(1000)]
        public string Message { get; set; } = string.Empty;
    }
}