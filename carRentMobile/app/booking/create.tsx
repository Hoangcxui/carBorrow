import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Vehicle } from '@/types';
import VehicleService from '@/services/VehicleService';
import BookingService from '@/services/BookingService';
import NotificationService from '@/services/NotificationService';

export default function CreateBookingScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [notes, setNotes] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVehicle();
  }, [vehicleId]);

  const loadVehicle = async () => {
    if (!vehicleId) return;
    
    try {
      const data = await VehicleService.getVehicleById(vehicleId);
      setVehicle(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      router.back();
    }
  };

  const calculateTotalDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateTotalAmount = () => {
    if (!vehicle) return 0;
    return calculateTotalDays() * vehicle.pricePerDay;
  };

  const handleCreateBooking = async () => {
    if (!vehicle) return;

    if (startDate >= endDate) {
      Alert.alert('Lỗi', 'Ngày trả xe phải sau ngày nhận xe');
      return;
    }

    try {
      setIsLoading(true);
      
      const booking = await BookingService.createBooking({
        vehicleId: vehicle.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        notes: notes.trim() || undefined,
      });

      // Schedule notifications for the booking
      try {
        await NotificationService.scheduleBookingReminder(booking.id.toString(), startDate);
        await NotificationService.scheduleReturnReminder(booking.id.toString(), endDate);
        console.log('Notifications scheduled for booking:', booking.id);
      } catch (notifError) {
        console.warn('Failed to schedule notifications:', notifError);
      }

      // Navigate to payment screen
      Alert.alert(
        'Đặt xe thành công!',
        'Vui lòng thanh toán để hoàn tất booking.',
        [
          {
            text: 'Thanh toán ngay',
            onPress: () => router.push(`/payment/${booking.id}` as any),
          },
          {
            text: 'Thanh toán sau',
            style: 'cancel',
            onPress: () => router.replace('/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Đặt xe thất bại', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // Tự động cập nhật ngày kết thúc nếu nó trước ngày bắt đầu
      if (selectedDate >= endDate) {
        setEndDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate > startDate) {
      setEndDate(selectedDate);
    }
  };

  if (!vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt xe</Text>
      </View>

      {/* Thông tin xe */}
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </Text>
        <Text style={styles.vehicleDetails}>
          Biển số: {vehicle.licensePlate} • Màu: {vehicle.color}
        </Text>
        <Text style={styles.vehiclePrice}>
          {vehicle.pricePerDay.toLocaleString('vi-VN')} VNĐ/ngày
        </Text>
      </View>

      {/* Form đặt xe */}
      <View style={styles.form}>
        {/* Ngày nhận xe */}
        <View style={styles.dateSection}>
          <Text style={styles.label}>Ngày nhận xe</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateText}>
              {startDate.toLocaleDateString('vi-VN')}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={startDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={onStartDateChange}
            />
          )}
        </View>

        {/* Ngày trả xe */}
        <View style={styles.dateSection}>
          <Text style={styles.label}>Ngày trả xe</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateText}>
              {endDate.toLocaleDateString('vi-VN')}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={endDate}
              mode="date"
              display="default"
              minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
              onChange={onEndDateChange}
            />
          )}
        </View>

        {/* Ghi chú */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Ghi chú (tùy chọn)</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú về yêu cầu đặc biệt..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Tóm tắt đơn hàng */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Số ngày thuê:</Text>
          <Text style={styles.summaryValue}>{calculateTotalDays()} ngày</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giá mỗi ngày:</Text>
          <Text style={styles.summaryValue}>
            {vehicle.pricePerDay.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>
            {calculateTotalAmount().toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      </View>

      {/* Nút đặt xe */}
      <TouchableOpacity
        style={[styles.bookButton, isLoading && styles.disabledButton]}
        onPress={handleCreateBooking}
        disabled={isLoading}
      >
        <Text style={styles.bookButtonText}>
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt xe'}
        </Text>
      </TouchableOpacity>

      {/* Lưu ý */}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Lưu ý:</Text>
        <Text style={styles.noticeText}>
          • Bạn cần thanh toán 30% tiền cọc trước khi nhận xe{'\n'}
          • Mang theo CMND/CCCD và bằng lái xe khi nhận xe{'\n'}
          • Chúng tôi sẽ liên hệ xác nhận đặt xe trong 24h
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  vehicleInfo: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  form: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
  },
  inputSection: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    minHeight: 80,
  },
  summary: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notice: {
    backgroundColor: '#fef3c7',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});