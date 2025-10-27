import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Vehicle } from '@/types';
import VehicleService from '@/services/VehicleService';

const { width } = Dimensions.get('window');

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicleDetail();
  }, [id]);

  const loadVehicleDetail = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const data = await VehicleService.getVehicleById(id);
      setVehicle(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!vehicle) return;
    
    router.push({
      pathname: '/booking/create',
      params: { vehicleId: vehicle.id }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy xe</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header với nút back */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      {/* Hình ảnh xe */}
      {vehicle.imageUrl ? (
        <Image source={{ uri: vehicle.imageUrl }} style={styles.vehicleImage} />
      ) : (
        <View style={[styles.vehicleImage, styles.noImage]}>
          <Text style={styles.noImageText}>Không có ảnh</Text>
        </View>
      )}

      {/* Thông tin chi tiết */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.vehicleTitle}>
            {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.vehicleYear}>Năm sản xuất: {vehicle.year}</Text>
          <View style={[
            styles.statusBadge,
            vehicle.isAvailable ? styles.availableBadge : styles.unavailableBadge
          ]}>
            <Text style={[
              styles.statusText,
              vehicle.isAvailable ? styles.availableText : styles.unavailableText
            ]}>
              {vehicle.isAvailable ? '✓ Có sẵn' : '✗ Đã được thuê'}
            </Text>
          </View>
        </View>

        {/* Thông tin cơ bản */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Biển số</Text>
              <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Màu sắc</Text>
              <Text style={styles.infoValue}>{vehicle.color}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Danh mục</Text>
              <Text style={styles.infoValue}>{vehicle.category?.name || 'Chưa phân loại'}</Text>
            </View>
          </View>
        </View>

        {/* Giá thuê */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Giá thuê</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {vehicle.pricePerDay.toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text style={styles.priceUnit}>/ ngày</Text>
          </View>
        </View>

        {/* Mô tả */}
        {vehicle.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.descriptionText}>{vehicle.description}</Text>
          </View>
        )}

        {/* Nút đặt xe */}
        {vehicle.isAvailable && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>Đặt xe ngay</Text>
          </TouchableOpacity>
        )}

        {/* Thông tin liên hệ */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Cần hỗ trợ?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>📞 Gọi ngay: 1900-xxxx</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  vehicleImage: {
    width: width,
    height: 250,
    backgroundColor: '#e5e7eb',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6b7280',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: '#d1fae5',
  },
  unavailableBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  availableText: {
    color: '#065f46',
  },
  unavailableText: {
    color: '#991b1b',
  },
  infoSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  priceSection: {
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
  },
  priceUnit: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  descriptionSection: {
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
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
});