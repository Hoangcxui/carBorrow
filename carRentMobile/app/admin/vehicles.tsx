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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleApiService } from '@/services';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  dailyRate: number;
  status: string;
  imageUrl?: string;
}

export default function AdminVehiclesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin' || user?.role === 'Staff') {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    try {
      const data = await VehicleApiService.getVehicles();
      setVehicles(data as Vehicle[]);
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể tải danh sách xe');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return '#10b981';
      case 'rented': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'Sẵn sàng';
      case 'rented': return 'Đang thuê';
      case 'maintenance': return 'Bảo trì';
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
        <Text style={styles.headerTitle}>Quản lý Xe</Text>
      </View>

      {/* Add Vehicle Button */}
      {user.role === 'Admin' && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Thêm xe mới</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vehicles List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {vehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyText}>Không có xe nào</Text>
          </View>
        ) : (
          vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              {vehicle.imageUrl && (
                <Image
                  source={{ uri: vehicle.imageUrl }}
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleHeader}>
                  <Text style={styles.vehicleTitle}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
                  </View>
                </View>

                <View style={styles.vehicleDetails}>
                  <Text style={styles.detailText}>📅 Năm: {vehicle.year}</Text>
                  <Text style={styles.detailText}>🔢 Biển số: {vehicle.licensePlate}</Text>
                  <Text style={styles.detailText}>🎨 Màu: {vehicle.color}</Text>
                  <Text style={styles.priceText}>
                    💰 {vehicle.dailyRate.toLocaleString('vi-VN')} VNĐ/ngày
                  </Text>
                </View>

                {user.role === 'Admin' && (
                  <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                      <Text style={styles.actionButtonText}>✏️ Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                      <Text style={styles.actionButtonText}>🗑️ Xóa</Text>
                    </TouchableOpacity>
                  </View>
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
  addButtonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
  },
  vehicleContent: {
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
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
  vehicleDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
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
