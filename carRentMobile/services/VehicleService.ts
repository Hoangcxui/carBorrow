import ApiService from './ApiService';
import { Vehicle, ApiResponse } from '../types';

export interface VehicleSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: 'automatic' | 'manual';
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  startDate?: string;
  endDate?: string;
}

export class VehicleService {
  async getVehicles(params: VehicleSearchParams = {}): Promise<Vehicle[]> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await ApiService.get<ApiResponse<Vehicle[]>>(`/api/vehicles?${queryParams.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
    }
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const response = await ApiService.get<ApiResponse<Vehicle>>(`/api/vehicles/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Vehicle not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle');
    }
  }

  async getAvailableVehicles(startDate: string, endDate: string): Promise<Vehicle[]> {
    try {
      const response = await ApiService.get<ApiResponse<Vehicle[]>>(
        `/api/vehicles/available?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available vehicles');
    }
  }

  async searchVehicles(query: string, filters?: Omit<VehicleSearchParams, 'search'>): Promise<Vehicle[]> {
    try {
      const params = { search: query, ...filters };
      return this.getVehicles(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  async getVehicleCategories(): Promise<string[]> {
    try {
      const response = await ApiService.get<ApiResponse<string[]>>('/api/vehicles/categories');
      return response.data.data || [];
    } catch (error: any) {
      console.warn('Failed to fetch categories:', error);
      return ['sedan', 'suv', 'hatchback', 'pickup', 'luxury']; // fallback
    }
  }
}

export default new VehicleService();