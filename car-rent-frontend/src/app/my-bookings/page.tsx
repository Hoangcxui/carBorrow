'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: number;
  vehicleId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem('customerEmail');

      if (!email) {
        setError('Vui lòng đặt xe trước để xem lịch sử');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/bookings?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu đặt xe');
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);

      if ((!Array.isArray(data) || data.length === 0) && email) {
        setError('Bạn chưa có đặt xe nào');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Lỗi khi tải dữ liệu đặt xe');
      toast.error('Lỗi khi tải dữ liệu đặt xe');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      active: 'Đang thuê',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return labels[status?.toLowerCase()] || status;
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Chờ thanh toán',
      completed: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
    };
    return labels[status?.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử đặt xe</h1>
          <p className="mt-2 text-gray-600">
            Quản lý và theo dõi các đơn đặt xe của bạn
          </p>
        </div>

        {error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
            <button
              onClick={() => router.push('/vehicles')}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Quay lại tìm xe
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đặt xe nào
            </h2>
            <p className="text-gray-600 mb-6">Hãy bắt đầu đặt xe ngay hôm nay</p>
            <button
              onClick={() => router.push('/vehicles')}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Tìm xe ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Đơn đặt xe #{booking.id}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                          Thông tin khách hàng
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">Tên:</span>{' '}
                            <span className="font-medium">
                              {booking.customerName}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Email:</span>{' '}
                            <span className="font-medium">
                              {booking.customerEmail}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Điện thoại:</span>{' '}
                            <span className="font-medium">
                              {booking.customerPhone}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Địa chỉ:</span>{' '}
                            <span className="font-medium">
                              {booking.customerAddress}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Dates & Times */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5 text-blue-600" />
                          Thời gian thuê
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">Nhận xe:</span>{' '}
                            <span className="font-medium">
                              {format(
                                new Date(booking.pickupDate),
                                'dd/MM/yyyy'
                              )}{' '}
                              lúc {booking.pickupTime}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Trả xe:</span>{' '}
                            <span className="font-medium">
                              {format(
                                new Date(booking.dropoffDate),
                                'dd/MM/yyyy'
                              )}{' '}
                              lúc {booking.dropoffTime}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      {/* Locations */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-blue-600" />
                          Địa điểm
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">Nhận xe:</span>{' '}
                            <span className="font-medium">
                              {booking.pickupLocation}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Trả xe:</span>{' '}
                            <span className="font-medium">
                              {booking.dropoffLocation}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CreditCardIcon className="w-5 h-5 text-blue-600" />
                          Thanh toán
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng tiền:</span>
                            <span className="text-lg font-semibold text-blue-600">
                              {booking.totalAmount.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="font-medium">
                              {booking.paymentMethod === 'qr'
                                ? 'Thanh toán QR'
                                : 'Thanh toán khi lấy xe'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Trạng thái:</span>
                            <div className="flex items-center gap-2">
                              {getPaymentStatusIcon(booking.paymentStatus)}
                              <span className="font-medium">
                                {getPaymentStatusLabel(booking.paymentStatus)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Yêu cầu đặc biệt:</span>{' '}
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mã đơn:{' '}
                    <span className="font-mono font-semibold">#{booking.id}</span>
                  </div>
                  <button
                    onClick={() => loadBookings()}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Làm mới
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
