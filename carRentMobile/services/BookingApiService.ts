import ApiService from './ApiService';

/**
 * Booking Service
 * Handles all booking-related API calls
 */
class BookingApiService {
  /**
   * Get all bookings for current user
   */
  async getMyBookings(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const queryString = params ? this.buildQueryString(params) : '';
      const response = await ApiService.get(`/api/booking/my-bookings${queryString}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: number) {
    try {
      const response = await ApiService.get(`/api/booking/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new booking
   */
  async createBooking(data: {
    vehicleId: number;
    startDate: string;
    endDate: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) {
    try {
      const response = await ApiService.post('/api/booking', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update booking
   */
  async updateBooking(id: number, data: {
    startDate?: string;
    endDate?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) {
    try {
      const response = await ApiService.put(`/api/booking/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: number, reason?: string) {
    try {
      const response = await ApiService.post(`/api/booking/${id}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate booking price
   */
  async calculatePrice(vehicleId: number, startDate: string, endDate: string) {
    try {
      const response = await ApiService.post('/api/booking/calculate-price', {
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
   * Confirm booking pickup
   */
  async confirmPickup(id: number) {
    try {
      const response = await ApiService.post(`/api/booking/${id}/pickup`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Confirm booking return
   */
  async confirmReturn(id: number, data?: {
    actualReturnDate?: string;
    condition?: string;
    notes?: string;
  }) {
    try {
      const response = await ApiService.post(`/api/booking/${id}/return`, data);
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

export default new BookingApiService();
