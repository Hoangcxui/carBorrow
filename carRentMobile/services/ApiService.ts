import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:5000'; // Thay đổi theo địa chỉ backend của bạn

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor để thêm JWT token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để handle token expired
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try refresh token
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });
        
        if (response.data.success) {
          await SecureStore.setItemAsync('accessToken', response.data.data.token);
          await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
        }
      }
    } catch (error) {
      // Refresh failed, redirect to login
      await this.clearTokens();
    }
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  // Generic API methods
  async get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.get(url);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.put(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete(url);
  }
}

export default new ApiService();