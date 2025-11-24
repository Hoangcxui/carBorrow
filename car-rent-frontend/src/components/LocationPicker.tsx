'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
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

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await apiClient.get('/location');
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast.error('Không thể tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      
      {loading ? (
        <div className="text-gray-500 text-sm">Đang tải địa điểm...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => onChange(location.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                value === location.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value === location.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {value === location.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{location.name}</h3>
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
