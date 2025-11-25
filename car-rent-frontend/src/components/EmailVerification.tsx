'use client';

import { useState, useEffect } from 'react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function EmailVerification({ email, onVerified, onCancel }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const sendCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/verification/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(data.message || 'Gửi mã thất bại');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Vui lòng nhập mã 6 chữ số');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/verification/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      
      if (response.ok) {
        onVerified();
      } else {
        setError(data.message || 'Mã xác thực không hợp lệ');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send code when component mounts
  useEffect(() => {
    sendCode();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Xác thực email</h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Mã xác thực đã được gửi đến email: <span className="font-semibold">{email}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập mã xác thực (6 chữ số)
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCode(value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
              placeholder="000000"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={sendCode}
              disabled={!canResend || isLoading}
              className={`text-sm ${
                canResend && !isLoading
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {canResend ? 'Gửi lại mã' : `Gửi lại sau ${countdown}s`}
            </button>
            <span className="text-xs text-gray-500">Mã có hiệu lực 10 phút</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={verifyCode}
              disabled={isLoading || code.length !== 6}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
