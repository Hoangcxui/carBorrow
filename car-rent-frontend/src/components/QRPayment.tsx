'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface QRPaymentProps {
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PaymentResponse {
  paymentId: number;
  qrCodeUrl: string;
  paymentUrl: string;
  amount: number;
  expiresAt: string;
  paymentDescription: string;
}

export default function QRPayment({ bookingId, amount, onSuccess, onCancel }: QRPaymentProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [paymentDescription, setPaymentDescription] = useState<string>('');

  useEffect(() => {
    generateQRCode();
  }, [bookingId]);

  useEffect(() => {
    if (expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          setError('Mã QR đã hết hạn. Vui lòng tạo mã mới.');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const generateQRCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Vui lòng đăng nhập để thanh toán');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/payment/create-qr-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo mã QR thanh toán');
      }

      const data: PaymentResponse = await response.json();
      setQrCode(data.qrCodeUrl);
      setPaymentUrl(data.paymentUrl);
      setExpiresAt(new Date(data.expiresAt));
      setPaymentDescription(data.paymentDescription);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Thanh toán QR Code</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang tạo mã QR...</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-center">{error}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Đóng
              </button>
              <button
                onClick={generateQRCode}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Mã đơn hàng:</span>
                <span className="font-semibold text-gray-800">#{bookingId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Số tiền:</span>
                <span className="font-bold text-blue-600 text-xl">
                  {amount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              {paymentDescription && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-gray-600">{paymentDescription}</p>
                </div>
              )}
              {timeRemaining > 0 && (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-200">
                  <span className="text-gray-600 text-sm">Thời gian còn lại:</span>
                  <span className={`font-semibold ${timeRemaining < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                    ⏱️ {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>

            {qrCode && (
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="border-4 border-gray-200 rounded-lg p-3 bg-white shadow-md">
                    <Image 
                      src={qrCode} 
                      alt="QR Payment Code" 
                      width={280} 
                      height={280}
                      className="rounded"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <button
                    onClick={openPaymentUrl}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Mở trang thanh toán VNPay
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">📱 Hướng dẫn thanh toán:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">1.</span>
                  <span>Quét mã QR bằng ứng dụng ngân hàng hoặc VNPay</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">2.</span>
                  <span>Hoặc click "Mở trang thanh toán VNPay" ở trên</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">3.</span>
                  <span>Xác nhận thanh toán theo hướng dẫn</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-blue-600">4.</span>
                  <span>Hệ thống sẽ tự động cập nhật sau khi thanh toán thành công</span>
                </li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Hủy
              </button>
              <button
                onClick={generateQRCode}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Tạo mã mới
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Lưu ý: Mã QR này sẽ hết hạn sau 15 phút
            </p>
          </>
        )}
      </div>
    </div>
  );
}
