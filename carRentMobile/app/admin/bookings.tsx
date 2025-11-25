import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import config from '@/config';

const API_BASE_URL = config.API_BASE_URL;

interface Booking {
  id: number;
  bookingId?: number;
  vehicleId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  dropoffDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
}

export default function AdminBookingsScreen() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user?.role === 'Admin' || user?.role === 'Staff') {
      loadBookings();
    }
  }, [user, filter]);

  const loadBookings = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_BASE_URL}/api/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Backend returns { value: [...], Count: n }, extract the value array
      const bookingsData = response.data.value || response.data;
      
      let filteredBookings = bookingsData;
      if (filter !== 'all') {
        filteredBookings = filteredBookings.filter((b: Booking) => 
          b.status.toLowerCase() === filter
        );
      }
      
      setBookings(filteredBookings);
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể tải danh sách bookings');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const token = await getToken();
      await axios.put(
        `${API_BASE_URL}/api/booking/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Thành công', 'Đã cập nhật trạng thái booking');
      loadBookings();
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const confirmStatusChange = (bookingId: number, newStatus: string) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn đổi trạng thái thành "${newStatus}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xác nhận', onPress: () => updateBookingStatus(bookingId, newStatus) },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'Staff')) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bạn không có quyền truy cập</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý Bookings</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, filter === status && styles.filterTabActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]}>
              {status === 'all' ? 'Tất cả' : getStatusText(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Không có booking nào</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>#{booking.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                </View>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.customerName}>{booking.customerName}</Text>
                <Text style={styles.customerContact}>{booking.customerEmail}</Text>
                <Text style={styles.customerContact}>{booking.customerPhone}</Text>
              </View>

              <View style={styles.bookingDates}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Nhận xe:</Text>
                  <Text style={styles.dateValue}>
                    {new Date(booking.pickupDate).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Trả xe:</Text>
                  <Text style={styles.dateValue}>
                    {new Date(booking.dropoffDate).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingFooter}>
                <View>
                  <Text style={styles.paymentMethod}>
                    {booking.paymentMethod === 'qr' ? '💳 QR' : '💵 COD'}
                  </Text>
                  <Text style={styles.totalAmount}>${booking.totalAmount.toFixed(2)}</Text>
                </View>

                {booking.status.toLowerCase() === 'pending' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={() => confirmStatusChange(booking.id, 'Confirmed')}
                    >
                      <Text style={styles.actionButtonText}>Duyệt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => confirmStatusChange(booking.id, 'Cancelled')}
                    >
                      <Text style={styles.actionButtonText}>Từ chối</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {booking.status.toLowerCase() === 'confirmed' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => confirmStatusChange(booking.id, 'Completed')}
                  >
                    <Text style={styles.actionButtonText}>Hoàn thành</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.spacer} />
      </ScrollView>
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
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
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
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: '#3b82f6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
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
  },
  bookingId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  bookingDates: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  completeButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});
