import ApiService from './ApiService';
import config from '../config';

class TestConnectionService {
  /**
   * Test connection to backend API
   */
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('Testing connection to:', config.API_BASE_URL);
      
      // Test health check endpoint
      const response = await ApiService.get('/health');
      
      return {
        success: true,
        message: 'Connection successful!',
        data: response.data
      };
    } catch (error: any) {
      console.error('Connection test failed:', error);
      
      let message = 'Connection failed';
      
      if (error.code === 'ECONNREFUSED') {
        message = `Cannot connect to backend at ${config.API_BASE_URL}. Make sure the backend is running.`;
      } else if (error.response) {
        message = `Server responded with error: ${error.response.status}`;
      } else if (error.request) {
        message = 'No response from server. Check your network connection.';
      } else {
        message = error.message || 'Unknown error occurred';
      }
      
      return {
        success: false,
        message,
        data: error.response?.data
      };
    }
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return config.API_BASE_URL;
  }

  /**
   * Test authentication endpoints
   */
  async testAuthEndpoints(): Promise<{ success: boolean; endpoints: any[] }> {
    const endpoints = [
      { name: 'Health Check', path: '/health' },
      { name: 'Swagger', path: '/swagger' },
      { name: 'Auth - Login', path: '/api/auth/login', method: 'POST' },
      { name: 'Auth - Register', path: '/api/auth/register', method: 'POST' },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        if (endpoint.method === 'POST') {
          // Just check if endpoint exists (will fail with 400 but that's OK)
          await ApiService.post(endpoint.path, {});
        } else {
          await ApiService.get(endpoint.path);
        }
        results.push({ ...endpoint, status: 'Available' });
      } catch (error: any) {
        const status = error.response?.status || 'Error';
        results.push({ ...endpoint, status });
      }
    }

    return {
      success: true,
      endpoints: results
    };
  }
}

export default new TestConnectionService();
