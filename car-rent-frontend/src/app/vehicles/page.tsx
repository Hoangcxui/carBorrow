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
  imageUrl?: string;
  description?: string;
  features?: string;
  status?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const categories = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury', 'Van'];
const priceRanges = [
  { label: 'Dưới 500K', min: 0, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: '1M - 2M', min: 1000000, max: 2000000 },
  { label: 'Trên 2M', min: 2000000, max: 9999999 }
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/vehicle`);
        const data = await response.json();
        const vehiclesData = data.data || [];
        setVehicles(vehiclesData);
        setFilteredVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

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
                {isLoading ? (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải xe...</p>
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">Không tìm thấy xe nào phù hợp</p>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Vehicle Image */}
                    <div className="relative h-48 bg-gray-200">
                      {vehicle.imageUrl ? (
                        <img 
                          src={vehicle.imageUrl} 
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          {vehicle.make} {vehicle.model}
                        </div>
                      )}
                      {!vehicle.isAvailable && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Không có sẵn
                        </div>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <span className="text-sm text-gray-500">{vehicle.categoryName}</span>
                      </div>

                      {/* Vehicle Features */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                        <div className="flex items-center font-semibold">
                          👥 {vehicle.seats} chỗ
                        </div>
                        <div className="flex items-center font-semibold">
                          ⚙️ {vehicle.transmission}
                        </div>
                        <div className="flex items-center font-semibold">
                          ⛽ {vehicle.fuelType}
                        </div>
                        <div className="text-gray-500 font-semibold">
                          🎨 {vehicle.color}
                        </div>
                      </div>

                      {/* Features List */}
                      {vehicle.features && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-600 line-clamp-2">{vehicle.features}</p>
                        </div>
                      )}

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary-600">
                          {(vehicle.dailyRate / 1000).toFixed(0)}K VND
                          <span className="text-sm font-normal text-gray-500">/ngày</span>
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
                )))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}