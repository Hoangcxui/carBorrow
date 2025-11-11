'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRPaymentModal from '@/components/QRPaymentModal';
import { 
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  UsersIcon,
  Cog6ToothIcon as GearIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  QrCodeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock vehicle data
const vehicleData = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  pricePerDay: 45,
  image: '/api/placeholder/300/200',
  location: 'Quận 1, TP.HCM',
  seats: 5,
  transmission: 'Automatic',
  fuel: 'Gasoline',
  rating: 4.8,
  reviews: 124,
  licensePlate: '51A-12345'
};

const paymentMethods = [
  { id: 'qr', name: 'Thanh toán QR', icon: QrCodeIcon, popular: true, description: 'VietQR / VNPay - Thanh toán nhanh chóng' },
  { id: 'cod', name: 'Thanh toán khi lấy xe', icon: BanknotesIcon, popular: true, description: 'Thanh toán bằng tiền mặt khi nhận xe' }
];

const locations = [
  { id: 'pickup-location', name: 'Văn phòng CarBorrow - 123 Lê Lợi, Q1, TP.HCM' },
  { id: 'airport', name: 'Sân bay Tân Sơn Nhất - Phí giao xe: $10' },
  { id: 'district1', name: 'Quận 1 - Giao xe tận nơi: $5' },
  { id: 'district3', name: 'Quận 3 - Giao xe tận nơi: $3' },
  { id: 'custom', name: 'Địa điểm khác - Phí theo khoảng cách' }
];

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showQRModal, setShowQRModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    // Dates from URL params
    pickupDate: searchParams?.get('pickup') || '',
    dropoffDate: searchParams?.get('dropoff') || '',
    pickupTime: searchParams?.get('pickupTime') || '10:00',
    dropoffTime: searchParams?.get('dropoffTime') || '10:00',
    
    // Locations
    pickupLocation: 'pickup-location',
    dropoffLocation: 'pickup-location',
    
    // Customer info
    customerInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      driverLicense: '',
      licenseIssueDate: '',
      address: ''
    },
    
    // Add-ons
    addOns: [] as string[],
    
    // Payment
    paymentMethod: 'qr',
    
    // Special requests
    specialRequests: ''
  });

  const vehicle = vehicleData;

  const addOnOptions = [
    { id: 'insurance', name: 'Bảo hiểm toàn diện', price: 15, description: 'Bảo vệ toàn diện cho xe và người' },
    { id: 'gps', name: 'Thiết bị GPS', price: 5, description: 'Định vị và dẫn đường' },
    { id: 'childSeat', name: 'Ghế em bé', price: 8, description: 'Ghế an toàn cho trẻ em' },
    { id: 'wifi', name: 'Wifi di động', price: 10, description: '4G không giới hạn' },
    { id: 'driver', name: 'Tài xế riêng', price: 50, description: 'Tài xế chuyên nghiệp theo xe' }
  ];

  const calculateDays = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate) return 0;
    const start = new Date(bookingData.pickupDate);
    const end = new Date(bookingData.dropoffDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateSubtotal = () => {
    return calculateDays() * vehicle.pricePerDay;
  };

  const calculateAddOnTotal = () => {
    return bookingData.addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find(opt => opt.id === addOnId);
      return total + (addOn ? addOn.price * calculateDays() : 0);
    }, 0);
  };

  const calculateDeliveryFee = () => {
    const pickup = locations.find(loc => loc.id === bookingData.pickupLocation);
    const dropoff = locations.find(loc => loc.id === bookingData.dropoffLocation);
    
    let fee = 0;
    if (pickup?.name.includes('$10')) fee += 10;
    if (pickup?.name.includes('$5')) fee += 5;
    if (pickup?.name.includes('$3')) fee += 3;
    if (dropoff?.name.includes('$10')) fee += 10;
    if (dropoff?.name.includes('$5')) fee += 5;
    if (dropoff?.name.includes('$3')) fee += 3;
    
    return fee;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateAddOnTotal() + calculateDeliveryFee();
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [section]: section === 'customerInfo' 
        ? { ...prev.customerInfo, [field]: value }
        : value
    }));
  };

  const toggleAddOn = (addOnId: string) => {
    setBookingData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return bookingData.pickupDate && bookingData.dropoffDate;
      case 2:
        const { customerInfo } = bookingData;
        return customerInfo.fullName && customerInfo.email && customerInfo.phone && 
               customerInfo.dateOfBirth && customerInfo.driverLicense && customerInfo.address;
      case 3:
        return true; // Add-ons are optional
      case 4:
        return bookingData.paymentMethod;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      try {
        // Create proper date format for backend
        const formatDateForAPI = (dateStr: string) => {
          if (!dateStr) return new Date().toISOString().split('T')[0];
          // If already ISO or YYYY-MM-DD format, keep it
          return dateStr;
        };

        // Save booking to API with flat customer fields (matching backend DTO)
        const bookingPayload = {
          vehicleId: vehicle.id,
          customerName: bookingData.customerInfo.fullName,
          customerEmail: bookingData.customerInfo.email,
          customerPhone: bookingData.customerInfo.phone,
          customerAddress: bookingData.customerInfo.address,
          pickupDate: formatDateForAPI(bookingData.pickupDate),
          dropoffDate: formatDateForAPI(bookingData.dropoffDate),
          pickupTime: bookingData.pickupTime || '10:00',
          dropoffTime: bookingData.dropoffTime || '10:00',
          pickupLocation: bookingData.pickupLocation || 'Main Office',
          dropoffLocation: bookingData.dropoffLocation || 'Main Office',
          totalAmount: calculateTotal(),
          paymentMethod: bookingData.paymentMethod,
          specialRequests: bookingData.specialRequests || ''
        };

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`API error: ${error}`);
        }

        const savedBooking = await response.json();
        
        // Save customer email to localStorage for booking history lookup
        localStorage.setItem('customerEmail', bookingData.customerInfo.email);
        setCreatedBooking(savedBooking);
        
        // Show QR modal for QR payment, otherwise redirect
        if (bookingData.paymentMethod === 'qr') {
          setShowQRModal(true);
        } else {
          toast.success('Đặt xe thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.');
          setTimeout(() => {
            router.push('/my-bookings');
          }, 2000);
        }
      } catch (error) {
        toast.error('Lỗi: Không thể lưu booking. Vui lòng thử lại!');
        console.error(error);
      }
    } else {
      toast.error('Vui lòng hoàn tất thông tin thanh toán');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const steps = [
    { id: 1, name: 'Thời gian & Địa điểm', description: 'Chọn thời gian và địa điểm thuê xe' },
    { id: 2, name: 'Thông tin cá nhân', description: 'Điền thông tin khách hàng' },
    { id: 3, name: 'Dịch vụ bổ sung', description: 'Chọn các dịch vụ thêm' },
    { id: 4, name: 'Thanh toán', description: 'Chọn phương thức thanh toán' },
    { id: 5, name: 'Xác nhận', description: 'Xem lại và xác nhận đặt xe' }
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Đặt xe</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Steps Indicator */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        currentStep >= step.id 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > step.id ? <CheckCircleIcon className="h-5 w-5" /> : step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-full h-1 mx-4 ${
                          currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {steps[currentStep - 1]?.name}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Step 1: Time & Location */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Thời gian thuê xe</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày & giờ nhận xe
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={bookingData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', '', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <input
                            type="time"
                            value={bookingData.pickupTime}
                            onChange={(e) => handleInputChange('pickupTime', '', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày & giờ trả xe
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={bookingData.dropoffDate}
                            onChange={(e) => handleInputChange('dropoffDate', '', e.target.value)}
                            min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <input
                            type="time"
                            value={bookingData.dropoffTime}
                            onChange={(e) => handleInputChange('dropoffTime', '', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa điểm nhận xe
                        </label>
                        <select
                          value={bookingData.pickupLocation}
                          onChange={(e) => handleInputChange('pickupLocation', '', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa điểm trả xe
                        </label>
                        <select
                          value={bookingData.dropoffLocation}
                          onChange={(e) => handleInputChange('dropoffLocation', '', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Customer Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          value={bookingData.customerInfo.fullName}
                          onChange={(e) => handleInputChange('customerInfo', 'fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Nhập họ và tên đầy đủ"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={bookingData.customerInfo.email}
                          onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          value={bookingData.customerInfo.phone}
                          onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0123456789"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh *
                        </label>
                        <input
                          type="date"
                          value={bookingData.customerInfo.dateOfBirth}
                          onChange={(e) => handleInputChange('customerInfo', 'dateOfBirth', e.target.value)}
                          max={new Date(Date.now() - 23 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số GPLX *
                        </label>
                        <input
                          type="text"
                          value={bookingData.customerInfo.driverLicense}
                          onChange={(e) => handleInputChange('customerInfo', 'driverLicense', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Số giấy phép lái xe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày cấp GPLX
                        </label>
                        <input
                          type="date"
                          value={bookingData.customerInfo.licenseIssueDate}
                          onChange={(e) => handleInputChange('customerInfo', 'licenseIssueDate', e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ *
                      </label>
                      <textarea
                        value={bookingData.customerInfo.address}
                        onChange={(e) => handleInputChange('customerInfo', 'address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nhập địa chỉ đầy đủ"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Add-ons */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Dịch vụ bổ sung</h3>
                    <p className="text-gray-600">Chọn thêm các dịch vụ để có trải nghiệm tốt hơn</p>
                    
                    <div className="space-y-4">
                      {addOnOptions.map((addOn) => (
                        <div
                          key={addOn.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            bookingData.addOns.includes(addOn.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleAddOn(addOn.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={bookingData.addOns.includes(addOn.id)}
                                onChange={() => toggleAddOn(addOn.id)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-4"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">{addOn.name}</h4>
                                <p className="text-sm text-gray-600">{addOn.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">${addOn.price}</div>
                              <div className="text-sm text-gray-500">/ ngày</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                            bookingData.paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', '', method.id)}
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={bookingData.paymentMethod === method.id}
                              onChange={(e) => handleInputChange('paymentMethod', '', e.target.value)}
                              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 mr-4 mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <method.icon className="h-6 w-6 text-primary-600 mr-3" />
                                <span className="font-semibold text-gray-900 text-lg">{method.name}</span>
                                {method.popular && (
                                  <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                    Phổ biến
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 ml-9">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Lưu ý thanh toán:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li><strong>Thanh toán QR:</strong> Quét mã QR và chuyển khoản ngay, đơn sẽ được xác nhận trong 5-10 phút</li>
                            <li><strong>Thanh toán khi lấy xe:</strong> Thanh toán bằng tiền mặt hoặc thẻ khi nhận xe tại địa điểm</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú đặc biệt
                      </label>
                      <textarea
                        value={bookingData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', '', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Có yêu cầu đặc biệt nào không? (tùy chọn)"
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Xác nhận thông tin đặt xe</h3>
                    
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Thời gian thuê</h4>
                          <div className="text-sm space-y-1">
                            <div>Nhận: {formatDate(bookingData.pickupDate)} lúc {bookingData.pickupTime}</div>
                            <div>Trả: {formatDate(bookingData.dropoffDate)} lúc {bookingData.dropoffTime}</div>
                            <div className="font-medium">Tổng: {calculateDays()} ngày</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Khách hàng</h4>
                          <div className="text-sm space-y-1">
                            <div>{bookingData.customerInfo.fullName}</div>
                            <div>{bookingData.customerInfo.email}</div>
                            <div>{bookingData.customerInfo.phone}</div>
                            <div>GPLX: {bookingData.customerInfo.driverLicense}</div>
                          </div>
                        </div>
                      </div>

                      {bookingData.addOns.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Dịch vụ bổ sung</h4>
                          <div className="text-sm space-y-1">
                            {bookingData.addOns.map(addOnId => {
                              const addOn = addOnOptions.find(opt => opt.id === addOnId);
                              return addOn ? <div key={addOnId}>{addOn.name} - ${addOn.price}/ngày</div> : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                      <div className="text-sm text-yellow-800">
                        Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Sau khi đặt xe, bạn sẽ nhận được email xác nhận trong vòng 30 phút.
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 border border-gray-300 rounded-lg font-medium ${
                      currentStep === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Quay lại
                  </button>

                  {currentStep < 5 ? (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                      Tiếp tục
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    >
                      Xác nhận đặt xe
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Vehicle Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Xe đã chọn</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {vehicle.rating} ({vehicle.reviews} đánh giá)
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {vehicle.seats} chỗ
                    </div>
                    <div className="flex items-center">
                      <GearIcon className="h-4 w-4 mr-1" />
                      {vehicle.transmission === 'Automatic' ? 'Tự động' : 'Số sàn'}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {vehicle.location}
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                {bookingData.pickupDate && bookingData.dropoffDate && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết giá</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          ${vehicle.pricePerDay} × {calculateDays()} ngày
                        </span>
                        <span className="font-medium">${calculateSubtotal()}</span>
                      </div>

                      {bookingData.addOns.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Dịch vụ bổ sung:</div>
                          {bookingData.addOns.map(addOnId => {
                            const addOn = addOnOptions.find(opt => opt.id === addOnId);
                            if (!addOn) return null;
                            return (
                              <div key={addOnId} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {addOn.name} × {calculateDays()} ngày
                                </span>
                                <span>${addOn.price * calculateDays()}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {calculateDeliveryFee() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phí giao xe</span>
                          <span className="font-medium">${calculateDeliveryFee()}</span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Tổng cộng</span>
                          <span className="text-primary-600">${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div className="text-sm">
                      <div className="font-medium text-green-900">Bảo mật & An toàn</div>
                      <div className="text-green-700">
                        Thông tin của bạn được mã hóa và bảo vệ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* QR Payment Modal */}
      <QRPaymentModal 
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          router.push('/dashboard');
        }}
        bookingId={createdBooking?.bookingId || 0}
        amount={calculateTotal()}
        customerEmail={bookingData.customerInfo.email}
      />
    </>
  );
}