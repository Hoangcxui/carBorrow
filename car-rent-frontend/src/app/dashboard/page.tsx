'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock bookings data
const mockBookings = [
  {
    id: 'BK001',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      image: '/api/placeholder/300/200'
    },
    pickupDate: '2024-01-15',
    dropoffDate: '2024-01-18',
    pickupTime: '10:00 AM',
    dropoffTime: '10:00 AM',
    pickupLocation: 'Downtown Location - 123 Main St',
    dropoffLocation: 'Airport Terminal - 456 Airport Rd',
    status: 'confirmed',
    totalAmount: 180,
    bookingDate: '2024-01-10'
  },
  {
    id: 'BK002',
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      image: '/api/placeholder/300/200'
    },
    pickupDate: '2024-01-25',
    dropoffDate: '2024-01-27',
    pickupTime: '02:00 PM',
    dropoffTime: '02:00 PM',
    pickupLocation: 'Mall Location - 789 Shopping Blvd',
    dropoffLocation: 'Mall Location - 789 Shopping Blvd',
    status: 'active',
    totalAmount: 120,
    bookingDate: '2024-01-20'
  },
  {
    id: 'BK003',
    vehicle: {
      make: 'Ford',
      model: 'Escape',
      year: 2023,
      image: '/api/placeholder/300/200'
    },
    pickupDate: '2023-12-10',
    dropoffDate: '2023-12-12',
    pickupTime: '09:00 AM',
    dropoffTime: '09:00 AM',
    pickupLocation: 'Downtown Location - 123 Main St',
    dropoffLocation: 'Downtown Location - 123 Main St',
    status: 'completed',
    totalAmount: 150,
    bookingDate: '2023-12-05'
  }
];

const statusConfig = {
  confirmed: {
    label: 'Đã xác nhận',
    color: 'text-blue-700 bg-blue-100 border-blue-200'
  },
  active: {
    label: 'Đang hoạt động',
    color: 'text-green-700 bg-green-100 border-green-200'
  },
  completed: {
    label: 'Đã hoàn thành',
    color: 'text-gray-700 bg-gray-100 border-gray-200'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-red-700 bg-red-100 border-red-200'
  }
};

export default function UserDashboardPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings] = useState(mockBookings);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt xe này?')) {
      toast.success('Đặt xe đã được hủy thành công');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookingsByStatus = (status: string) => {
    return bookings.filter(booking => booking.status === status);
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Bảng điều khiển</h1>
            <p className="text-lg text-gray-600">Quản lý các đặt xe và thuê xe của bạn</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg p-8 text-white transform hover:-translate-y-1 transition-all">
              <p className="text-blue-100 text-sm font-semibold mb-2">Tổng đặt xe</p>
              <p className="text-4xl font-black">{bookings.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-lg p-8 text-white transform hover:-translate-y-1 transition-all">
              <p className="text-green-100 text-sm font-semibold mb-2">Đang thuê</p>
              <p className="text-4xl font-black">
                {getBookingsByStatus('active').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl shadow-lg p-8 text-white transform hover:-translate-y-1 transition-all">
              <p className="text-yellow-100 text-sm font-semibold mb-2">Sắp tới</p>
              <p className="text-4xl font-black">
                {getBookingsByStatus('confirmed').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-lg p-8 text-white transform hover:-translate-y-1 transition-all">
              <p className="text-purple-100 text-sm font-semibold mb-2">Tổng chi tiêu</p>
              <p className="text-4xl font-black">
                ${bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-md mb-8 p-2">
            <nav className="flex space-x-2">
              {[
                { id: 'bookings', name: 'Đặt xe của tôi', count: bookings.length },
                { id: 'favorites', name: 'Yêu thích', count: 5 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-8">
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                {['all', 'active', 'confirmed', 'completed'].map(filter => (
                  <button
                    key={filter}
                    className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                  >
                    {filter === 'all' ? 'Tất cả đặt xe' : 
                     filter === 'active' ? 'Đang hoạt động' :
                     filter === 'confirmed' ? 'Đã xác nhận' : 'Đã hoàn thành'}
                    <span className="ml-2 text-gray-500 font-semibold">
                      ({filter === 'all' ? bookings.length : getBookingsByStatus(filter).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              <div className="grid grid-cols-1 gap-6">
                {bookings.map(booking => {
                  const statusInfo = statusConfig[booking.status as keyof typeof statusConfig];
                  
                  return (
                    <div key={booking.id} className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8 hover:shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                              <span className="text-2xl font-black text-gray-600">XE</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500 font-semibold">ID: {booking.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-all"
                          >
                            Xem
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs font-bold text-gray-500 mb-2">Lấy xe</p>
                          <p className="font-bold text-gray-900">{formatDate(booking.pickupDate)}</p>
                          <p className="text-sm text-gray-600 font-semibold">{booking.pickupTime}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs font-bold text-gray-500 mb-2">Trả xe</p>
                          <p className="font-bold text-gray-900">{formatDate(booking.dropoffDate)}</p>
                          <p className="text-sm text-gray-600 font-semibold">{booking.dropoffTime}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs font-bold text-gray-500 mb-2">Địa điểm</p>
                          <p className="text-sm text-gray-900 font-semibold truncate">{booking.pickupLocation}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t-2 border-gray-100 space-y-4 sm:space-y-0">
                        <div>
                          <p className="text-3xl font-black text-primary-600">${booking.totalAmount}</p>
                          <p className="text-sm text-gray-500 font-semibold">Tổng tiền</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-6 py-3 text-red-600 border-2 border-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                            >
                              Hủy
                            </button>
                          )}
                          <Link
                            href={`/vehicles/${booking.id}`}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có xe yêu thích</h3>
              <p className="text-gray-600 mb-8 text-lg">Bắt đầu tìm xe và thêm vào danh sách yêu thích!</p>
              <Link
                href="/vehicles"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg text-lg"
              >
                Xem các xe
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-all text-xl"
              >
                ×
              </button>

              <h3 className="text-3xl font-bold text-gray-900 mb-8">Chi tiết đặt xe</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Xe</h4>
                  <p className="text-gray-700 font-semibold text-lg">
                    {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Thời gian thuê</h4>
                  <p className="text-gray-700 font-semibold">
                    {formatDate(selectedBooking.pickupDate)} lúc {selectedBooking.pickupTime}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    đến {formatDate(selectedBooking.dropoffDate)} lúc {selectedBooking.dropoffTime}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Địa điểm</h4>
                  <p className="text-gray-700 mb-2 font-semibold">
                    <span className="text-gray-500">Lấy xe:</span> {selectedBooking.pickupLocation}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    <span className="text-gray-500">Trả xe:</span> {selectedBooking.dropoffLocation}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                  <h4 className="font-bold mb-2 text-lg">Tổng tiền</h4>
                  <p className="text-4xl font-black">${selectedBooking.totalAmount}</p>
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
