using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreatePaymentRequest
    {
        [Required]
        public int BookingId { get; set; }
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string QRCodeUrl { get; set; } = string.Empty;
        public string PaymentDescription { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }

    public class CreatePaymentResponse
    {
        public int PaymentId { get; set; }
        public string QRCodeUrl { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string PaymentDescription { get; set; } = string.Empty;
    }

    public class VNPayResponse
    {
        public bool Success { get; set; }
        public int BookingId { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string ResponseCode { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class ConfirmPaymentRequest
    {
        [Required]
        public int PaymentId { get; set; }
        
        [StringLength(100)]
        public string TransactionId { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}
