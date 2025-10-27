import ApiService from './ApiService';
import { ApiResponse } from '../types';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'momo' | 'zalopay' | 'vnpay' | 'banking';
  name: string;
  icon: string;
  isEnabled: boolean;
  description?: string;
  fees?: {
    fixed: number;
    percentage: number;
  };
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethodId: string;
  currency: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  paymentUrl?: string; // For redirect payments
  qrCode?: string; // For QR code payments
  transactionId?: string;
  gatewayResponse?: any;
  expiresAt?: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  paidAt?: string;
  failureReason?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
}

export interface PaymentHistory {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  failureReason?: string;
}

export class PaymentService {
  // Get available payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await ApiService.get<ApiResponse<PaymentMethod[]>>('/api/payment/methods');
      return response.data.data || [];
    } catch (error: any) {
      console.warn('Failed to fetch payment methods:', error);
      // Return default payment methods as fallback
      return this.getDefaultPaymentMethods();
    }
  }

  private getDefaultPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'vnpay',
        type: 'vnpay',
        name: 'VNPay',
        icon: '💳',
        isEnabled: true,
        description: 'Thanh toán qua VNPay QR Code',
        fees: { fixed: 0, percentage: 2.5 }
      },
      {
        id: 'momo',
        type: 'momo',
        name: 'MoMo',
        icon: '🎯',
        isEnabled: true,
        description: 'Ví điện tử MoMo',
        fees: { fixed: 0, percentage: 2.0 }
      },
      {
        id: 'zalopay',
        type: 'zalopay',
        name: 'ZaloPay',
        icon: '💙',
        isEnabled: true,
        description: 'Ví điện tử ZaloPay',
        fees: { fixed: 0, percentage: 2.0 }
      },
      {
        id: 'banking',
        type: 'banking',
        name: 'Chuyển khoản ngân hàng',
        icon: '🏦',
        isEnabled: true,
        description: 'Chuyển khoản trực tiếp qua ngân hàng',
        fees: { fixed: 0, percentage: 0 }
      },
      {
        id: 'credit_card',
        type: 'credit_card',
        name: 'Thẻ tín dụng',
        icon: '💳',
        isEnabled: true,
        description: 'Thanh toán bằng thẻ Visa/MasterCard',
        fees: { fixed: 0, percentage: 3.0 }
      }
    ];
  }

  // Create payment
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await ApiService.post<ApiResponse<PaymentResponse>>(
        '/api/payment/create',
        paymentRequest
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Payment creation failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  }

  // Check payment status
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await ApiService.get<ApiResponse<PaymentStatus>>(
        `/api/payment/${paymentId}/status`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to get payment status');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check payment status');
    }
  }

  // Get payment history
  async getPaymentHistory(page: number = 1, limit: number = 20): Promise<PaymentHistory[]> {
    try {
      const response = await ApiService.get<ApiResponse<PaymentHistory[]>>(
        `/api/payment/history?page=${page}&limit=${limit}`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await ApiService.post<ApiResponse<{ cancelled: boolean }>>(
        `/api/payment/${paymentId}/cancel`
      );
      return response.data.data?.cancelled || false;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel payment');
    }
  }

  // Process payment callback (for webhook/return URL processing)
  async processPaymentCallback(paymentId: string, callbackData: any): Promise<PaymentStatus> {
    try {
      const response = await ApiService.post<ApiResponse<PaymentStatus>>(
        `/api/payment/${paymentId}/callback`,
        callbackData
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Payment callback processing failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to process payment callback');
    }
  }

  // Calculate payment fees
  calculateFees(amount: number, paymentMethod: PaymentMethod): number {
    if (!paymentMethod.fees) return 0;
    
    const percentageFee = (amount * paymentMethod.fees.percentage) / 100;
    const totalFee = paymentMethod.fees.fixed + percentageFee;
    
    return Math.round(totalFee);
  }

  // Calculate total amount including fees
  calculateTotalAmount(amount: number, paymentMethod: PaymentMethod): number {
    const fees = this.calculateFees(amount, paymentMethod);
    return amount + fees;
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'VND'): string {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }

  // Validate payment amount
  validatePaymentAmount(amount: number): { isValid: boolean; error?: string } {
    if (amount <= 0) {
      return { isValid: false, error: 'Số tiền phải lớn hơn 0' };
    }
    
    if (amount < 10000) { // Minimum 10,000 VND
      return { isValid: false, error: 'Số tiền tối thiểu là 10,000 VNĐ' };
    }
    
    if (amount > 100000000) { // Maximum 100,000,000 VND
      return { isValid: false, error: 'Số tiền tối đa là 100,000,000 VNĐ' };
    }
    
    return { isValid: true };
  }
}

export default new PaymentService();