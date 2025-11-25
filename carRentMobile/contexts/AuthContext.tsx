import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResult } from '../types';
import AuthService from '../services/AuthService';
import StorageService from '../services/StorageService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, fullName: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const isLoggedIn = await AuthService.isLoggedIn();
      
      if (isLoggedIn) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authResult: AuthResult = await AuthService.login({ email, password });
      setUser(authResult.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    phoneNumber?: string
  ) => {
    try {
      const authResult: AuthResult = await AuthService.register({
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
      });
      setUser(authResult.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      return await StorageService.getItem('accessToken');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};