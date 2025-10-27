'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  UsersIcon,
  TruckIcon as CarIcon,
  ChartBarIcon,
  StarIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data
const dashboardStats = {
  totalUsers: 1247,
  totalVehicles: 89,
  activeBookings: 156,
  monthlyRevenue: 47850,
  pendingApprovals: 23,
  averageRating: 4.6
};

const recentActivities = [
  { id: 1, type: 'booking', message: 'New booking from John Doe - Toyota Camry', time: '5 min ago' },
  { id: 2, type: 'review', message: 'New 5-star review for Honda Civic', time: '12 min ago' },
  { id: 3, type: 'user', message: 'New user registration: Jane Smith', time: '25 min ago' },
  { id: 4, type: 'vehicle', message: 'Vehicle Ford Escape added to fleet', time: '1 hour ago' },
  { id: 5, type: 'complaint', message: 'New complaint report #CR-001', time: '2 hours ago' }
];

const quickStats = [
  { name: 'Revenue Today', value: '$2,340', change: '+12%', color: 'text-green-600' },
  { name: 'Bookings Today', value: '23', change: '+8%', color: 'text-green-600' },
  { name: 'Active Users', value: '847', change: '+5%', color: 'text-green-600' },
  { name: 'Vehicle Utilization', value: '78%', change: '-2%', color: 'text-red-600' }
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-2 text-primary-100">Quản lý hệ thống thuê xe CarBorrow</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/70"
                >
                  <option value="today">Hôm nay</option>
                  <option value="this-week">Tuần này</option>
                  <option value="this-month">Tháng này</option>
                  <option value="this-year">Năm này</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Users */}
            <Link href="/admin/users" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">+15 người dùng mới tuần này</p>
                </div>
              </div>
            </Link>

            {/* Vehicles */}
            <Link href="/admin/vehicles" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CarIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng phương tiện</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalVehicles}</p>
                  <p className="text-sm text-gray-600 mt-1">78% đang được thuê</p>
                </div>
              </div>
            </Link>

            {/* Revenue */}
            <Link href="/admin/reports" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Doanh thu tháng</p>
                  <p className="text-2xl font-semibold text-gray-900">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">+12% so với tháng trước</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bookings Management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quản lý đơn thuê</h3>
                <Link href="/admin/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Xem tất cả
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/bookings?status=pending" className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50">
                  <div className="flex items-center">
                    <DocumentCheckIcon className="h-6 w-6 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-lg font-semibold text-gray-900">{dashboardStats.pendingApprovals}</p>
                      <p className="text-sm text-gray-600">Chờ duyệt</p>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/bookings?status=active" className="p-4 border border-green-200 rounded-lg hover:bg-green-50">
                  <div className="flex items-center">
                    <CarIcon className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <p className="text-lg font-semibold text-gray-900">{dashboardStats.activeBookings}</p>
                      <p className="text-sm text-gray-600">Đang thuê</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Reviews & Complaints */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Đánh giá & Phản ánh</h3>
                <div className="flex space-x-2">
                  <Link href="/admin/reviews" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Đánh giá
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/admin/complaints" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Phản ánh
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/reviews" className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50">
                  <div className="flex items-center">
                    <StarIcon className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-lg font-semibold text-gray-900">{dashboardStats.averageRating}</p>
                      <p className="text-sm text-gray-600">Đánh giá TB</p>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/complaints" className="p-4 border border-red-200 rounded-lg hover:bg-red-50">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    <div className="ml-3">
                      <p className="text-lg font-semibold text-gray-900">7</p>
                      <p className="text-sm text-gray-600">Phản ánh mới</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Hành động nhanh</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/admin/users/new"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <PlusIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">Thêm người dùng</span>
                </Link>

                <Link 
                  href="/admin/vehicles/new"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <PlusIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">Thêm phương tiện</span>
                </Link>

                <Link 
                  href="/admin/reports"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ChartBarIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">Xem báo cáo</span>
                </Link>

                <Link 
                  href="/admin/bookings?status=pending"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <DocumentCheckIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">Duyệt đơn thuê</span>
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link 
                  href="/admin/activities"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Xem tất cả hoạt động →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}