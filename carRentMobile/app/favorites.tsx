import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Vehicle } from '@/types';
import FavoritesService from '@/services/FavoritesService';
import HeartButton from '@/components/HeartButton';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favoriteVehicles = await FavoritesService.getFavoriteVehicles();
      setFavorites(favoriteVehicles);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFavorites();
    setIsRefreshing(false);
  };

  const handleHeartToggle = (vehicleId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove from local state when unfavorited
      setFavorites(prev => prev.filter(v => v.id !== vehicleId));
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Xóa tất cả yêu thích',
      'Bạn có chắc chắn muốn xóa tất cả xe yêu thích?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: async () => {
            try {
              await FavoritesService.clearFavorites();
              setFavorites([]);
              Alert.alert('Thành công', 'Đã xóa tất cả xe yêu thích');
            } catch (error: any) {
              Alert.alert('Lỗi', error.message);
            }
          }
        }
      ]
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={styles.vehicleCard}
      onPress={() => router.push(`/vehicle/${item.id}` as any)}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.vehicleImage} />
        ) : (
          <View style={[styles.vehicleImage, styles.noImage]}>
            <MaterialIcons name="directions-car" size={40} color="#ccc" />
          </View>
        )}
        
        <View style={styles.heartContainer}>
          <HeartButton 
            vehicleId={item.id}
            onToggle={(isFavorite) => handleHeartToggle(item.id, isFavorite)}
          />
        </View>
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>
          {item.make} {item.model} ({item.year})
        </Text>
        <Text style={styles.vehicleCategory}>
          {item.category?.name || 'Xe'}
        </Text>
        
        <View style={styles.vehicleDetails}>
          {item.seats && (
            <View style={styles.detailItem}>
              <MaterialIcons name="people" size={16} color="#666" />
              <Text style={styles.detailText}>{item.seats} chỗ</Text>
            </View>
          )}
          {item.transmission && (
            <View style={styles.detailItem}>
              <MaterialIcons name="speed" size={16} color="#666" />
              <Text style={styles.detailText}>
                {item.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(item.pricePerDay)}
          </Text>
          <Text style={styles.priceUnit}>/ngày</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="favorite-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Chưa có xe yêu thích</Text>
      <Text style={styles.emptySubtitle}>
        Nhấn vào biểu tượng trái tim trên các xe để thêm vào danh sách yêu thích
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/vehicles')}
      >
        <Text style={styles.browseButtonText}>Tìm xe ngay</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.title}>Xe yêu thích ({favorites.length})</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={favorites}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          favorites.length === 0 && styles.listEmpty
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '500',
  },
  list: {
    padding: 15,
  },
  listEmpty: {
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  vehicleInfo: {
    padding: 15,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  vehicleCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  vehicleDetails: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});