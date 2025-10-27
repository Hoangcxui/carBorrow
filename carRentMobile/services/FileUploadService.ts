import * as ImagePicker from 'expo-image-picker';
import ApiService from './ApiService';
import { ApiResponse } from '../types';

export interface UploadResult {
  url: string;
  filename: string;
}

export class FileUploadService {
  async requestPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  async pickImage(): Promise<ImagePicker.ImagePickerResult> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      throw new Error('Cần cấp quyền truy cập thư viện ảnh');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    return result;
  }

  async takePhoto(): Promise<ImagePicker.ImagePickerResult> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Cần cấp quyền truy cập camera');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    return result;
  }

  async uploadImage(imageUri: string, type: 'avatar' | 'vehicle' | 'document' = 'document'): Promise<UploadResult> {
    try {
      // Tạo FormData để upload
      const formData = new FormData();
      
      // Lấy tên file từ URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: fileType,
      } as any);

      formData.append('type', type);

      // Upload
      const response = await ApiService.post<ApiResponse<UploadResult>>(
        '/api/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Upload failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Network error during upload');
    }
  }

  async uploadDocument(fileUri: string): Promise<UploadResult> {
    return this.uploadImage(fileUri, 'document');
  }

  async uploadAvatar(imageUri: string): Promise<UploadResult> {
    return this.uploadImage(imageUri, 'avatar');
  }

  async uploadVehicleImage(imageUri: string): Promise<UploadResult> {
    return this.uploadImage(imageUri, 'vehicle');
  }

  // Utility method để resize ảnh (nếu cần)
  async resizeImage(uri: string, width: number = 800, height: number = 600): Promise<string> {
    // Có thể sử dụng expo-image-manipulator nếu cần resize
    // Hiện tại chỉ return uri gốc
    return uri;
  }

  // Validate file size
  validateFileSize(fileSize: number, maxSize: number = 5 * 1024 * 1024): boolean {
    return fileSize <= maxSize;
  }

  // Get image info
  async getImageInfo(uri: string): Promise<{ width: number; height: number; size?: number }> {
    // Có thể sử dụng expo-image-manipulator để lấy thông tin ảnh
    // Hiện tại return mock data
    return { width: 800, height: 600 };
  }
}

export default new FileUploadService();