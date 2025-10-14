import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import PaymentService, { PaymentMethod, PaymentResponse, PaymentStatus } from '@/services/PaymentService';
import BookingService from '@/services/BookingService';
import { Booking } from '@/types';

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [bookingData, methods] = await Promise.all([
        BookingService.getBookingById(bookingId!),
        PaymentService.getPaymentMethods()
      ]);
      
      setBooking(bookingData);
      setPaymentMethods(methods.filter(m => m.isEnabled));
      setSelectedMethod(methods.find(m => m.isEnabled) || null);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking || !selectedMethod) return;

    const validation = PaymentService.validatePaymentAmount(booking.totalAmount);
    if (!validation.isValid) {
      Alert.alert('Lỗi', validation.error);
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      const paymentRequest = {
        bookingId: booking.id.toString(),
        amount: booking.totalAmount,
        paymentMethodId: selectedMethod.id,
        currency: 'VND',
        description: `Thanh toán booking #${booking.id}`,
        returnUrl: 'carrentalmobile://payment/success',
        cancelUrl: 'carrentalmobile://payment/cancel',
      };

      const paymentResponse = await PaymentService.createPayment(paymentRequest);
      setCurrentPayment(paymentResponse);

      if (paymentResponse.paymentUrl) {
        // Open payment URL in browser or WebView
        const supported = await Linking.canOpenURL(paymentResponse.paymentUrl);
        if (supported) {
          await Linking.openURL(paymentResponse.paymentUrl);
          setPaymentModalVisible(true);
        } else {
          throw new Error('Không thể mở link thanh toán');
        }
      } else if (paymentResponse.qrCode) {
        // Show QR code for scanning
        setPaymentModalVisible(true);
      } else {
        // Direct payment success
        handlePaymentSuccess(paymentResponse);
      }

    } catch (error: any) {
      Alert.alert('Lỗi thanh toán', error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!currentPayment) return;

    try {
      const status = await PaymentService.getPaymentStatus(currentPayment.paymentId);
      
      if (status.status === 'success') {
        handlePaymentSuccess(currentPayment);
      } else if (status.status === 'failed' || status.status === 'cancelled') {
        handlePaymentFailure(status);
      }
      // If still pending or processing, keep waiting
    } catch (error: any) {
      console.warn('Failed to check payment status:', error);
    }
  };

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    setPaymentModalVisible(false);
    
    Alert.alert(
      'Thanh toán thành công!',
      'Booking của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.',
      [
        {
          text: 'OK',
          onPress: () => router.replace(`/booking/${bookingId}`)
        }
      ]
    );
  };

  const handlePaymentFailure = (status: PaymentStatus) => {
    setPaymentModalVisible(false);
    
    Alert.alert(
      'Thanh toán thất bại',
      status.failureReason || 'Có lỗi xảy ra trong quá trình thanh toán',
      [
        { text: 'Thử lại', onPress: () => setCurrentPayment(null) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const calculateTotal = () => {
    if (!booking || !selectedMethod) return booking?.totalAmount || 0;
    return PaymentService.calculateTotalAmount(booking.totalAmount, selectedMethod);
  };

  const calculateFees = () => {
    if (!booking || !selectedMethod) return 0;
    return PaymentService.calculateFees(booking.totalAmount, selectedMethod);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin booking</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Booking Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Booking #{booking.id}</Text>
          <Text style={styles.bookingDetail}>
            Xe: {booking.vehicle?.make} {booking.vehicle?.model}
          </Text>
          <Text style={styles.bookingDetail}>
            Thời gian: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodCard,
              selectedMethod?.id === method.id && styles.paymentMethodSelected
            ]}
            onPress={() => setSelectedMethod(method)}
          >
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                {method.description && (
                  <Text style={styles.paymentMethodDesc}>{method.description}</Text>
                )}
                {method.fees && method.fees.percentage > 0 && (
                  <Text style={styles.paymentMethodFee}>
                    Phí: {method.fees.percentage}%
                  </Text>
                )}
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radio,
                  selectedMethod?.id === method.id && styles.radioSelected
                ]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá thuê xe:</Text>
            <Text style={styles.summaryValue}>
              {PaymentService.formatCurrency(booking.totalAmount)}
            </Text>
          </View>
          
          {selectedMethod && calculateFees() > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí thanh toán:</Text>
              <Text style={styles.summaryValue}>
                {PaymentService.formatCurrency(calculateFees())}
              </Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {PaymentService.formatCurrency(calculateTotal())}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isProcessingPayment) && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || isProcessingPayment}
        >
          {isProcessingPayment ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payButtonText}>
              Thanh toán {PaymentService.formatCurrency(calculateTotal())}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment Processing Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đang xử lý thanh toán</Text>
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#2196F3" style={styles.modalLoader} />
            <Text style={styles.modalText}>
              Vui lòng hoàn thành thanh toán trong ứng dụng/trang web đã mở
            </Text>
            <Text style={styles.modalSubText}>
              Sau khi thanh toán xong, hãy quay lại ứng dụng và nhấn "Kiểm tra trạng thái"
            </Text>

            <TouchableOpacity
              style={styles.checkStatusButton}
              onPress={checkPaymentStatus}
            >
              <Text style={styles.checkStatusButtonText}>Kiểm tra trạng thái</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelPaymentButton}
              onPress={() => {
                setPaymentModalVisible(false);
                setCurrentPayment(null);
              }}
            >
              <Text style={styles.cancelPaymentButtonText}>Hủy thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bookingCard: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  bookingDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  paymentMethodSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#f3f8ff',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  paymentMethodDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  paymentMethodFee: {
    fontSize: 12,
    color: '#FF5722',
  },
  radioContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  radioSelected: {
    backgroundColor: '#2196F3',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  footer: {
    padding: 20,
  },
  payButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoader: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  checkStatusButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  checkStatusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelPaymentButton: {
    borderWidth: 1,
    borderColor: '#FF5722',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelPaymentButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
  },
});