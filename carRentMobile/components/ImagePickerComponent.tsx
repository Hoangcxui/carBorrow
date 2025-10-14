import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import FileUploadService from '@/services/FileUploadService';

interface ImagePickerComponentProps {
  onImageSelected: (imageUrl: string) => void;
  currentImageUrl?: string;
  placeholder?: string;
  style?: any;
}

export default function ImagePickerComponent({ 
  onImageSelected, 
  currentImageUrl, 
  placeholder = 'Chọn ảnh',
  style 
}: ImagePickerComponentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await FileUploadService.pickImage();
      
      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        const uploadResult = await FileUploadService.uploadImage(result.assets[0].uri);
        onImageSelected(uploadResult.url);
        Alert.alert('Thành công', 'Tải ảnh lên thành công!');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsUploading(false);
      setShowOptions(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await FileUploadService.takePhoto();
      
      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        const uploadResult = await FileUploadService.uploadImage(result.assets[0].uri);
        onImageSelected(uploadResult.url);
        Alert.alert('Thành công', 'Tải ảnh lên thành công!');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsUploading(false);
      setShowOptions(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thư viện ảnh', onPress: handlePickImage },
        { text: 'Chụp ảnh mới', onPress: handleTakePhoto },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={showImageOptions}
        disabled={isUploading}
      >
        {isUploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Đang tải lên...</Text>
          </View>
        ) : currentImageUrl ? (
          <Image source={{ uri: currentImageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}
      </TouchableOpacity>

      {currentImageUrl && !isUploading && (
        <TouchableOpacity style={styles.changeButton} onPress={showImageOptions}>
          <Text style={styles.changeButtonText}>Thay đổi ảnh</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  changeButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    alignSelf: 'center',
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});