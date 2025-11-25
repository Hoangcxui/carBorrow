import ApiService from './ApiService';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Authentication Service
 * Handles login, register, logout, and token management
 */
class AuthApiService {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await ApiService.post('/api/auth/login', {
        email,
        password
      });
      
      // Backend returns: { message, accessToken, refreshToken }
      // Convert to ApiResponse format
      return {
        success: true,
        message: response.data.message,
        data: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }): Promise<ApiResponse> {
    try {
      const response = await ApiService.post('/api/auth/register', data);
      return response.data as ApiResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse> {
    try {
      const response = await ApiService.post('/api/auth/refresh', {
        refreshToken
      });
      return response.data as ApiResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await ApiService.clearTokens();
      // Optional: Call backend logout endpoint if exists
      // await ApiService.post('/api/auth/logout');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await ApiService.get('/api/auth/me');
      return response.data as ApiResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await ApiService.put('/api/auth/profile', data);
      return response.data as ApiResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await ApiService.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data as ApiResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.data?.title || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // No response from server
      return new Error('Cannot connect to server. Please check your internet connection.');
    } else {
      // Other errors
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new AuthApiService();
