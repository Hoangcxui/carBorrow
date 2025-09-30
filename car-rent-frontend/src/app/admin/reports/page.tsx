'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon as CarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for reports
const revenueData = {
  thisMonth: {
    total: 47850,
    growth: 12,
    bookings: 156,
    avgBookingValue: 307
  },
  lastMonth: {
    total: 42720,
    growth: 8,
    bookings: 142,
    avgBookingValue: 301
  },
  thisYear: {
    total: 425600,
    growth: 15,
    bookings: 1587,
    avgBookingValue: 268
  }
};

const monthlyRevenue = [
  { month: 'Jan', revenue: 35000, bookings: 120 },
  { month: 'Feb', revenue: 38000, bookings: 135 },
  { month: 'Mar', revenue: 42000, bookings: 148 },
  { month: 'Apr', revenue: 39000, bookings: 138 },
  { month: 'May', revenue: 44000, bookings: 152 },
  { month: 'Jun', revenue: 47000, bookings: 165 },
  { month: 'Jul', revenue: 51000, bookings: 178 },
  { month: 'Aug', revenue: 49000, bookings: 171 },
  { month: 'Sep', revenue: 47850, bookings: 156 }
];

const popularVehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    totalBookings: 89,
    revenue: 15680,
    rating: 4.7,
    utilizationRate: 85,
    category: 'Sedan'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    totalBookings: 76,
    revenue: 12450,
    rating: 4.5,
    utilizationRate: 78,
    category: 'Compact'
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Escape',
    year: 2023,
    totalBookings: 67,
    revenue: 18900,
    rating: 4.6,
    utilizationRate: 82,
    category: 'SUV'
  },
  {
    id: 4,
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2021,
    totalBookings: 54,
    revenue: 9720,
    rating: 4.3,
    utilizationRate: 65,
    category: 'Sedan'
  },
  {
    id: 5,
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    totalBookings: 45,
    revenue: 7650,
    rating: 4.4,
    utilizationRate: 58,
    category: 'Sedan'
  }
];

const categoryStats = [
  { category: 'Sedan', count: 35, revenue: 125400, avgRate: 42, popularity: 45 },
  { category: 'SUV', count: 22, revenue: 156800, avgRate: 65, popularity: 28 },
  { category: 'Compact', count: 18, revenue: 87200, avgRate: 35, popularity: 22 },
  { category: 'Luxury', count: 8, revenue: 78600, avgRate: 95, popularity: 3 },
  { category: 'Truck', count: 6, revenue: 45200, avgRate: 58, popularity: 2 }
];

const recentTransactions = [
  { id: 'TXN001', date: '2024-09-30', customer: 'Nguyễn Văn An', vehicle: 'Toyota Camry', amount: 315, status: 'Completed' },
  { id: 'TXN002', date: '2024-09-30', customer: 'Trần Thị Bình', vehicle: 'Honda Civic', amount: 245, status: 'Completed' },
  { id: 'TXN003', date: '2024-09-29', customer: 'Lê Minh Cường', vehicle: 'Ford Escape', amount: 425, status: 'Completed' },
  { id: 'TXN004', date: '2024-09-29', customer: 'Phạm Thu Hương', vehicle: 'Chevrolet Malibu', amount: 280, status: 'Pending' },
  { id: 'TXN005', date: '2024-09-28', customer: 'Hoàng Văn Đức', vehicle: 'Nissan Altima', amount: 195, status: 'Completed' }
];

export default function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedReport, setSelectedReport] = useState('revenue');

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'this-month':
        return revenueData.thisMonth;
      case 'last-month':
        return revenueData.lastMonth;
      case 'this-year':
        return revenueData.thisYear;
      default:
        return revenueData.thisMonth;
    }
  };

  const currentData = getCurrentData();

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
                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                <p className="mt-2 text-gray-600">Phân tích doanh thu và hiệu suất kinh doanh</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="this-month">Tháng này</option>
                  <option value="last-month">Tháng trước</option>
                  <option value="this-year">Năm này</option>
                </select>
                <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'revenue', name: 'Doanh thu', icon: CurrencyDollarIcon },
                  { id: 'vehicles', name: 'Phương tiện', icon: CarIcon },
                  { id: 'customers', name: 'Khách hàng', icon: UsersIcon },
                  { id: 'performance', name: 'Hiệu suất', icon: ChartBarIcon }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedReport(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        selectedReport === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Revenue Overview */}
          {selectedReport === 'revenue' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                      <p className="text-2xl font-semibold text-gray-900">${currentData.total.toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center text-sm font-medium ${currentData.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currentData.growth > 0 ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(currentData.growth)}%
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số đơn thuê</p>
                      <p className="text-2xl font-semibold text-gray-900">{currentData.bookings}</p>
                    </div>
                    <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Giá trị TB/đơn</p>
                      <p className="text-2xl font-semibold text-gray-900">${currentData.avgBookingValue}</p>
                    </div>
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tăng trưởng</p>
                      <p className={`text-2xl font-semibold ${currentData.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currentData.growth > 0 ? '+' : ''}{currentData.growth}%
                      </p>
                    </div>
                    <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Biểu đồ doanh thu theo tháng</h3>
                <div className="space-y-4">
                  {monthlyRevenue.map((month, index) => (
                    <div key={month.month} className="flex items-center">
                      <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-4 relative">
                          <div 
                            className="bg-primary-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(month.revenue / 60000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-sm font-semibold text-gray-900">${month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-16 text-right text-sm text-gray-500 ml-2">
                        {month.bookings} đơn
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã giao dịch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phương tiện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.vehicle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${transaction.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'Completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status === 'Completed' ? 'Hoàn thành' : 'Đang xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Performance */}
          {selectedReport === 'vehicles' && (
            <div className="space-y-8">
              {/* Category Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê theo loại xe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {categoryStats.map((category) => (
                    <div key={category.category} className="text-center">
                      <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <CarIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{category.category}</h4>
                      <p className="text-xs text-gray-500 mt-1">{category.count} xe</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">${category.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{category.popularity}% ưa thích</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Vehicles */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Xe được thuê nhiều nhất</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thứ hạng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phương tiện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lần thuê
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doanh thu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đánh giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tỷ lệ sử dụng
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {popularVehicles.map((vehicle, index) => (
                        <tr key={vehicle.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-yellow-600' : 'bg-gray-300 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CarIcon className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vehicle.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {vehicle.totalBookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${vehicle.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ⭐ {vehicle.rating}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${vehicle.utilizationRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{vehicle.utilizationRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {selectedReport === 'performance' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Chỉ số hiệu suất</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                  <div className="text-sm text-gray-500">Tỷ lệ sử dụng xe</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.6</div>
                  <div className="text-sm text-gray-500">Đánh giá trung bình</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                  <div className="text-sm text-gray-500">Khách hàng hài lòng</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}