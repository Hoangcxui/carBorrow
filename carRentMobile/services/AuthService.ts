import ApiService from './ApiService';
import * as SecureStore from 'expo-secure-store';
import { LoginDto, RegisterDto, AuthResult, ApiResponse } from '../types';

export class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResult> {
    try {
      const response = await ApiService.post<ApiResponse<AuthResult>>('/api/auth/login', loginDto);
      
      if (response.data.success && response.data.data) {
        // Store tokens securely
        await SecureStore.setItemAsync('accessToken', response.data.data.token);
        await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    try {
      const response = await ApiService.post<ApiResponse<AuthResult>>('/api/auth/register', registerDto);
      
      if (response.data.success && response.data.data) {
        // Store tokens securely
        await SecureStore.setItemAsync('accessToken', response.data.data.token);
        await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  async logout(): Promise<void> {
    try {
      await ApiService.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored tokens
      await ApiService.clearTokens();
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await ApiService.get<ApiResponse>('/api/auth/me');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();