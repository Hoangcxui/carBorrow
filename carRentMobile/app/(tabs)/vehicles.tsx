import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Vehicle } from '@/types';
import VehicleService, { VehicleSearchParams } from '@/services/VehicleService';
import SearchFilters, { VehicleFilters } from '@/components/SearchFilters';
import HeartButton from '@/components/HeartButton';

export default function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<VehicleFilters>({});

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = useCallback(async (searchTerm?: string, appliedFilters?: VehicleFilters) => {
    try {
      setIsLoading(true);
      
      const params: VehicleSearchParams = {
        page: 1,
        limit: 50,
        ...appliedFilters,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const data = await VehicleService.getVehicles(params);
      setVehicles(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadVehicles(searchQuery, filters);
    setIsRefreshing(false);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    loadVehicles(searchTerm, filters);
  };

  const handleFilterChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
    loadVehicles(searchQuery, newFilters);
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={styles.vehicleCard}
      onPress={() => router.push(`/vehicle/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.vehicleImage} />
        ) : (
          <View style={[styles.vehicleImage, styles.noImage]}>
            <Text style={styles.noImageText}>Không có ảnh</Text>
          </View>
        )}
        
        <View style={styles.heartContainer}>
          <HeartButton vehicleId={item.id} />
        </View>
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {item.make} {item.model} ({item.year})
        </Text>
        <Text style={styles.vehicleDetails}>Biển số: {item.licensePlate}</Text>
        <Text style={styles.vehicleDetails}>Màu: {item.color}</Text>
        <Text style={styles.vehiclePrice}>
          {item.pricePerDay.toLocaleString('vi-VN')} VNĐ/ngày
        </Text>
        <View style={[
          styles.statusBadge,
          item.isAvailable ? styles.availableBadge : styles.unavailableBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.isAvailable ? styles.availableText : styles.unavailableText
          ]}>
            {item.isAvailable ? 'Có sẵn' : 'Đã thuê'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Đang tải...' : 'Không có xe nào'}
            </Text>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  heartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6b7280',
    fontSize: 16,
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#065f46',
  },
  unavailableText: {
    color: '#991b1b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});