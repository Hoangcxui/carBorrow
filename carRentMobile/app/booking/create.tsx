import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { VehicleApiService, LocationApiService, BookingApiService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  isAvailable: boolean;
  categoryName: string;
  seats: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

export default function CreateBookingScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [pickupTime, setPickupTime] = useState('09:00');
  const [dropoffTime, setDropoffTime] = useState('09:00');
  const [pickupLocationId, setPickupLocationId] = useState<number | null>(null);
  const [dropoffLocationId, setDropoffLocationId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  
  // Customer info
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '');
  const [customerAddress, setCustomerAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropoffPicker, setShowDropoffPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [vehicleId]);

  const loadData = async () => {
    if (!vehicleId) return;
    
    try {
      setIsLoadingData(true);
      const [vehicleData, locationsData] = await Promise.all([
        VehicleApiService.getVehicleById(parseInt(vehicleId)),
        LocationApiService.getLocations()
      ]);
      
      setVehicle(vehicleData as Vehicle);
      setLocations(locationsData as Location[]);
      
      // Set default locations
      if (locationsData.length > 0) {
        setPickupLocationId((locationsData as Location[])[0].id);
        setDropoffLocationId((locationsData as Location[])[0].id);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      router.back();
    } finally {
      setIsLoadingData(false);
    }
  };

  const calculateTotalDays = () => {
    const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateTotalAmount = () => {
    if (!vehicle) return 0;
    return calculateTotalDays() * vehicle.dailyRate;
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }
    if (!customerEmail.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (!customerPhone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!pickupLocationId) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa điểm nhận xe');
      return false;
    }
    if (!dropoffLocationId) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa điểm trả xe');
      return false;
    }
    if (pickupDate >= dropoffDate) {
      Alert.alert('Lỗi', 'Ngày trả xe phải sau ngày nhận xe');
      return false;
    }
    return true;
  };

  const handleCreateBooking = async () => {
    if (!vehicle || !validateForm()) return;

    try {
      setIsLoading(true);
      
      const bookingData = {
        vehicleId: vehicle.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        pickupDate: pickupDate.toISOString().split('T')[0],
        dropoffDate: dropoffDate.toISOString().split('T')[0],
        pickupTime,
        dropoffTime,
        pickupLocationId: pickupLocationId!,
        dropoffLocationId: dropoffLocationId!,
        totalAmount: calculateTotalAmount(),
        paymentMethod,
        specialRequests: specialRequests.trim(),
      };

      const response = await BookingApiService.createBooking(bookingData) as any;
      
      setBookingId(response.bookingId);

      // Show QR modal if payment method is QR
      if (paymentMethod === 'qr') {
        setShowQRModal(true);
      } else {
        // COD - go directly to bookings
        Alert.alert(
          'Đặt xe thành công!',
          `Mã booking: ${response.bookingId}\nBạn sẽ thanh toán khi nhận xe.`,
          [
            {
              text: 'Xem booking',
              onPress: () => router.replace('/bookings' as any),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Đặt xe thất bại', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPickupDate(selectedDate);
      if (selectedDate >= dropoffDate) {
        setDropoffDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onDropoffDateChange = (event: any, selectedDate?: Date) => {
    setShowDropoffPicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate > pickupDate) {
      setDropoffDate(selectedDate);
    }
  };

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Không tìm thấy xe</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt xe</Text>
        </View>

      {/* Thông tin xe */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin xe</Text>
        <Text style={styles.vehicleTitle}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </Text>
        <Text style={styles.vehicleDetails}>
          Biển số: {vehicle.licensePlate} • Màu: {vehicle.color}
        </Text>
        <Text style={styles.vehiclePrice}>
          {vehicle.dailyRate.toLocaleString('vi-VN')} VNĐ/ngày
        </Text>
      </View>

      {/* Thông tin khách hàng */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
        
        <Text style={styles.label}>Họ tên *</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Nguyễn Văn A"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={customerEmail}
          onChangeText={setCustomerEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Số điện thoại *</Text>
        <TextInput
          style={styles.input}
          value={customerPhone}
          onChangeText={setCustomerPhone}
          placeholder="0912345678"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={customerAddress}
          onChangeText={setCustomerAddress}
          placeholder="Địa chỉ của bạn"
        />
      </View>

      {/* Thời gian & Địa điểm */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thời gian & Địa điểm</Text>
        
        {/* Ngày nhận xe */}
        <Text style={styles.label}>Ngày nhận xe *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPickupPicker(true)}
        >
          <Text style={styles.dateText}>
            📅 {pickupDate.toLocaleDateString('vi-VN')}
          </Text>
        </TouchableOpacity>
        {showPickupPicker && (
          <DateTimePicker
            value={pickupDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onPickupDateChange}
          />
        )}

        <Text style={styles.label}>Giờ nhận xe</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pickupTime}
            onValueChange={setPickupTime}
            style={styles.picker}
          >
            <Picker.Item label="08:00" value="08:00" />
            <Picker.Item label="09:00" value="09:00" />
            <Picker.Item label="10:00" value="10:00" />
            <Picker.Item label="11:00" value="11:00" />
            <Picker.Item label="12:00" value="12:00" />
            <Picker.Item label="13:00" value="13:00" />
            <Picker.Item label="14:00" value="14:00" />
            <Picker.Item label="15:00" value="15:00" />
            <Picker.Item label="16:00" value="16:00" />
            <Picker.Item label="17:00" value="17:00" />
          </Picker>
        </View>

        <Text style={styles.label}>Địa điểm nhận xe *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pickupLocationId}
            onValueChange={setPickupLocationId}
            style={styles.picker}
          >
            {locations.map(loc => (
              <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
            ))}
          </Picker>
        </View>

        {/* Ngày trả xe */}
        <Text style={styles.label}>Ngày trả xe *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDropoffPicker(true)}
        >
          <Text style={styles.dateText}>
            📅 {dropoffDate.toLocaleDateString('vi-VN')}
          </Text>
        </TouchableOpacity>
        {showDropoffPicker && (
          <DateTimePicker
            value={dropoffDate}
            mode="date"
            display="default"
            minimumDate={new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)}
            onChange={onDropoffDateChange}
          />
        )}

        <Text style={styles.label}>Giờ trả xe</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dropoffTime}
            onValueChange={setDropoffTime}
            style={styles.picker}
          >
            <Picker.Item label="08:00" value="08:00" />
            <Picker.Item label="09:00" value="09:00" />
            <Picker.Item label="10:00" value="10:00" />
            <Picker.Item label="11:00" value="11:00" />
            <Picker.Item label="12:00" value="12:00" />
            <Picker.Item label="13:00" value="13:00" />
            <Picker.Item label="14:00" value="14:00" />
            <Picker.Item label="15:00" value="15:00" />
            <Picker.Item label="16:00" value="16:00" />
            <Picker.Item label="17:00" value="17:00" />
          </Picker>
        </View>

        <Text style={styles.label}>Địa điểm trả xe *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dropoffLocationId}
            onValueChange={setDropoffLocationId}
            style={styles.picker}
          >
            {locations.map(loc => (
              <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
        
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'qr' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('qr')}
        >
          <View style={styles.radio}>
            {paymentMethod === 'qr' && <View style={styles.radioSelected} />}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>💳 Chuyển khoản QR</Text>
            <Text style={styles.paymentDesc}>Quét mã QR để thanh toán</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod('cod')}
        >
          <View style={styles.radio}>
            {paymentMethod === 'cod' && <View style={styles.radioSelected} />}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>💵 Tiền mặt</Text>
            <Text style={styles.paymentDesc}>Thanh toán khi nhận xe</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Ghi chú */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Yêu cầu đặc biệt</Text>
        <TextInput
          style={styles.textArea}
          value={specialRequests}
          onChangeText={setSpecialRequests}
          placeholder="Nhập yêu cầu đặc biệt (nếu có)..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Tóm tắt */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tóm tắt đơn hàng</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Số ngày thuê:</Text>
          <Text style={styles.summaryValue}>{calculateTotalDays()} ngày</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giá mỗi ngày:</Text>
          <Text style={styles.summaryValue}>
            {vehicle.dailyRate.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>
            {calculateTotalAmount().toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      </View>

      {/* Nút đặt xe */}
      <TouchableOpacity
        style={[styles.bookButton, isLoading && styles.disabledButton]}
        onPress={handleCreateBooking}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.bookButtonText}>Xác nhận đặt xe</Text>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
      </ScrollView>

      {/* QR Payment Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowQRModal(false);
          router.replace('/bookings' as any);
        }}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thanh toán QR</Text>
          <Text style={styles.modalSubtitle}>Mã booking: #{bookingId}</Text>
          
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: `https://img.vietqr.io/image/MB-0123456789-compact.png?amount=${calculateTotalAmount()}&addInfo=Booking%20${bookingId}` }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.qrInfo}>
            <Text style={styles.qrInfoText}>Ngân hàng: MB Bank</Text>
            <Text style={styles.qrInfoText}>Số TK: 0123456789</Text>
            <Text style={styles.qrInfoText}>Số tiền: {calculateTotalAmount()?.toFixed(2)} VNĐ</Text>
            <Text style={styles.qrInfoText}>Nội dung: Booking {bookingId}</Text>
          </View>

          <Text style={styles.qrNote}>
            Quét mã QR để thanh toán. Hệ thống sẽ tự động xác nhận sau khi nhận được thanh toán.
          </Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowQRModal(false);
              router.replace('/bookings' as any);
            }}
          >
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  card: {
    backgroundColor: 'white',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    minHeight: 100,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  },
  // QR Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  qrInfo: {
    width: '100%',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  qrInfoText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  qrNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
