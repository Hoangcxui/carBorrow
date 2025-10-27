'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  StarIcon,
  UsersIcon,
  CogIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock vehicle data
const mockVehicle = {
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
  description: 'Experience comfort and reliability with our Toyota Camry. Perfect for business trips, family outings, or daily commuting. This sedan offers excellent fuel economy, spacious interior, and advanced safety features.',
  images: [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ],
  features: [
    'GPS Navigation',
    'Bluetooth Connectivity',
    'Air Conditioning',
    'USB Charging Ports',
    'Backup Camera',
    'Cruise Control',
    'Power Windows',
    'Safety Airbags'
  ],
  specifications: {
    engine: '2.5L 4-Cylinder',
    horsepower: '203 HP',
    fuelEconomy: '32 MPG City / 41 MPG Highway',
    doors: 4,
    luggage: '15.1 cubic feet',
    insurance: 'Full coverage included'
  },
  location: 'Downtown Location - 123 Main St',
  reviews: [
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent car! Very clean and comfortable. Great for my business trip.'
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good experience overall. Car was ready on time and in great condition.'
    },
    {
      id: 3,
      user: 'Mike R.',
      rating: 5,
      date: '2024-01-05',
      comment: 'Perfect for family vacation. Spacious and fuel-efficient.'
    }
  ]
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleBookNow = () => {
    if (!mockVehicle.isAvailable) {
      toast.error('This vehicle is not available');
      return;
    }
    router.push(`/vehicles/${params.id}/book`);
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mockVehicle.year} ${mockVehicle.make} ${mockVehicle.model}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/vehicles" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Vehicles
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative h-96">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                    {mockVehicle.make} {mockVehicle.model} - Image {selectedImage + 1}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={handleShare}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                    >
                      <ShareIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleAddToFavorites}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                    >
                      {isFavorite ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Image Thumbnails */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {mockVehicle.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 bg-gray-200 rounded-lg ${
                          selectedImage === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                      >
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'features', label: 'Features' },
                      { id: 'specifications', label: 'Specifications' },
                      { id: 'reviews', label: 'Reviews' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About this vehicle</h3>
                      <p className="text-gray-600 mb-6">{mockVehicle.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <UsersIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900">{mockVehicle.seats} Seats</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <CogIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900">{mockVehicle.transmission}</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <MapPinIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900">{mockVehicle.fuelType}</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <CalendarDaysIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900">{mockVehicle.year}</div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Pickup Location</h4>
                        <p className="text-gray-600 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {mockVehicle.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Features Tab */}
                  {activeTab === 'features' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Included Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mockVehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specifications Tab */}
                  {activeTab === 'specifications' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Specifications</h3>
                      <div className="space-y-4">
                        {Object.entries(mockVehicle.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {mockVehicle.rating} ({mockVehicle.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {mockVehicle.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">{review.user}</span>
                                <div className="flex ml-2">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
                  </h2>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {mockVehicle.rating} ({mockVehicle.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">{mockVehicle.categoryName}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary-600">
                    ${mockVehicle.dailyRate}
                    <span className="text-lg font-normal text-gray-500">/day</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Free cancellation up to 24 hours</p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    {mockVehicle.seats} seats
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CogIcon className="h-4 w-4 mr-2" />
                    {mockVehicle.transmission}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {mockVehicle.fuelType}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {mockVehicle.color}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mb-6">
                  {mockVehicle.isAvailable ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Available Now</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Currently Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleBookNow}
                    disabled={!mockVehicle.isAvailable}
                    className={`w-full py-3 px-4 rounded-lg font-medium ${
                      mockVehicle.isAvailable
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {mockVehicle.isAvailable ? 'Book This Vehicle' : 'Not Available'}
                  </button>
                  
                  <button className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                    Contact Us
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Rate</span>
                      <span>${mockVehicle.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mileage</span>
                      <span>200 miles/day</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>+ taxes & fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}