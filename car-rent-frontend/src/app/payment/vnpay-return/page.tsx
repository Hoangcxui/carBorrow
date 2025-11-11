'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VNPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [bookingId, setBookingId] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    const bid = searchParams.get('bookingId') || '';
    const txId = searchParams.get('transactionId') || '';
    const msg = searchParams.get('message') || '';
    
    setSuccess(isSuccess);
    setBookingId(bid);
    setTransactionId(txId);
    setMessage(msg);

    // Redirect về trang booking detail sau 5 giây nếu thành công
    if (isSuccess && bid) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push(`/my-bookings`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [searchParams, router]);

  if (success === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang xử lý thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full">
        {success ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-green-600 mb-3 text-center">
              Thanh toán thành công!
            </h1>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                {bookingId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-800">#{bookingId}</span>
                  </div>
                )}
                {transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-semibold text-gray-800">{transactionId}</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              Cảm ơn bạn đã thanh toán. Đơn đặt xe của bạn đã được xác nhận thành công!
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 text-center">
                🔔 Bạn sẽ nhận được email xác nhận trong vài phút tới.
              </p>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">
                Tự động chuyển về danh sách đặt xe trong <span className="font-bold text-blue-600">{countdown}s</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/my-bookings"
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
              >
                Xem đơn đặt xe của tôi
              </Link>
              <Link
                href="/vehicles"
                className="block w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center font-medium text-gray-700"
              >
                Đặt xe khác
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-red-600 mb-3 text-center">
              Thanh toán thất bại!
            </h1>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-center text-sm">
                {message || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Lưu ý:</strong> Nếu tiền đã bị trừ, vui lòng liên hệ bộ phận hỗ trợ để được hoàn tiền.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Thử lại thanh toán
              </button>
              <Link
                href="/my-bookings"
                className="block w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center font-medium text-gray-700"
              >
                Quay về đơn đặt xe
              </Link>
              <Link
                href="/"
                className="block w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition text-center text-sm"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
