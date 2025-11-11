using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using backend.DTOs;

namespace backend.Services
{
    public interface IVNPayService
    {
        string CreatePaymentUrl(int bookingId, decimal amount, string ipAddress);
        VNPayResponse ProcessCallback(IQueryCollection queryParams);
    }

    public class VNPayService : IVNPayService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<VNPayService> _logger;

        public VNPayService(IConfiguration configuration, ILogger<VNPayService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string CreatePaymentUrl(int bookingId, decimal amount, string ipAddress)
        {
            var vnp_TmnCode = _configuration["VNPay:TmnCode"];
            var vnp_HashSecret = _configuration["VNPay:HashSecret"];
            var vnp_Url = _configuration["VNPay:Url"];
            var vnp_ReturnUrl = _configuration["VNPay:ReturnUrl"];

            if (string.IsNullOrEmpty(vnp_TmnCode) || string.IsNullOrEmpty(vnp_HashSecret))
            {
                _logger.LogError("VNPay configuration is missing");
                throw new InvalidOperationException("VNPay configuration is not properly set");
            }

            var vnpay = new VNPayLibrary();

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", ((long)(amount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan dat xe BookingId:{bookingId}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl ?? "http://localhost:3000/payment/vnpay-return");
            vnpay.AddRequestData("vnp_TxnRef", $"{bookingId}_{DateTime.Now.Ticks}");

            string paymentUrl = vnpay.CreateRequestUrl(vnp_Url ?? "", vnp_HashSecret);

            _logger.LogInformation($"Created VNPay payment URL for BookingId: {bookingId}, Amount: {amount}");

            return paymentUrl;
        }

        public VNPayResponse ProcessCallback(IQueryCollection queryParams)
        {
            var vnp_HashSecret = _configuration["VNPay:HashSecret"];
            var vnpay = new VNPayLibrary();

            foreach (var (key, value) in queryParams)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            string vnp_TxnRef = vnpay.GetResponseData("vnp_TxnRef");
            long orderId = 0;
            
            if (!string.IsNullOrEmpty(vnp_TxnRef) && vnp_TxnRef.Contains('_'))
            {
                var parts = vnp_TxnRef.Split('_');
                long.TryParse(parts[0], out orderId);
            }

            string vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            string vnp_TransactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");
            string vnp_SecureHash = queryParams["vnp_SecureHash"].ToString();
            
            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret ?? "");

            var response = new VNPayResponse
            {
                Success = checkSignature && vnp_ResponseCode == "00",
                BookingId = (int)orderId,
                TransactionId = vnpay.GetResponseData("vnp_TransactionNo"),
                Amount = Convert.ToDecimal(vnpay.GetResponseData("vnp_Amount")) / 100,
                ResponseCode = vnp_ResponseCode,
                Message = GetResponseMessage(vnp_ResponseCode)
            };

            _logger.LogInformation($"VNPay callback processed: BookingId={response.BookingId}, Success={response.Success}, Code={vnp_ResponseCode}");

            return response;
        }

        private string GetResponseMessage(string responseCode)
        {
            return responseCode switch
            {
                "00" => "Giao dịch thành công",
                "07" => "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
                "09" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
                "10" => "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
                "11" => "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
                "12" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
                "13" => "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
                "24" => "Giao dịch không thành công do: Khách hàng hủy giao dịch",
                "51" => "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
                "65" => "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
                "75" => "Ngân hàng thanh toán đang bảo trì.",
                "79" => "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.",
                _ => "Giao dịch thất bại"
            };
        }
    }

    // VNPay Library Helper Class
    public class VNPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VNPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VNPayCompare());

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var value) ? value : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            StringBuilder data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string queryString = data.ToString();
            baseUrl += "?" + queryString;
            
            string signData = queryString;
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            StringBuilder data = new StringBuilder();
            foreach (var kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value) && kv.Key != "vnp_SecureHash" && kv.Key != "vnp_SecureHashType")
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string signData = data.ToString();
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            string myChecksum = HmacSHA512(secretKey, signData);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }

    // Custom comparer for VNPay
    public class VNPayCompare : IComparer<string>
    {
        public int Compare(string? x, string? y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}
