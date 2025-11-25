import ApiService from './ApiService';

/**
 * Vehicle Service
 * Handles all vehicle-related API calls
 */
class VehicleApiService {
  /**
   * Get all vehicles with optional filters
   */
  async getVehicles(params?: {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const queryString = params ? this.buildQueryString(params) : '';
      const response = await ApiService.get(`/api/vehicle${queryString}`);
      // Backend returns { data: [...], page, pageSize, totalCount }
      return response.data.data || response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: number) {
    try {
      const response = await ApiService.get(`/api/vehicle/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get vehicle categories
   */
  async getCategories() {
    try {
      const response = await ApiService.get('/api/vehicle/categories');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Check vehicle availability
   */
  async checkAvailability(vehicleId: number, startDate: string, endDate: string) {
    try {
      const response = await ApiService.post('/api/vehicle/check-availability', {
        vehicleId,
        startDate,
        endDate
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get featured vehicles
   */
  async getFeaturedVehicles() {
    try {
      const response = await ApiService.get('/api/vehicle/featured');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: Record<string, any>): string {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return query ? `?${query}` : '';
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

export default new VehicleApiService();
