'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TruckIcon as CarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock bookings data
const mockBookings = [
  {
    id: 'BK001',
    customer: {
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@gmail.com',
      phone: '0123456789'
    },
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: '29A-12345'
    },
    pickupDate: '2024-10-01',
    dropoffDate: '2024-10-03',
    pickupTime: '10:00',
    dropoffTime: '10:00',
    pickupLocation: 'Downtown Location - 123 Main St',
    dropoffLocation: 'Downtown Location - 123 Main St',
    status: 'pending',
    totalAmount: 315,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    bookingDate: '2024-09-28',
    duration: 2,
    dailyRate: 45,
    addons: ['Insurance', 'GPS'],
    notes: 'Khách hàng yêu cầu giao xe tại nhà',
    driverLicense: 'DL123456789'
  },
  {
    id: 'BK002',
    customer: {
      name: 'Trần Thị Bình',
      email: 'tranthibinh@gmail.com',
      phone: '0987654321'
    },
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      licensePlate: '29B-67890'
    },
    pickupDate: '2024-09-30',
    dropoffDate: '2024-10-02',
    pickupTime: '14:00',
    dropoffTime: '14:00',
    pickupLocation: 'Airport Terminal - 456 Airport Rd',
    dropoffLocation: 'Mall Location - 789 Shopping Blvd',
    status: 'confirmed',
    totalAmount: 245,
    paymentStatus: 'paid',
    paymentMethod: 'Debit Card',
    bookingDate: '2024-09-25',
    duration: 2,
    dailyRate: 35,
    addons: ['GPS'],
    notes: '',
    driverLicense: 'DL987654321'
  },
  {
    id: 'BK003',
    customer: {
      name: 'Lê Minh Cường',
      email: 'leminhcuong@gmail.com',
      phone: '0369258147'
    },
    vehicle: {
      make: 'Ford',
      model: 'Escape',
      year: 2023,
      licensePlate: '29C-11223'
    },
    pickupDate: '2024-09-28',
    dropoffDate: '2024-09-30',
    pickupTime: '09:00',
    dropoffTime: '18:00',
    pickupLocation: 'Mall Location - 789 Shopping Blvd',
    dropoffLocation: 'Downtown Location - 123 Main St',
    status: 'active',
    totalAmount: 425,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    bookingDate: '2024-09-20',
    duration: 2,
    dailyRate: 65,
    addons: ['Insurance', 'GPS', 'Child Seat'],
    notes: 'Khách hàng có con nhỏ',
    driverLicense: 'DL369258147'
  },
  {
    id: 'BK004',
    customer: {
      name: 'Phạm Thu Hương',
      email: 'phamthuhuong@gmail.com',
      phone: '0147258369'
    },
    vehicle: {
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2021,
      licensePlate: '29D-55667'
    },
    pickupDate: '2024-10-05',
    dropoffDate: '2024-10-08',
    pickupTime: '11:00',
    dropoffTime: '11:00',
    pickupLocation: 'Downtown Location - 123 Main St',
    dropoffLocation: 'Airport Terminal - 456 Airport Rd',
    status: 'cancelled',
    totalAmount: 280,
    paymentStatus: 'refunded',
    paymentMethod: 'Credit Card',
    bookingDate: '2024-09-26',
    duration: 3,
    dailyRate: 40,
    addons: ['Insurance'],
    notes: 'Khách hàng hủy do thay đổi lịch trình',
    driverLicense: 'DL147258369'
  },
  {
    id: 'BK005',
    customer: {
      name: 'Hoàng Văn Đức',
      email: 'hoangvanduc@gmail.com',
      phone: '0258147369'
    },
    vehicle: {
      make: 'Nissan',
      model: 'Altima',
      year: 2022,
      licensePlate: '29E-99887'
    },
    pickupDate: '2024-09-25',
    dropoffDate: '2024-09-27',
    pickupTime: '16:00',
    dropoffTime: '10:00',
    pickupLocation: 'Airport Terminal - 456 Airport Rd',
    dropoffLocation: 'Airport Terminal - 456 Airport Rd',
    status: 'completed',
    totalAmount: 195,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    bookingDate: '2024-09-22',
    duration: 2,
    dailyRate: 42,
    addons: [],
    notes: '',
    driverLicense: 'DL258147369'
  }
];

