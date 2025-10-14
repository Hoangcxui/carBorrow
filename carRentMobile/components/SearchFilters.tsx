import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: VehicleFilters) => void;
  currentFilters: VehicleFilters;
}

export interface VehicleFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: 'automatic' | 'manual';
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

const categories = [
  { id: '', label: 'Tất cả' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'pickup', label: 'Bán tải' },
  { id: 'luxury', label: 'Luxury' },
];

const transmissions = [
  { id: '', label: 'Tất cả' },
  { id: 'automatic', label: 'Tự động' },
  { id: 'manual', label: 'Số sàn' },
];

const fuelTypes = [
  { id: '', label: 'Tất cả' },
  { id: 'gasoline', label: 'Xăng' },
  { id: 'diesel', label: 'Dầu' },
  { id: 'electric', label: 'Điện' },
  { id: 'hybrid', label: 'Hybrid' },
];

const sortOptions = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'price_asc', label: 'Giá thấp → cao' },
  { id: 'price_desc', label: 'Giá cao → thấp' },
  { id: 'name_asc', label: 'Tên A → Z' },
  { id: 'name_desc', label: 'Tên Z → A' },
];

export default function SearchFilters({ onSearch, onFilterChange, currentFilters }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<VehicleFilters>(currentFilters);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearFilters: VehicleFilters = {};
    setTempFilters(clearFilters);
    onFilterChange(clearFilters);
    setShowFilters(false);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm xe..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchTerm('');
                onSearch('');
              }}
            >
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <MaterialIcons 
            name="tune" 
            size={20} 
            color={hasActiveFilters ? 'white' : '#666'} 
          />
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.cancelButton}>Hủy</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.clearButton}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Loại xe</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterOption,
                      tempFilters.category === category.id && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({ ...tempFilters, category: category.id || undefined })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.category === category.id && styles.filterOptionTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Khoảng giá (VNĐ/ngày)</Text>
              <View style={styles.priceRange}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Từ"
                  value={tempFilters.minPrice?.toString()}
                  onChangeText={(text) => setTempFilters({ 
                    ...tempFilters, 
                    minPrice: text ? parseInt(text) : undefined 
                  })}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Đến"
                  value={tempFilters.maxPrice?.toString()}
                  onChangeText={(text) => setTempFilters({ 
                    ...tempFilters, 
                    maxPrice: text ? parseInt(text) : undefined 
                  })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Transmission */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Hộp số</Text>
              <View style={styles.filterOptions}>
                {transmissions.map((transmission) => (
                  <TouchableOpacity
                    key={transmission.id}
                    style={[
                      styles.filterOption,
                      tempFilters.transmission === transmission.id && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({ 
                      ...tempFilters, 
                      transmission: transmission.id as any || undefined 
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.transmission === transmission.id && styles.filterOptionTextActive
                    ]}>
                      {transmission.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fuel Type */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Loại nhiên liệu</Text>
              <View style={styles.filterOptions}>
                {fuelTypes.map((fuelType) => (
                  <TouchableOpacity
                    key={fuelType.id}
                    style={[
                      styles.filterOption,
                      tempFilters.fuelType === fuelType.id && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({ 
                      ...tempFilters, 
                      fuelType: fuelType.id as any || undefined 
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.fuelType === fuelType.id && styles.filterOptionTextActive
                    ]}>
                      {fuelType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Seats */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Số chỗ ngồi</Text>
              <View style={styles.filterOptions}>
                {[2, 4, 5, 7, 9].map((seats) => (
                  <TouchableOpacity
                    key={seats}
                    style={[
                      styles.filterOption,
                      tempFilters.seats === seats && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({ 
                      ...tempFilters, 
                      seats: tempFilters.seats === seats ? undefined : seats 
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.seats === seats && styles.filterOptionTextActive
                    ]}>
                      {seats} chỗ
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sắp xếp theo</Text>
              <View style={styles.filterOptions}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      tempFilters.sortBy === option.id && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilters({ 
                      ...tempFilters, 
                      sortBy: option.id as any 
                    })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      tempFilters.sortBy === option.id && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    fontSize: 16,
    color: '#FF5722',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  filterOptionActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  priceInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});