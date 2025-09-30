'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  TruckIcon as CarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock vehicles data
const mockVehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    dailyRate: 45,
    status: 'Available',
    location: 'Downtown Location',
    mileage: 15420,
    licensePlate: '29A-12345',
    color: 'White',
    features: ['Air Conditioning', 'GPS', 'Bluetooth'],
    images: ['/api/placeholder/300/200'],
    totalBookings: 156,
    averageRating: 4.5,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    category: 'Compact',
    fuelType: 'Gasoline',
    transmission: 'Manual',
    seats: 5,
    dailyRate: 35,
    status: 'Rented',
    location: 'Airport Terminal',
    mileage: 28350,
    licensePlate: '29B-67890',
    color: 'Blue',
    features: ['Air Conditioning', 'Bluetooth'],
    images: ['/api/placeholder/300/200'],
    totalBookings: 89,
    averageRating: 4.3,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20'
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Escape',
    year: 2023,
    category: 'SUV',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 7,
    dailyRate: 65,
    status: 'Maintenance',
    location: 'Mall Location',
    mileage: 8750,
    licensePlate: '29C-11223',
    color: 'Black',
    features: ['Air Conditioning', 'GPS', 'Bluetooth', 'Backup Camera'],
    images: ['/api/placeholder/300/200'],
    totalBookings: 45,
    averageRating: 4.7,
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-04-25'
  },
  {
    id: 4,
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2021,
    category: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    dailyRate: 40,
    status: 'Available',
    location: 'Downtown Location',
    mileage: 45200,
    licensePlate: '29D-55667',
    color: 'Silver',
    features: ['Air Conditioning', 'Bluetooth'],
    images: ['/api/placeholder/300/200'],
    totalBookings: 78,
    averageRating: 4.2,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10'
  }
];

const statusConfig = {
  'Available': { 
    label: 'Có sẵn', 
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  'Rented': { 
    label: 'Đang thuê', 
    color: 'bg-blue-100 text-blue-800',
    icon: ClockIcon
  },
  'Maintenance': { 
    label: 'Bảo trì', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  'Unavailable': { 
    label: 'Không khả dụng', 
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
};

const categoryColors = {
  'Sedan': 'bg-blue-100 text-blue-800',
  'SUV': 'bg-green-100 text-green-800',
  'Compact': 'bg-purple-100 text-purple-800',
  'Luxury': 'bg-yellow-100 text-yellow-800',
  'Truck': 'bg-gray-100 text-gray-800'
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = `${vehicle.make} ${vehicle.model} ${vehicle.licensePlate}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectVehicle = (vehicleId: number) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVehicles(
      selectedVehicles.length === filteredVehicles.length 
        ? [] 
        : filteredVehicles.map(vehicle => vehicle.id)
    );
  };

  const handleDeleteVehicle = (vehicle: any) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      toast.success(`Đã xóa phương tiện ${vehicleToDelete.make} ${vehicleToDelete.model}`);
    }
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const toggleVehicleStatus = (vehicleId: number) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId 
        ? { 
            ...vehicle, 
            status: vehicle.status === 'Available' ? 'Maintenance' : 'Available' 
          }
        : vehicle
    ));
    toast.success('Đã cập nhật trạng thái phương tiện');
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || CheckCircleIcon;
    return <IconComponent className="h-4 w-4 mr-1" />;
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
                <h1 className="text-3xl font-bold text-gray-900">Quản lý phương tiện</h1>
                <p className="mt-2 text-gray-600">
                  Quản lý tất cả phương tiện trong hệ thống ({filteredVehicles.length} phương tiện)
                </p>
              </div>
              <Link
                href="/admin/vehicles/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Thêm phương tiện
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Có sẵn</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'Available').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đang thuê</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'Rented').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Bảo trì</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'Maintenance').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <CarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng cộng</p>
                  <p className="text-2xl font-semibold text-gray-900">{vehicles.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phương tiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại xe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Compact">Compact</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Available">Có sẵn</option>
                  <option value="Rented">Đang thuê</option>
                  <option value="Maintenance">Bảo trì</option>
                  <option value="Unavailable">Không khả dụng</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div>
                {selectedVehicles.length > 0 && (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Hành động ({selectedVehicles.length})</option>
                    <option value="maintenance">Chuyển sang bảo trì</option>
                    <option value="available">Đặt thành có sẵn</option>
                    <option value="delete">Xóa phương tiện</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Vehicle Image */}
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <CarIcon className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => handleSelectVehicle(vehicle.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[vehicle.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {getStatusIcon(vehicle.status)}
                      {statusConfig[vehicle.status as keyof typeof statusConfig]?.label || vehicle.status}
                    </span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-500">Biển số: {vehicle.licensePlate}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[vehicle.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
                      {vehicle.category}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Số chỗ ngồi:</span>
                      <span className="text-gray-900">{vehicle.seats} chỗ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nhiên liệu:</span>
                      <span className="text-gray-900">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hộp số:</span>
                      <span className="text-gray-900">{vehicle.transmission}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Km đã chạy:</span>
                      <span className="text-gray-900">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">${vehicle.dailyRate}</p>
                      <p className="text-sm text-gray-500">mỗi ngày</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{vehicle.totalBookings} đơn thuê</p>
                      <p className="text-sm text-gray-500">⭐ {vehicle.averageRating}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => toggleVehicleStatus(vehicle.id)}
                      className={`text-sm font-medium px-3 py-1 rounded ${
                        vehicle.status === 'Available' 
                          ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {vehicle.status === 'Available' ? 'Bảo trì' : 'Kích hoạt'}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/vehicles/${vehicle.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/vehicles/${vehicle.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <CarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy phương tiện nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Xác nhận xóa phương tiện
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa phương tiện {vehicleToDelete?.make} {vehicleToDelete?.model}? 
                      Hành động này không thể hoàn tác.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}