'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="page-container">
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 rounded-xl">
              <span className="text-2xl font-black text-white">CarBorrow</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-5 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-gray-50">
              Trang chủ
            </Link>
            <Link href="/vehicles" className="px-5 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-gray-50">
              Xe
            </Link>
            <Link href="/about" className="px-5 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-gray-50">
              Giới thiệu
            </Link>
            <Link href="/contact" className="px-5 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-gray-50">
              Liên hệ
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  href="/dashboard" 
                  className="px-5 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-gray-50"
                >
                  Bảng điều khiển
                </Link>
                
                {user?.role === 'Admin' && (
                  <Link 
                    href="/admin" 
                    className="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
                  >
                    Quản trị
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="px-5 py-2 text-primary-600 hover:text-primary-700 font-bold transition-colors rounded-lg hover:bg-primary-50"
                >
                  Xin chào, {user?.firstName}
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/login" className="px-6 py-3 text-gray-700 hover:text-primary-600 font-bold transition-colors rounded-xl hover:bg-gray-50">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none p-2"
            >
              {isOpen ? (
                <span className="text-2xl font-bold">×</span>
              ) : (
                <span className="text-2xl font-bold">≡</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/vehicles" 
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Xe
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Liên hệ
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Bảng điều khiển
                    </Link>
                    
                    {user?.role === 'Admin' && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}
                    
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-primary-600 hover:text-primary-700 font-bold hover:bg-primary-50 transition-colors rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Xin chào, {user?.firstName} {user?.lastName}
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-lg"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-semibold transition-colors rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      href="/register" 
                      className="block px-4 py-3 bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Đăng ký
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