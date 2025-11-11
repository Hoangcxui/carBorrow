'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  amount: number;
  customerEmail: string;
}

export default function QRPaymentModal({ isOpen, onClose, bookingId, amount, customerEmail }: QRPaymentModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes

  useEffect(() => {
    if (isOpen) {
      // Generate VietQR URL
      // Format: https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NUMBER}-{TEMPLATE}.png?amount={AMOUNT}&addInfo={INFO}
      const bankId = 'MB'; // MB Bank
      const accountNumber = '0123456789'; // Số tài khoản demo
      const info = encodeURIComponent(`CarBorrow BK${bookingId}`);
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact.png?amount=${amount}&addInfo=${info}&accountName=CARBORROW`;
      
      setQrCodeUrl(qrUrl);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, bookingId, amount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-all text-xl"
          >
            ×
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt xe thành công!</h2>
            <p className="text-gray-600">Vui lòng quét mã QR để hoàn tất thanh toán</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-800">Thời gian còn lại:</span>
              <span className="text-2xl font-bold text-yellow-900">{formatTime(countdown)}</span>
            </div>
            {countdown < 60 && (
              <p className="text-xs text-yellow-700 mt-2">⚠️ Vui lòng thanh toán trước khi hết thời gian</p>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="bg-white rounded-xl p-4 mb-4 flex justify-center">
              {qrCodeUrl ? (
                <Image 
                  src={qrCodeUrl} 
                  alt="QR Payment" 
                  width={280} 
                  height={280}
                  className="rounded-lg"
                  unoptimized
                />
              ) : (
                <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg animate-pulse"></div>
              )}
            </div>
            <p className="text-center text-sm text-gray-600">
              Quét mã QR bằng ứng dụng Banking để thanh toán
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Mã đặt xe:</span>
              <span className="font-semibold text-gray-900">BK{bookingId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Số tiền:</span>
              <span className="text-xl font-bold text-primary-600">{amount.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Nội dung:</span>
              <span className="font-semibold text-gray-900">CarBorrow BK{bookingId}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Email xác nhận:</span>
              <span className="text-sm text-gray-900">{customerEmail}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Hướng dẫn thanh toán:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Mở ứng dụng Banking trên điện thoại</li>
              <li>Chọn chức năng quét QR</li>
              <li>Quét mã QR phía trên</li>
              <li>Kiểm tra thông tin và xác nhận chuyển khoản</li>
              <li>Chúng tôi sẽ gửi email xác nhận trong 5-10 phút</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
            >
              Đóng
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Xem đặt xe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
