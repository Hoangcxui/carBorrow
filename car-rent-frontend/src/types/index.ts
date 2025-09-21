export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expires: string;
  userName: string;
  role: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  images?: VehicleImage[];
}

export interface VehicleImage {
  id: number;
  vehicleId: number;
  imagePath: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Rental {
  id: number;
  userId: number;
  userName: string;
  vehicleId: number;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  createdAt: string;
}

export interface CreateRentalDto {
  userId: number;
  vehicleId: number;
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}