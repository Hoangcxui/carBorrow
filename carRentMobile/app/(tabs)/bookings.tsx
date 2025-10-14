import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Booking } from '@/types';
import BookingService from '@/services/BookingService';

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await BookingService.getMyBookings();
      setBookings(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  };

  const handleCancelBooking = (bookingId: string) => {
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
              await BookingService.cancelBooking(bookingId);
              Alert.alert('Thành công', 'Đã hủy đặt xe');
              loadBookings();
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
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Confirmed':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'InProgress':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'Completed':
        return { backgroundColor: '#e5e7eb', color: '#374151' };
      case 'Cancelled':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xác nhận';
      case 'Confirmed':
        return 'Đã xác nhận';
      case 'InProgress':
        return 'Đang thuê';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const statusStyle = getStatusStyle(item.status);
    
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.vehicleTitle}>
            {item.vehicle?.make} {item.vehicle?.model}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.licensePlate}>Biển số: {item.vehicle?.licensePlate}</Text>
        
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Từ:</Text>
          <Text style={styles.dateValue}>
            {new Date(item.startDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Đến:</Text>
          <Text style={styles.dateValue}>
            {new Date(item.endDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Tổng tiền:</Text>
          <Text style={styles.amountValue}>
            {item.totalAmount.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        
        {item.notes && (
          <Text style={styles.notes}>Ghi chú: {item.notes}</Text>
        )}
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => router.push(`/booking/${item.id}`)}
          >
            <Text style={styles.detailButtonText}>Chi tiết</Text>
          </TouchableOpacity>
          
          {item.status === 'Pending' && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.cancelButtonText}>Hủy đặt</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đặt xe của tôi</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Đang tải...' : 'Chưa có đặt xe nào'}
            </Text>
            {!isLoading && (
              <>
                <Text style={styles.emptyDescription}>
                  Bạn chưa có đặt xe nào. Hãy chọn xe yêu thích và đặt ngay!
                </Text>
                <TouchableOpacity 
                  style={styles.createButton} 
                  onPress={() => router.push('/vehicles')}
                >
                  <Text style={styles.createButtonText}>Xem danh sách xe</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  list: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  licensePlate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 40,
  },
  dateValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});