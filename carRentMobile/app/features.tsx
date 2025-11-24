import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface Feature {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

const features: Feature[] = [
  {
    title: 'Danh sách xe',
    description: 'Xem tất cả xe có sẵn với thông tin chi tiết',
    icon: 'directions-car',
    route: '/vehicles',
    status: 'completed'
  },
  {
    title: 'Chi tiết xe',
    description: 'Xem thông tin chi tiết, hình ảnh và thông số xe',
    icon: 'info',
    route: '/vehicle/1',
    status: 'completed'
  },
  {
    title: 'Đặt xe',
    description: 'Tạo booking mới với chọn ngày và tính giá tự động',
    icon: 'event-available',
    route: '/booking/create',
    status: 'completed'
  },
  {
    title: 'Quản lý booking',
    description: 'Xem danh sách booking và chi tiết từng booking',
    icon: 'assignment',
    route: '/bookings',
    status: 'completed'
  },
  {
    title: 'Upload hình ảnh',
    description: 'Chọn ảnh từ thư viện hoặc chụp ảnh mới',
    icon: 'photo-camera',
    status: 'completed'
  },
  {
    title: 'Push Notifications',
    description: 'Nhận thông báo nhắc nhở về booking',
    icon: 'notifications',
    status: 'completed'
  },
  {
    title: 'Xác thực JWT',
    description: 'Đăng nhập/đăng ký với JWT token và refresh token',
    icon: 'security',
    route: '/login',
    status: 'completed'
  },
  {
    title: 'Tìm kiếm & Lọc xe',
    description: 'Tìm kiếm và lọc xe theo nhiều tiêu chí',
    icon: 'search',
    route: '/vehicles',
    status: 'completed'
  },
  {
    title: 'Xe yêu thích',
    description: 'Lưu và quản lý danh sách xe yêu thích',
    icon: 'favorite',
    route: '/favorites',
    status: 'completed'
  },
  {
    title: 'Thanh toán trực tuyến',
    description: 'Thanh toán booking qua VNPay, MoMo, ZaloPay',
    icon: 'payment',
    status: 'completed'
  },
  {
    title: 'Lịch sử thanh toán',
    description: 'Xem lịch sử giao dịch và hóa đơn',
    icon: 'history',
    status: 'planned'
  },
  {
    title: 'Đánh giá xe',
    description: 'Đánh giá và để lại bình luận sau chuyến đi',
    icon: 'star-rate',
    status: 'planned'
  },
  {
    title: 'Chat hỗ trợ',
    description: 'Trò chuyện trực tiếp với nhân viên hỗ trợ',
    icon: 'chat',
    status: 'planned'
  },
  {
    title: 'Test Backend Connection',
    description: 'Kiểm tra kết nối với backend API',
    icon: 'cloud-done',
    route: '/test-connection',
    status: 'completed'
  }
];

export default function FeatureSummaryScreen() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'planned': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang phát triển';
      case 'planned': return 'Đã lên kế hoạch';
      default: return 'Không xác định';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Car Rental Mobile App</Text>
        <Text style={styles.subtitle}>Tính năng đã phát triển</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {features.filter(f => f.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {features.filter(f => f.status === 'in-progress').length}
          </Text>
          <Text style={styles.statLabel}>Đang làm</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {features.filter(f => f.status === 'planned').length}
          </Text>
          <Text style={styles.statLabel}>Kế hoạch</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => feature.route && router.push(feature.route as any)}
            disabled={!feature.route}
          >
            <View style={styles.featureHeader}>
              <MaterialIcons 
                name={feature.icon} 
                size={24} 
                color="#2196F3" 
                style={styles.featureIcon}
              />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <View 
                style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(feature.status) }
                ]}
              >
                <Text style={styles.statusText}>{getStatusText(feature.status)}</Text>
              </View>
            </View>
            {feature.route && (
              <MaterialIcons name="chevron-right" size={20} color="#9E9E9E" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.techStack}>
        <Text style={styles.sectionTitle}>Tech Stack</Text>
        <View style={styles.techItems}>
          <Text style={styles.techItem}>• React Native / Expo</Text>
          <Text style={styles.techItem}>• TypeScript</Text>
          <Text style={styles.techItem}>• Expo Router</Text>
          <Text style={styles.techItem}>• JWT Authentication</Text>
          <Text style={styles.techItem}>• Push Notifications</Text>
          <Text style={styles.techItem}>• Image Picker</Text>
          <Text style={styles.techItem}>• Date Picker</Text>
          <Text style={styles.techItem}>• API Integration</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  featuresContainer: {
    padding: 20,
    paddingTop: 0,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 15,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  techStack: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  techItems: {
    gap: 8,
  },
  techItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});