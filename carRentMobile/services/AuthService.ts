import AuthApiService from './AuthApiService';
import StorageService from './StorageService';
import { LoginDto, RegisterDto, AuthResult, ApiResponse } from '../types';

export class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResult> {
    try {
      const response = await AuthApiService.login(loginDto.email, loginDto.password);
      
      if (response.success && response.data) {
        // Ensure tokens are strings, handle all edge cases
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        
        if (!accessToken || typeof accessToken !== 'string') {
          throw new Error('Invalid access token received from server');
        }
        
        if (!refreshToken || typeof refreshToken !== 'string') {
          throw new Error('Invalid refresh token received from server');
        }
        
        // Store tokens securely
        await StorageService.setItem('accessToken', accessToken);
        await StorageService.setItem('refreshToken', refreshToken);
        
        // Return user info (mock for now, backend doesn't return user in login response)
        return {
          user: {
            id: 1,
            email: loginDto.email,
            fullName: 'Admin User',
            role: 'Admin'
          },
          token: accessToken,
          refreshToken: refreshToken
        };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
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