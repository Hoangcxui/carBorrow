import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { BookingApiService, VehicleApiService } from '@/services';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  totalRevenue: number;
  totalVehicles: number;
  availableVehicles: number;
}

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    totalVehicles: 0,
    availableVehicles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin' || user?.role === 'Staff') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Fetch stats from backend
      const vehicles = await VehicleApiService.getVehicles();
      const vehicleArray = Array.isArray(vehicles) ? vehicles : [];

      setStats({
        totalBookings: 0,
        pendingBookings: 0,
        activeBookings: 0,
        totalRevenue: 0,
        totalVehicles: vehicleArray.length,
        availableVehicles: vehicleArray.filter((v: any) => v.status === 'Available').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'Staff')) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedIcon}>🚫</Text>
          <Text style={styles.accessDeniedTitle}>Truy cập bị từ chối</Text>
          <Text style={styles.accessDeniedText}>
            Bạn cần quyền Admin hoặc Staff để truy cập trang này
          </Text>
        </View>
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Chào mừng, {user?.name || user?.email}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardBlue]}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>{stats.totalBookings}</Text>
              <Text style={styles.statLabel}>Tổng Bookings</Text>
            </View>
            <View style={[styles.statCard, styles.statCardYellow]}>
              <Text style={styles.statIcon}>⏳</Text>
              <Text style={styles.statValue}>{stats.pendingBookings}</Text>
              <Text style={styles.statLabel}>Chờ duyệt</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardGreen]}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{stats.activeBookings}</Text>
              <Text style={styles.statLabel}>Đang hoạt động</Text>
            </View>
            <View style={[styles.statCard, styles.statCardPurple]}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>
                ${stats.totalRevenue.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Doanh thu</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardIndigo]}>
              <Text style={styles.statIcon}>🚗</Text>
              <Text style={styles.statValue}>{stats.totalVehicles}</Text>
              <Text style={styles.statLabel}>Tổng xe</Text>
            </View>
            <View style={[styles.statCard, styles.statCardTeal]}>
              <Text style={styles.statIcon}>✨</Text>
              <Text style={styles.statValue}>{stats.availableVehicles}</Text>
              <Text style={styles.statLabel}>Xe khả dụng</Text>
            </View>
          </View>
        </View>

        {/* Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/bookings' as any)}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>📋</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Quản lý Bookings</Text>
              <Text style={styles.menuSubtitle}>
                Xem và quản lý tất cả đơn đặt xe
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/vehicles' as any)}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>🚙</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Quản lý Xe</Text>
              <Text style={styles.menuSubtitle}>
                Thêm, sửa, xóa thông tin xe
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {user.role === 'Admin' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/admin/users' as any)}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>👥</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Quản lý Users</Text>
                <Text style={styles.menuSubtitle}>
                  Xem và quản lý người dùng
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/reports' as any)}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>📈</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Báo cáo</Text>
              <Text style={styles.menuSubtitle}>
                Xem báo cáo doanh thu và thống kê
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  accessDeniedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#dbeafe',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardBlue: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  statCardYellow: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  statCardGreen: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  statCardPurple: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  statCardIndigo: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  statCardTeal: {
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  spacer: {
    height: 20,
  },
});
