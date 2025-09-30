'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TruckIcon as CarIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
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
    label: 'Confirmed',
    color: 'text-blue-700 bg-blue-100',
    icon: CheckCircleIcon
  },
  active: {
    label: 'Active',
    color: 'text-green-700 bg-green-100',
    icon: CheckCircleIcon
  },
  completed: {
    label: 'Completed',
    color: 'text-gray-700 bg-gray-100',
    icon: CheckCircleIcon
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700 bg-red-100',
    icon: XMarkIcon
  }
};

export default function UserDashboardPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings] = useState(mockBookings);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      toast.success('Booking cancelled successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your car rentals and bookings</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getBookingsByStatus('active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Upcoming</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getBookingsByStatus('confirmed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'bookings', name: 'My Bookings', count: bookings.length },
                { id: 'favorites', name: 'Favorites', count: 5 },
                { id: 'profile', name: 'Profile Settings', count: null }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
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
            <div className="space-y-6">
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-4">
                {['all', 'active', 'confirmed', 'completed'].map(filter => (
                  <button
                    key={filter}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 capitalize"
                  >
                    {filter === 'all' ? 'All Bookings' : filter}
                    <span className="ml-2 text-gray-500">
                      ({filter === 'all' ? bookings.length : getBookingsByStatus(filter).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              <div className="grid grid-cols-1 gap-6">
                {bookings.map(booking => {
                  const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig]?.icon || CheckCircleIcon;
                  
                  return (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <CarIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[booking.status as keyof typeof statusConfig]?.color || 'text-gray-700 bg-gray-100'
                          }`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig[booking.status as keyof typeof statusConfig]?.label || booking.status}
                          </span>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarDaysIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p>Pickup: {formatDate(booking.pickupDate)}</p>
                            <p className="text-xs">{booking.pickupTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarDaysIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p>Return: {formatDate(booking.dropoffDate)}</p>
                            <p className="text-xs">{booking.dropoffTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p className="truncate">{booking.pickupLocation}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">${booking.totalAmount}</p>
                          <p className="text-sm text-gray-500">Total amount</p>
                        </div>
                        <div className="flex space-x-3">
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}
                          <Link
                            href={`/vehicles/${booking.id}`}
                            className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
                          >
                            View Details
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
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorite Vehicles</h3>
              <p className="text-gray-500 mb-6">Start browsing vehicles and add them to your favorites!</p>
              <Link
                href="/vehicles"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Vehicles
              </Link>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver License Number
                  </label>
                  <input
                    type="text"
                    defaultValue="DL123456789"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Booking Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Vehicle</h4>
                      <p className="text-sm text-gray-600">
                        {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Booking Period</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedBooking.pickupDate)} at {selectedBooking.pickupTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        to {formatDate(selectedBooking.dropoffDate)} at {selectedBooking.dropoffTime}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Locations</h4>
                      <p className="text-sm text-gray-600">Pickup: {selectedBooking.pickupLocation}</p>
                      <p className="text-sm text-gray-600">Return: {selectedBooking.dropoffLocation}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Total Amount</h4>
                      <p className="text-lg font-semibold text-primary-600">${selectedBooking.totalAmount}</p>
                    </div>
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