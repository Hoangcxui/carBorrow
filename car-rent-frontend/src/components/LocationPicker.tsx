'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  description: string;
}

interface LocationPickerProps {
  label: string;
  value?: number;
  onChange: (locationId: number) => void;
  error?: string;
}

export default function LocationPicker({ label, value, onChange, error }: LocationPickerProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (value && locations.length > 0) {
      const location = locations.find(loc => loc.id === value);
      setSelectedLocation(location || null);
    }
  }, [value, locations]);

  const fetchLocations = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/location`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast.error('Không thể tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      
      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải địa điểm...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location List */}
          <div className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => {
                  onChange(location.id);
                  setSelectedLocation(location);
                }}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                  value === location.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    value === location.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {value === location.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{location.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{location.address}</p>
                    {location.description && (
                      <p className="text-xs text-gray-500 mt-1">{location.description}</p>
                    )}
                    {location.phoneNumber && (
                      <p className="text-xs text-blue-600 mt-1">
                        <span className="inline-block mr-1">📞</span>
                        {location.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Google Maps Embed */}
          <div className="lg:sticky lg:top-4 h-fit">
            {selectedLocation ? (
              <div className="border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h4 className="font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedLocation.name}
                  </h4>
                  <p className="text-xs mt-1 text-blue-100">{selectedLocation.address}</p>
                </div>
                <iframe
                  src={`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&hl=vi&z=16&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title={`Bản đồ ${selectedLocation.name}`}
                />
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Mở trong Google Maps
                  </a>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 font-medium">Chọn một địa điểm</p>
                <p className="text-sm text-gray-400 mt-1">Bản đồ sẽ hiển thị tại đây</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {!loading && locations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có địa điểm nào
        </div>
      )}
    </div>
  );
}
