'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/lib/auth';
import { User, LoginDto, RegisterDto } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const userData = await authService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      // Token might be expired, clear cookies
      Cookies.remove('token');
      Cookies.remove('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      setIsLoading(true);
      const tokenResponse = await authService.login(credentials);
      
      // Store tokens
      Cookies.set('token', tokenResponse.token, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', tokenResponse.refreshToken, { expires: 7 }); // 7 days

      // Get user profile
      const userData = await authService.getProfile();
      setUser(userData);

      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterDto) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      toast.success('Registration successful! Please login.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}