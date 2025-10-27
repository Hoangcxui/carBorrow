import apiClient from './api';
import { LoginDto, RegisterDto, TokenResponse, User } from '@/types';

export const authService = {
  // Login
  async login(credentials: LoginDto): Promise<TokenResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  async register(userData: RegisterDto): Promise<void> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Refresh token
  async refreshToken(token: string, refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post('/auth/refresh', { token, refreshToken });
    return response.data;
  },

  // Logout (revoke token)
  async logout(refreshToken: string): Promise<void> {
    const response = await apiClient.post('/auth/revoke', { refreshToken });
    return response.data;
  },
};