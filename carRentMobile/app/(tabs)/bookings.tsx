import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookingApiService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: number;
  vehicleId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocationId: number;
  dropoffLocationId: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user?.email) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem booking');
      return;
    }

    try {
      setIsLoading(true);
      const data = await BookingApiService.getMyBookings(user.email);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  };

  const handleCancelBooking = (bookingId: number) => {
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
              await BookingApiService.cancelBooking(bookingId);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'confirmed':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'active':
      case 'in-progress':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'completed':
        return { bg: '#e5e7eb', text: '#374151' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'active':
      case 'in-progress':
        return 'Đang thuê';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const statusColor = getStatusColor(item.status);
    const canCancel = item.status.toLowerCase() === 'pending';

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.bookingInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Ngày nhận:</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.pickupDate)} {item.pickupTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Ngày trả:</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.dropoffDate)} {item.dropoffTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>💰 Tổng tiền:</Text>
            <Text style={styles.infoPrice}>
              {item.totalAmount.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>💳 Thanh toán:</Text>
            <Text style={styles.infoValue}>
              {item.paymentMethod === 'qr' ? 'Chuyển khoản' : 'Tiền mặt'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📊 TT thanh toán:</Text>
            <Text style={[styles.infoValue, { color: item.paymentStatus === 'paid' ? '#059669' : '#f59e0b' }]}>
              {item.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Text>
          </View>
        </View>

        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => router.push(`/booking/${item.id}` as any)}
          >
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
          
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.cancelButtonText}>Hủy booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🚗</Text>
      <Text style={styles.emptyTitle}>Chưa có booking nào</Text>
      <Text style={styles.emptyText}>
        Hãy chọn xe bạn thích và đặt xe ngay!
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/vehicles' as any)}
      >
        <Text style={styles.browseButtonText}>Xem danh sách xe</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && bookings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải booking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking của tôi</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          bookings.length === 0 && styles.listContainerEmpty
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listContainer: {
    padding: 16,
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoPrice: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  browseButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
