import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Booking } from '@/types';
import BookingService from '@/services/BookingService';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookingDetail();
  }, [id]);

  const loadBookingDetail = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const data = await BookingService.getBookingById(id);
      setBooking(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      'Hủy đặt xe',
      'Bạn có chắc chắn muốn hủy đặt xe này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đặt xe',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookingService.cancelBooking(booking.id);
              Alert.alert('Thành công', 'Đã hủy đặt xe', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert('Lỗi', error.message);
            }
          },
        },
      ]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#fef3c7', color: '#92400e', text: 'Chờ xác nhận' };
      case 'Confirmed':
        return { backgroundColor: '#dbeafe', color: '#1e40af', text: 'Đã xác nhận' };
      case 'InProgress':
        return { backgroundColor: '#d1fae5', color: '#065f46', text: 'Đang thuê' };
      case 'Completed':
        return { backgroundColor: '#e5e7eb', color: '#374151', text: 'Hoàn thành' };
      case 'Cancelled':
        return { backgroundColor: '#fee2e2', color: '#991b1b', text: 'Đã hủy' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280', text: status };
    }
  };

  const calculateDays = () => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin đặt xe</Text>
      </View>
    );
  }

  const statusStyle = getStatusStyle(booking.status);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đặt xe</Text>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {statusStyle.text}
          </Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        {booking.vehicle?.imageUrl && (
          <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.vehicleImage} />
        )}
        <Text style={styles.vehicleTitle}>
          {booking.vehicle?.make} {booking.vehicle?.model}
        </Text>
        {booking.vehicle?.year && (
          <Text style={styles.vehicleDetails}>Năm sản xuất: {booking.vehicle.year}</Text>
        )}
        <Text style={styles.vehicleDetails}>Biển số: {booking.vehicle?.licensePlate}</Text>
        <Text style={styles.vehicleDetails}>Màu sắc: {booking.vehicle?.color}</Text>
      </View>

      {/* Booking Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đặt xe</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày nhận xe:</Text>
          <Text style={styles.infoValue}>
            {new Date(booking.startDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày trả xe:</Text>
          <Text style={styles.infoValue}>
            {new Date(booking.endDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số ngày thuê:</Text>
          <Text style={styles.infoValue}>{calculateDays()} ngày</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày đặt:</Text>
          <Text style={styles.infoValue}>
            {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        {booking.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.infoLabel}>Ghi chú:</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Giá thuê mỗi ngày:</Text>
          <Text style={styles.priceValue}>
            {booking.vehicle?.pricePerDay.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Số ngày:</Text>
          <Text style={styles.priceValue}>{calculateDays()} ngày</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>
            {booking.totalAmount.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>📞 Hotline: 1900-xxxx</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>✉️ Email: support@carrental.com</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      {booking.status === 'Pending' && (
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
            <Text style={styles.cancelButtonText}>Hủy đặt xe</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSpace} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
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
  statusContainer: {
    alignItems: 'center',
    padding: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  vehicleDetails: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 12,
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 2,
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
  contactButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 32,
  },
});