const statusConfig = {
  'pending': { 
    label: 'Chờ duyệt', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: ClockIcon 
  },
  'confirmed': { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircleIcon 
  },
  'active': { 
    label: 'Đang thuê', 
    color: 'bg-green-100 text-green-800', 
    icon: CarIcon 
  },
  'completed': { 
    label: 'Hoàn thành', 
    color: 'bg-gray-100 text-gray-800', 
    icon: CheckCircleIcon 
  },
  'cancelled': { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-800', 
    icon: XMarkIcon 
  }
};

const paymentStatusConfig = {
  'paid': { label: 'Đã thanh toán', color: 'text-green-600' },
  'pending': { label: 'Chờ thanh toán', color: 'text-yellow-600' },
  'refunded': { label: 'Đã hoàn tiền', color: 'text-blue-600' },
  'failed': { label: 'Thanh toán thất bại', color: 'text-red-600' }
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/booking');
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match UI format
          const transformedBookings = data.map((booking: any) => ({
            id: `BK${booking.id.toString().padStart(4, '0')}`,
            customer: {
              name: booking.customerName,
              email: booking.customerEmail,
              phone: booking.customerPhone
            },
            vehicle: {
              make: 'Vehicle',
              model: `#${booking.vehicleId}`,
              year: 2023,
              licensePlate: 'N/A'
            },
            pickupDate: booking.pickupDate,
            dropoffDate: booking.dropoffDate,
            pickupTime: booking.pickupTime,
            dropoffTime: booking.dropoffTime,
            pickupLocation: booking.pickupLocation,
            dropoffLocation: booking.dropoffLocation,
            status: booking.status,
            totalAmount: booking.totalAmount,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            bookingDate: booking.createdAt,
            duration: Math.ceil((new Date(booking.dropoffDate).getTime() - new Date(booking.pickupDate).getTime()) / (1000 * 60 * 60 * 24)),
            dailyRate: 45,
            addons: booking.specialRequests ? booking.specialRequests.split(',') : [],
            notes: booking.specialRequests || '',
            driverLicense: booking.customerAddress
          }));
          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Không thể tải danh sách đặt xe');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || booking.paymentStatus === filterPaymentStatus;
    return matchesStatus && matchesPaymentStatus;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid' && b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const numericId = parseInt(bookingId.replace('BK', ''));
      const response = await fetch(`http://localhost:5001/api/booking/${numericId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: 'confirmed' })
      });
      
      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'confirmed' }
            : booking
        ));
        toast.success('Đã duyệt đơn thuê');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Không thể duyệt đơn thuê');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const numericId = parseInt(bookingId.replace('BK', ''));
      const response = await fetch(`http://localhost:5001/api/booking/${numericId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: 'cancelled' })
      });
      
      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        toast.success('Đã từ chối đơn thuê');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Không thể từ chối đơn thuê');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const numericId = parseInt(bookingId.replace('BK', ''));
      const response = await fetch(`http://localhost:5001/api/booking/${numericId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus })
      });
      
      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ));
        toast.success(`Đã cập nhật trạng thái thành ${statusConfig[newStatus as keyof typeof statusConfig].label}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || ClockIcon;
    return <IconComponent className="h-4 w-4 mr-1" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    return `${formatDate(dateString)} lúc ${timeString}`;
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link 
                href="/admin" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Quay lại Dashboard
              </Link>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn thuê</h1>
                <p className="mt-2 text-gray-600">
                  Quản lý và duyệt các đơn thuê xe ({filteredBookings.length} đơn thuê)
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-500">Tổng đơn</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-500">Chờ duyệt</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.confirmed}</div>
              <div className="text-sm text-gray-500">Đã xác nhận</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-500">Đang thuê</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">{stats.completed}</div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Tổng doanh thu</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái đơn thuê
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="active">Đang thuê</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái thanh toán
                </label>
                <select
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="refunded">Đã hoàn tiền</option>
                  <option value="failed">Thanh toán thất bại</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Không có đơn thuê nào</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-4">
                        Đơn thuê #{booking.id}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[booking.status as keyof typeof statusConfig].color}`}>
                        {getStatusIcon(booking.status)}
                        {statusConfig[booking.status as keyof typeof statusConfig].label}
                      </span>
                      <span className={`ml-2 text-xs font-semibold ${paymentStatusConfig[booking.paymentStatus as keyof typeof paymentStatusConfig].color}`}>
                        {paymentStatusConfig[booking.paymentStatus as keyof typeof paymentStatusConfig].label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <strong>Khách hàng:</strong>
                        </div>
                        <div className="text-sm text-gray-900">{booking.customer.name}</div>
                        <div className="text-xs text-gray-500">{booking.customer.email}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <CarIcon className="h-4 w-4 mr-1" />
                          <strong>Phương tiện:</strong>
                        </div>
                        <div className="text-sm text-gray-900">
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </div>
                        <div className="text-xs text-gray-500">Biển số: {booking.vehicle.licensePlate}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <strong>Thời gian thuê:</strong>
                        </div>
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.pickupDate)} - {formatDate(booking.dropoffDate)}
                        </div>
                        <div className="text-xs text-gray-500">{booking.duration} ngày</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          <strong>Tổng tiền:</strong>
                        </div>
                        <div className="text-lg font-semibold text-green-600">${booking.totalAmount}</div>
                        <div className="text-xs text-gray-500">${booking.dailyRate}/ngày</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <strong>Địa điểm nhận xe:</strong>
                        </div>
                        <div className="text-sm text-gray-900">{booking.pickupLocation}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.pickupDate)} lúc {booking.pickupTime}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <strong>Địa điểm trả xe:</strong>
                        </div>
                        <div className="text-sm text-gray-900">{booking.dropoffLocation}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.dropoffDate)} lúc {booking.dropoffTime}
                        </div>
                      </div>
                    </div>

                    {booking.addons.length > 0 && (
                      <div className="mb-4">
                        <strong className="text-sm text-gray-600">Dịch vụ bổ sung:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {booking.addons.map((addon, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                        <strong className="text-sm text-yellow-800">Ghi chú:</strong>
                        <p className="text-sm text-yellow-700 mt-1">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveBooking(booking.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                          Từ chối
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'active')}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
                      >
                        Bắt đầu thuê
                      </button>
                    )}

                    {booking.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-full hover:bg-gray-700"
                      >
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </div>

                {/* Booking Timeline */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div>
                      <strong>Đặt lúc:</strong> {formatDate(booking.bookingDate)}
                    </div>
                    <div>
                      <strong>Thanh toán:</strong> {booking.paymentMethod === 'qr' ? 'QR/VietQR' : booking.paymentMethod === 'cod' ? 'Thanh toán khi nhận xe' : booking.paymentMethod}
                    </div>
                    <div>
                      <strong>GPLX:</strong> {booking.driverLicense}
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {!loading && filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có đơn thuê nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 max-h-screen overflow-y-auto">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    Chi tiết đơn thuê #{selectedBooking.id}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium">{selectedBooking.customer.name}</div>
                            <div className="text-sm text-gray-500">GPLX: {selectedBooking.driverLicense}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm">{selectedBooking.customer.email}</div>
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm">{selectedBooking.customer.phone}</div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin phương tiện</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center">
                          <CarIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium">
                              {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              Biển số: {selectedBooking.vehicle.licensePlate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Giá thuê mỗi ngày:</span>
                          <span className="font-medium">${selectedBooking.dailyRate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Số ngày thuê:</span>
                          <span className="font-medium">{selectedBooking.duration} ngày</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Chi tiết đặt xe</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium">Nhận xe:</span>
                          </div>
                          <div className="text-sm text-gray-700 ml-6">
                            {selectedBooking.pickupLocation}<br/>
                            {formatDateTime(selectedBooking.pickupDate, selectedBooking.pickupTime)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium">Trả xe:</span>
                          </div>
                          <div className="text-sm text-gray-700 ml-6">
                            {selectedBooking.dropoffLocation}<br/>
                            {formatDateTime(selectedBooking.dropoffDate, selectedBooking.dropoffTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Phương thức:</span>
                          <span className="font-medium">
                            {selectedBooking.paymentMethod === 'qr' ? 'Thanh toán QR/VietQR' : 
                             selectedBooking.paymentMethod === 'cod' ? 'Thanh toán khi nhận xe (COD)' : 
                             selectedBooking.paymentMethod}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Trạng thái:</span>
                          <span className={`font-medium ${paymentStatusConfig[selectedBooking.paymentStatus as keyof typeof paymentStatusConfig].color}`}>
                            {paymentStatusConfig[selectedBooking.paymentStatus as keyof typeof paymentStatusConfig].label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                          <span className="text-sm font-medium">Tổng cộng:</span>
                          <span className="text-lg font-semibold text-green-600">${selectedBooking.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  {selectedBooking.addons.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Dịch vụ bổ sung</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.addons.map((addon: string, index: number) => (
                          <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedBooking.notes && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Ghi chú</h4>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">{selectedBooking.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            handleRejectBooking(selectedBooking.id);
                            setShowDetailModal(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => {
                            handleApproveBooking(selectedBooking.id);
                            setShowDetailModal(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Duyệt đơn
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}