'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRPaymentModal from '@/components/QRPaymentModal';
import toast from 'react-hot-toast';

// Mock vehicle data
const mockVehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  dailyRate: 45,
  location: 'Downtown Location - 123 Main St'
};

const pickupLocations = [
  { id: 1, name: 'Địa điểm trung tâm', address: 'Số 123 Đường Chính, Trung tâm thành phố', available: true },
  { id: 2, name: 'Sân bay', address: 'Số 456 Đường Sân bay, Nhà ga số 1', available: true },
  { id: 3, name: 'Địa điểm trung tâm thương mại', address: 'Số 789 Đại lộ Mua sắm, Grand Mall', available: false }
];

const timeSlots = [
  '09:00 SA', '10:00 SA', '11:00 SA', '12:00 TH',
  '01:00 CH', '02:00 CH', '03:00 CH', '04:00 CH', '05:00 CH'
];

export default function BookVehiclePage() {
  const params = useParams();
  const router = useRouter();
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    pickupLocation: '1',
    dropoffLocation: '1',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '10:00 SA',
    dropoffTime: '10:00 SA',
    driverAge: '25-64',
    addInsurance: false,
    addGPS: false,
    addChildSeat: false,
    paymentMethod: 'qr'
  });

  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate rental duration and pricing
  const calculateRental = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate) {
      return { days: 0, subtotal: 0, insurance: 0, addons: 0, total: 0 };
    }

    const pickup = new Date(bookingData.pickupDate);
    const dropoff = new Date(bookingData.dropoffDate);
    const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    
    const subtotal = days * mockVehicle.dailyRate;
    const insurance = bookingData.addInsurance ? days * 15 : 0;
    const gps = bookingData.addGPS ? days * 10 : 0;
    const childSeat = bookingData.addChildSeat ? days * 8 : 0;
    const addons = gps + childSeat;
    const total = subtotal + insurance + addons;

    return { days, subtotal, insurance, addons, total };
  };

  const pricing = calculateRental();

  const handleInputChange = (field: string, value: string | boolean) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const required = ['pickupLocation', 'dropoffLocation', 'pickupDate', 'dropoffDate', 'pickupTime', 'dropoffTime'];
    return required.every(field => bookingData[field as keyof typeof bookingData]);
  };

  const validateStep2 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'driverLicense'];
    return required.every(field => contactInfo[field as keyof typeof contactInfo]);
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error('Vui lòng điền đầy đủ thông tin liên hệ');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create booking payload
      const bookingPayload = {
        vehicleId: parseInt(params.id as string) || 1,
        customerName: `${contactInfo.firstName} ${contactInfo.lastName}`,
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone,
        customerAddress: contactInfo.driverLicense, // Using license as address placeholder
        pickupDate: bookingData.pickupDate,
        dropoffDate: bookingData.dropoffDate,
        pickupTime: bookingData.pickupTime,
        dropoffTime: bookingData.dropoffTime,
        pickupLocation: pickupLocations.find(loc => loc.id.toString() === bookingData.pickupLocation)?.name || 'Main Office',
        dropoffLocation: pickupLocations.find(loc => loc.id.toString() === bookingData.dropoffLocation)?.name || 'Main Office',
        totalAmount: pricing.total,
        paymentMethod: bookingData.paymentMethod || 'cod',
        specialRequests: `Insurance: ${bookingData.addInsurance}, GPS: ${bookingData.addGPS}, Child Seat: ${bookingData.addChildSeat}`
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const savedBooking = await response.json();
      localStorage.setItem('customerEmail', contactInfo.email);
      setCreatedBooking(savedBooking);

      // Show QR modal for QR payment, otherwise redirect
      if (bookingData.paymentMethod === 'qr') {
        setShowQRModal(true);
      } else {
        toast.success('Đặt xe thành công! Kiểm tra email để xem chi tiết.');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      toast.error('Đặt xe thất bại. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href={`/vehicles/${params.id}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Quay lại chi tiết xe
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Đặt xe của bạn</h1>
            <p className="mt-2 text-gray-600">
              {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {[
                  { id: 1, name: 'Chi tiết thuê xe', href: '#', status: currentStep >= 1 ? 'complete' : 'upcoming' },
                  { id: 2, name: 'Thông tin liên hệ', href: '#', status: currentStep >= 2 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
                  { id: 3, name: 'Xem lại & Thanh toán', href: '#', status: currentStep >= 3 ? 'current' : 'upcoming' }
                ].map((step, stepIdx) => (
                  <li key={step.id} className={`${stepIdx !== 2 ? 'pr-8 sm:pr-20' : ''} relative`}>
                    {step.status === 'complete' ? (
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="h-0.5 w-full bg-primary-600" />
                      </div>
                    ) : step.status === 'current' ? (
                      stepIdx !== 2 && (
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                      )
                    ) : (
                      stepIdx !== 2 && (
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                      )
                    )}
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300">
                      {step.status === 'complete' ? (
                        <span className="text-primary-600 font-bold">✓</span>
                      ) : step.status === 'current' ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                      )}
                    </div>
                    <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2">
              {/* Step 1: Rental Details */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Chi tiết thuê xe</h2>
                  
                  {/* Location Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa điểm lấy xe *
                      </label>
                      <select
                        value={bookingData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {pickupLocations.map(location => (
                          <option key={location.id} value={location.id} disabled={!location.available}>
                            {location.name} - {location.address}
                            {!location.available && ' (Không khả dụng)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa điểm trả xe *
                      </label>
                      <select
                        value={bookingData.dropoffLocation}
                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {pickupLocations.map(location => (
                          <option key={location.id} value={location.id} disabled={!location.available}>
                            {location.name} - {location.address}
                            {!location.available && ' (Không khả dụng)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày lấy xe *
                        </label>
                        <input
                          type="date"
                          value={bookingData.pickupDate}
                          onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giờ lấy xe *
                        </label>
                        <select
                          value={bookingData.pickupTime}
                          onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày trả xe *
                        </label>
                        <input
                          type="date"
                          value={bookingData.dropoffDate}
                          onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                          min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giờ trả xe *
                        </label>
                        <select
                          value={bookingData.dropoffTime}
                          onChange={(e) => handleInputChange('dropoffTime', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Driver Age */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ tuổi tài xế
                    </label>
                    <select
                      value={bookingData.driverAge}
                      onChange={(e) => handleInputChange('driverAge', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="21-24">21-24 tuổi (Có phụ thu)</option>
                      <option value="25-64">25-64 tuổi</option>
                      <option value="65+">65+ tuổi</option>
                    </select>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dịch vụ tùy chọn</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={bookingData.addInsurance}
                          onChange={(e) => handleInputChange('addInsurance', e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">
                            Bảo hiểm cao cấp (+$15/ngày)
                          </label>
                          <p className="text-sm text-gray-500">
                            Bảo hiểm toàn diện với mức khấu trừ thấp hơn
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={bookingData.addGPS}
                          onChange={(e) => handleInputChange('addGPS', e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">
                            Hệ thống dẫn đường GPS (+$10/ngày)
                          </label>
                          <p className="text-sm text-gray-500">
                            GPS cao cấp với cập nhật giao thông thời gian thực
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={bookingData.addChildSeat}
                          onChange={(e) => handleInputChange('addChildSeat', e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">
                            Ghế an toàn trẻ em (+$8/ngày)
                          </label>
                          <p className="text-sm text-gray-500">
                            Phù hợp cho trẻ em từ 2-7 tuổi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin liên hệ</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.firstName}
                        onChange={(e) => handleContactChange('firstName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.lastName}
                        onChange={(e) => handleContactChange('lastName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ Email *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số giấy phép lái xe *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.driverLicense}
                        onChange={(e) => handleContactChange('driverLicense', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Bạn cần xuất trình giấy phép lái xe khi nhận xe
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Tổng quan đặt xe</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Thời gian thuê</h4>
                          <p className="text-sm text-gray-600">
                            {bookingData.pickupDate} lúc {bookingData.pickupTime} - {bookingData.dropoffDate} lúc {bookingData.dropoffTime}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Thời lượng</h4>
                          <p className="text-sm text-gray-600">{pricing.days} ngày</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">Thông tin liên hệ</h4>
                        <p className="text-sm text-gray-600">
                          {contactInfo.firstName} {contactInfo.lastName}<br/>
                          {contactInfo.email}<br/>
                          {contactInfo.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Phương thức thanh toán</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* QR Payment */}
                      <div
                        className="border-2 border-primary-500 bg-primary-50 rounded-lg p-5 cursor-pointer transition-all shadow-md"
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="qr"
                            checked={true}
                            readOnly
                            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 mr-4 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <svg className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                              </svg>
                              <span className="font-semibold text-gray-900 text-lg">Thanh toán QR</span>
                              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                Phổ biến
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 ml-9">VietQR / VNPay - Thanh toán nhanh chóng</p>
                          </div>
                        </div>
                      </div>

                      {/* COD Payment */}
                      <div
                        className="border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-lg p-5 cursor-pointer transition-all"
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 mr-4 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <svg className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="font-semibold text-gray-900 text-lg">Thanh toán khi lấy xe</span>
                              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                Phổ biến
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 ml-9">Thanh toán bằng tiền mặt khi nhận xe</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Lưu ý thanh toán:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li><strong>Thanh toán QR:</strong> Quét mã QR và chuyển khoản ngay, đơn sẽ được xác nhận trong 5-10 phút</li>
                            <li><strong>Thanh toán khi lấy xe:</strong> Thanh toán bằng tiền mặt hoặc thẻ khi nhận xe tại địa điểm</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <label className="text-sm text-gray-700">
                          Tôi đồng ý với{' '}
                          <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                            Điều khoản và Điều kiện
                          </Link>{' '}
                          và{' '}
                          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                            Chính sách Bảo mật
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Quay lại
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Tiếp theo
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt xe'}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng chi phí</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Xe ({pricing.days} ngày)
                    </span>
                    <span className="text-gray-900">${pricing.subtotal}</span>
                  </div>
                  
                  {bookingData.addInsurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bảo hiểm cao cấp</span>
                      <span className="text-gray-900">${pricing.insurance}</span>
                    </div>
                  )}
                  
                  {pricing.addons > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dịch vụ thêm</span>
                      <span className="text-gray-900">${pricing.addons}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế & Phí</span>
                    <span className="text-gray-900">${Math.round(pricing.total * 0.1)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-primary-600">${Math.round(pricing.total * 1.1)}</span>
                  </div>
                </div>

                {/* Important Information */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Thông tin quan trọng</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Cần có giấy phép lái xe hợp lệ</p>
                      <p>• Độ tuổi tối thiểu: 21 tuổi</p>
                      <p>• Đặt cọc: $200</p>
                      <p>• Hủy miễn phí trong vòng 24 giờ</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Xe của bạn</h4>
                  <p className="text-sm text-gray-600">
                    {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">${mockVehicle.dailyRate}/ngày</p>
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
        amount={pricing.total}
        customerEmail={contactInfo.email}
      />
    </>
  );
}