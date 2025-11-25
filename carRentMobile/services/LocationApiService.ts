import ApiService from './ApiService';

export interface Location {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  openingHours: string;
  mapUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Location Service
 * Handles all location-related API calls
 */
class LocationApiService {
  /**
   * Get all active locations
   */
  async getLocations(): Promise<Location[]> {
    try {
      const response = await ApiService.get<Location[]>('/api/location');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: number): Promise<Location> {
    try {
      const response = await ApiService.get<Location>(`/api/location/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.title || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Cannot connect to server. Please check your internet connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new LocationApiService();
