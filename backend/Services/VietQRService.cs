using backend.DTOs;

namespace backend.Services
{
    /// <summary>
    /// VietQR Service - Tạo QR code chuyển khoản ngân hàng không cần merchant
    /// Sử dụng API miễn phí từ vietqr.io
    /// </summary>
    public interface IVietQRService
    {
        Task<VietQRPaymentResponse> GenerateQRCode(int bookingId, decimal amount, string bankCode, string accountNumber, string accountName);
    }

    public class VietQRService : IVietQRService
    {
        private readonly ILogger<VietQRService> _logger;
        private readonly IConfiguration _configuration;

        public VietQRService(ILogger<VietQRService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Tạo QR code chuyển khoản ngân hàng (VietQR)
        /// </summary>
        public async Task<VietQRPaymentResponse> GenerateQRCode(
            int bookingId, 
            decimal amount, 
            string bankCode, 
            string accountNumber, 
            string accountName)
        {
            try
            {
                // Nội dung chuyển khoản - QUAN TRỌNG để đối soát
                var description = $"CARBORROW {bookingId}";
                
                // Template: compact2 (đẹp, rõ ràng), có thể dùng: compact, print, qr_only
                var template = "compact2";
                
                // API miễn phí từ vietqr.io - không cần key
                var qrUrl = $"https://img.vietqr.io/image/{bankCode}-{accountNumber}-{template}.png" +
                           $"?amount={amount}" +
                           $"&addInfo={Uri.EscapeDataString(description)}" +
                           $"&accountName={Uri.EscapeDataString(accountName)}";

                _logger.LogInformation($"Generated VietQR for BookingId: {bookingId}, Amount: {amount}, Bank: {bankCode}");

                return new VietQRPaymentResponse
                {
                    Success = true,
                    QRCodeUrl = qrUrl,
                    Amount = amount,
                    BankCode = bankCode,
                    AccountNumber = accountNumber,
                    AccountName = accountName,
                    Description = description,
                    Message = "Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating VietQR for BookingId: {bookingId}");
                return new VietQRPaymentResponse
                {
                    Success = false,
                    Message = "Không thể tạo mã QR. Vui lòng thử lại."
                };
            }
        }

        /// <summary>
        /// Danh sách các ngân hàng hỗ trợ VietQR
        /// </summary>
        public static Dictionary<string, string> GetSupportedBanks()
        {
            return new Dictionary<string, string>
            {
                { "970422", "MB Bank (MBBank)" },
                { "970436", "Vietcombank (VCB)" },
                { "970407", "Techcombank (TCB)" },
                { "970416", "ACB" },
                { "970415", "Vietinbank (VTB)" },
                { "970432", "VPBank" },
                { "970423", "TPBank" },
                { "970403", "Sacombank (STB)" },
                { "970448", "OCB" },
                { "970405", "Agribank" },
                { "970406", "DongA Bank" },
                { "970408", "GPBank" },
                { "970410", "BacA Bank" },
                { "970412", "PVcomBank" },
                { "970414", "Oceanbank" },
                { "970418", "BIDV" },
                { "970419", "NCB" },
                { "970422", "MB" },
                { "970426", "MSB" },
                { "970427", "VAB" },
                { "970428", "Nam A Bank" },
                { "970429", "SCB" },
                { "970437", "HDBank" },
                { "970438", "BaoViet Bank" },
                { "970440", "SeABank" },
                { "970441", "VIB" },
                { "970443", "SHB" },
                { "970449", "LienVietPostBank" },
                { "970454", "VCCB" },
                { "970458", "UOB Vietnam" },
                { "970457", "Woori Bank" }
            };
        }
    }

    /// <summary>
    /// Response từ VietQR service
    /// </summary>
    public class VietQRPaymentResponse
    {
        public bool Success { get; set; }
        public string QRCodeUrl { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string BankCode { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
