import AuthApiService from './AuthApiService';
import StorageService from './StorageService';
import { LoginDto, RegisterDto, AuthResult, ApiResponse } from '../types';

export class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResult> {
    try {
      const response = await AuthApiService.login(loginDto.email, loginDto.password);
      
      if (response.success && response.data) {
        // Store tokens securely
        await StorageService.setItem('accessToken', response.data.token);
        await StorageService.setItem('refreshToken', response.data.refreshToken);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    try {
      const response = await AuthApiService.register({
        email: registerDto.email,
        password: registerDto.password,
        fullName: registerDto.fullName,
        phoneNumber: registerDto.phoneNumber || ''
      });
      
      if (response.success && response.data) {
        // Store tokens securely
        await StorageService.setItem('accessToken', response.data.token);
        await StorageService.setItem('refreshToken', response.data.refreshToken);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async logout(): Promise<void> {
    try {
      await AuthApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await AuthApiService.getCurrentUser();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await StorageService.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();