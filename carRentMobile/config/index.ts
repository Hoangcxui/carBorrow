const config = {
  // API Configuration
  API_BASE_URL: 'http://localhost:5000',
  API_TIMEOUT: 10000,
  
  // Authentication
  TOKEN_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  
  // App Settings
  APP_NAME: 'Car Rental',
  VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Theme
  COLORS: {
    primary: '#3b82f6',
    secondary: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      light: '#9ca3af',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      card: '#ffffff',
    },
    border: '#d1d5db',
  },
  
  // Development
  DEBUG: __DEV__,
  ENABLE_LOGS: __DEV__,
};

export default config;