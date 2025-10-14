import ApiService from './ApiService';
import { Booking, ApiResponse } from '../types';

export interface CreateBookingDto {
  vehicleId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export class BookingService {
  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const response = await ApiService.post<ApiResponse<Booking>>('/api/bookings', createBookingDto);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Booking creation failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await ApiService.get<ApiResponse<Booking[]>>('/api/bookings/my');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await ApiService.get<ApiResponse<Booking>>(`/api/bookings/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Booking not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      const response = await ApiService.put<ApiResponse>(`/api/bookings/${id}/cancel`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Cancel booking failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }

  async updateBooking(id: string, updateData: Partial<CreateBookingDto>): Promise<Booking> {
    try {
      const response = await ApiService.put<ApiResponse<Booking>>(`/api/bookings/${id}`, updateData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Update booking failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  }
}

export default new BookingService();