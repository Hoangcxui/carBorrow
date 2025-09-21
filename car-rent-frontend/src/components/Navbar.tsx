'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  CarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="page-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <CarIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">CarBorrow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/vehicles" className="text-gray-700 hover:text-primary-600 transition-colors">
              Vehicles
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName}
                </span>
                
                {user?.role === 'Admin' && (
                  <Link 
                    href="/admin" 
                    className="btn-secondary text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                
                <Link 
                  href="/dashboard" 
                  className="btn-secondary text-sm"
                >
                  Dashboard
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="btn-primary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/vehicles" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Vehicles
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 pt-4 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    
                    {user?.role === 'Admin' && (
                      <Link 
                        href="/admin" 
                        className="block text-gray-700 hover:text-primary-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <Link 
                      href="/dashboard" 
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}