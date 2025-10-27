'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  CogIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TruckIcon as CarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock user data
const userData = {
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@gmail.com',
  phone: '+84 123 456 789',
  joinDate: '2023-01-15',
  totalTrips: 12,
  totalSpent: 1850,
  rating: 4.9,
  verified: true
};

// Mock bookings data
const mockBookings = [
  {
    id: 'BK001',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      image: '/api/placeholder/150/100',
      licensePlate: '51A-12345'
    },
    pickupDate: '2024-10-01',
    dropoffDate: '2024-10-03',
    pickupTime: '10:00',
    dropoffTime: '10:00',
    pickupLocation: 'Downtown Location - 123 Main St',
    status: 'upcoming',
    totalAmount: 315,
    paymentStatus: 'paid',
    bookingDate: '2024-09-28',
    canCancel: true,
    canReview: false
  },
  {
    id: 'BK002',
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      image: '/api/placeholder/150/100',
      licensePlate: '51B-67890'
    },
    pickupDate: '2024-09-20',
    dropoffDate: '2024-09-22',
    pickupTime: '14:00',
    dropoffTime: '14:00',
    pickupLocation: 'Airport Terminal - 456 Airport Rd',
    status: 'completed',
    totalAmount: 245,
    paymentStatus: 'paid',
    bookingDate: '2024-09-18',
    canCancel: false,
    canReview: true,
    rating: 5,
    review: 'Xe rất sạch và chạy êm. Dịch vụ tốt!'
  },
  {
    id: 'BK003',
    vehicle: {
      make: 'Ford',
      model: 'Escape',
      year: 2023,
      image: '/api/placeholder/150/100',
      licensePlate: '51C-11223'
    },
    pickupDate: '2024-08-15',
    dropoffDate: '2024-08-17',
    pickupTime: '09:00',
    dropoffTime: '18:00',
    pickupLocation: 'Mall Location - 789 Shopping Blvd',
    status: 'cancelled',
    totalAmount: 425,
    paymentStatus: 'refunded',
    bookingDate: '2024-08-10',
    canCancel: false,
    canReview: false,
    cancelReason: 'Thay đổi lịch trình'
  }
];

// Mock favorite vehicles
const mockFavorites = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    image: '/api/placeholder/300/200',
    pricePerDay: 45,
    rating: 4.8,
    location: 'Quận 1, TP.HCM'
  },
  {
    id: 2,
    make: 'BMW',
    model: 'X5',
    year: 2022,
    image: '/api/placeholder/300/200',
    pricePerDay: 150,
    rating: 4.9,
    location: 'Quận 2, TP.HCM'
  }
];

const statusConfig = {
  upcoming: { label: 'Sắp tới', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  active: { label: 'Đang thuê', color: 'bg-yellow-100 text-yellow-800', icon: CarIcon }
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = mockBookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <UserIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chào {userData.name}!
                </h1>
                <div className="flex items-center text-gray-600">
                  <span>Thành viên từ {formatDate(userData.joinDate)}</span>
                  {userData.verified && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Tổng quan', icon: UserIcon },
                { id: 'bookings', name: 'Chuyến đi', icon: CalendarDaysIcon },
                { id: 'favorites', name: 'Yêu thích', icon: HeartIcon },
                { id: 'settings', name: 'Cài đặt', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Tổng chuyến đi</p>
                      <p className="text-2xl font-semibold text-gray-900">{userData.totalTrips}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Tổng chi tiêu</p>
                      <p className="text-2xl font-semibold text-gray-900">${userData.totalSpent}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <StarIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                      <p className="text-2xl font-semibold text-gray-900">{userData.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <HeartIcon className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Xe yêu thích</p>
                      <p className="text-2xl font-semibold text-gray-900">{mockFavorites.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Chuyến đi gần đây</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Xem tất cả
                  </button>
                </div>

                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img
                        src={booking.vehicle.image}
                        alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900">
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.pickupDate)} - {formatDate(booking.dropoffDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[booking.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[booking.status as keyof typeof statusConfig].label}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">${booking.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Filter */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả</option>
                    <option value="upcoming">Sắp tới</option>
                    <option value="active">Đang thuê</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            src={booking.vehicle.image}
                            alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500">Biển số: {booking.vehicle.licensePlate}</p>
                            <p className="text-sm text-gray-500">Đặt ngày: {formatDate(booking.bookingDate)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusConfig[booking.status as keyof typeof statusConfig].color}`}>
                            {statusConfig[booking.status as keyof typeof statusConfig].label}
                          </span>
                          <p className="text-lg font-bold text-gray-900 mt-2">${booking.totalAmount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                            <strong>Thời gian:</strong>
                          </div>
                          <div className="text-sm text-gray-900 ml-6">
                            Nhận: {formatDate(booking.pickupDate)} lúc {booking.pickupTime}<br/>
                            Trả: {formatDate(booking.dropoffDate)} lúc {booking.dropoffTime}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            <strong>Địa điểm:</strong>
                          </div>
                          <div className="text-sm text-gray-900 ml-6">
                            {booking.pickupLocation}
                          </div>
                        </div>
                      </div>

                      {booking.status === 'cancelled' && booking.cancelReason && (
                        <div className="bg-red-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-sm text-red-800">
                              <strong>Lý do hủy:</strong> {booking.cancelReason}
                            </span>
                          </div>
                        </div>
                      )}

                      {booking.review && (
                        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 mr-2">Đánh giá của bạn:</span>
                            <div className="flex">
                              {renderStars(booking.rating || 0)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{booking.review}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Mã đặt xe: {booking.id}</span>
                          <span className={`text-sm font-medium ${
                            booking.paymentStatus === 'paid' ? 'text-green-600' : 
                            booking.paymentStatus === 'refunded' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                             booking.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Chờ thanh toán'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          
                          {booking.canReview && !booking.review && (
                            <button className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                              Đánh giá
                            </button>
                          )}
                          
                          {booking.canCancel && (
                            <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                              Hủy đặt xe
                            </button>
                          )}
                          
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="Liên hệ hỗ trợ">
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Không có chuyến đi nào</p>
                  <Link 
                    href="/vehicles"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Tìm xe để thuê
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Xe yêu thích của bạn ({mockFavorites.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFavorites.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <div className="flex items-center mb-2">
                          {renderStars(vehicle.rating)}
                          <span className="ml-1 text-sm text-gray-500">{vehicle.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{vehicle.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">${vehicle.pricePerDay}/ngày</span>
                          <Link
                            href={`/vehicles/${vehicle.id}`}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {mockFavorites.length === 0 && (
                  <div className="text-center py-12">
                    <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Bạn chưa có xe yêu thích nào</p>
                    <Link 
                      href="/vehicles"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Khám phá xe
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cá nhân</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        defaultValue={userData.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Đổi mật khẩu</h3>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}