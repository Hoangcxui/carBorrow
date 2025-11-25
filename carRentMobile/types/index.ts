export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'Admin' | 'Staff' | 'Customer';
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber?: string;
}

export interface AuthResult {
  token: string;
  refreshToken: string;
  user: User;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  dailyRate: number; // Backend uses dailyRate instead of pricePerDay
  pricePerDay?: number; // Keep for backward compatibility
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  description?: string;
  seats?: number;
  transmission?: 'automatic' | 'manual' | '';
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | '';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  notes?: string;
  user?: User;
  vehicle?: Vehicle;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}