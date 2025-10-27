'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  dailyRate: number;
  seats: number;
  transmission: string;
  fuelType: string;
  isAvailable: boolean;
  categoryName: string;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
}

// Mock data for demo
const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Silver',
    dailyRate: 45,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    isAvailable: true,
    categoryName: 'Sedan',
    rating: 4.8,
    reviewCount: 124,
    images: ['/api/placeholder/400/300'],
    features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'USB Ports']
  },
  {
    id: 2,
    make: 'Honda',
    model: 'CR-V',
    year: 2024,
    color: 'White',
    dailyRate: 55,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    isAvailable: true,
    categoryName: 'SUV',
    rating: 4.9,
    reviewCount: 98,
    images: ['/api/placeholder/400/300'],
    features: ['GPS Navigation', 'Backup Camera', 'Heated Seats', 'Sunroof']
  },
  {
    id: 3,
    make: 'BMW',
    model: 'X3',
    year: 2023,
    color: 'Black',
    dailyRate: 85,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    isAvailable: true,
    categoryName: 'Luxury SUV',
    rating: 4.7,
    reviewCount: 67,
    images: ['/api/placeholder/400/300'],
    features: ['Premium Sound', 'Leather Seats', 'All-Wheel Drive', 'Parking Assist']
  },
  {
    id: 4,
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'Blue',
    dailyRate: 75,
    seats: 5,
    transmission: 'Electric',
    fuelType: 'Electric',
    isAvailable: false,
    categoryName: 'Electric',
    rating: 4.9,
    reviewCount: 156,
    images: ['/api/placeholder/400/300'],
    features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Mobile App']
  }
];

const categories = ['All', 'Sedan', 'SUV', 'Luxury SUV', 'Electric'];
const priceRanges = [
  { label: 'Dưới $50', min: 0, max: 50 },
  { label: '$50 - $75', min: 50, max: 75 },
  { label: '$75 - $100', min: 75, max: 100 },
  { label: 'Trên $100', min: 100, max: 999 }
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.categoryName === selectedCategory);
    }

    // Price filter
    if (selectedPriceRange) {
      filtered = filtered.filter(vehicle => 
        vehicle.dailyRate >= selectedPriceRange.min && 
        vehicle.dailyRate <= selectedPriceRange.max
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.year - a.year);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tìm xe hoàn hảo cho bạn</h1>
                <p className="mt-2 text-gray-600">Chọn từ bộ sưu tập xe cao cấp của chúng tôi</p>
              </div>
              
              {/* Search and Sort */}
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm xe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="featured">Sắp xếp: Nổi bật</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="newest">Mới nhất</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Loại xe</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-600">{category === 'All' ? 'Tất cả' : category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Giá mỗi ngày</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === null}
                        onChange={() => setSelectedPriceRange(null)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">Mọi giá</span>
                    </label>
                    {priceRanges.map((range, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max}
                          onChange={() => setSelectedPriceRange(range)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedPriceRange(null);
                  }}
                  className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-600">
                Hiển thị {filteredVehicles.length} trong số {vehicles.length} xe
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Vehicle Image */}
                    <div className="relative h-48 bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {vehicle.make} {vehicle.model}
                      </div>
                      {!vehicle.isAvailable && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Không có sẵn
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                        {vehicle.rating}
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <span className="text-sm text-gray-500">{vehicle.categoryName}</span>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-600 font-bold text-sm">Đánh giá: {vehicle.rating}</span>
                          <span className="ml-2 text-sm text-gray-600">
                            ({vehicle.reviewCount} đánh giá)
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Features */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                        <div className="flex items-center font-semibold">
                          {vehicle.seats} chỗ ngồi
                        </div>
                        <div className="flex items-center font-semibold">
                          {vehicle.transmission}
                        </div>
                        <div className="flex items-center font-semibold">
                          {vehicle.fuelType}
                        </div>
                        <div className="text-gray-500 font-semibold">
                          {vehicle.color}
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {vehicle.features.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{vehicle.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary-600">
                          ${vehicle.dailyRate}
                          <span className="text-sm font-normal text-gray-500">/day</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            href={`/vehicles/${vehicle.id}`}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Xem chi tiết
                          </Link>
                          
                          <Link
                            href={vehicle.isAvailable ? `/vehicles/${vehicle.id}/book` : '#'}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              vehicle.isAvailable
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {vehicle.isAvailable ? 'Đặt ngay' : 'Không có sẵn'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy xe</h3>
                  <p className="text-gray-600">Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}