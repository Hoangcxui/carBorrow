'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  { id: 1, name: 'Downtown Location', address: '123 Main St, City Center', available: true },
  { id: 2, name: 'Airport Terminal', address: '456 Airport Rd, Terminal 1', available: true },
  { id: 3, name: 'Mall Location', address: '789 Shopping Blvd, Grand Mall', available: false }
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function BookVehiclePage() {
  const params = useParams();
  const router = useRouter();
  
  const [bookingData, setBookingData] = useState({
    pickupLocation: '1',
    dropoffLocation: '1',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '10:00 AM',
    dropoffTime: '10:00 AM',
    driverAge: '25-64',
    addInsurance: false,
    addGPS: false,
    addChildSeat: false
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
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error('Please fill in all contact information');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      toast.error('Please fill in all required information');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Booking confirmed! Check your email for details.');
      router.push('/dashboard/bookings');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
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
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Vehicle Details
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Vehicle</h1>
            <p className="mt-2 text-gray-600">
              {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {[
                  { id: 1, name: 'Rental Details', href: '#', status: currentStep >= 1 ? 'complete' : 'upcoming' },
                  { id: 2, name: 'Contact Info', href: '#', status: currentStep >= 2 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
                  { id: 3, name: 'Review & Pay', href: '#', status: currentStep >= 3 ? 'current' : 'upcoming' }
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
                        <CheckCircleIcon className="h-5 w-5 text-primary-600" />
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Rental Details</h2>
                  
                  {/* Location Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location *
                      </label>
                      <select
                        value={bookingData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {pickupLocations.map(location => (
                          <option key={location.id} value={location.id} disabled={!location.available}>
                            {location.name} - {location.address}
                            {!location.available && ' (Unavailable)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drop-off Location *
                      </label>
                      <select
                        value={bookingData.dropoffLocation}
                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {pickupLocations.map(location => (
                          <option key={location.id} value={location.id} disabled={!location.available}>
                            {location.name} - {location.address}
                            {!location.available && ' (Unavailable)'}
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
                          Pickup Date *
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
                          Pickup Time *
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
                          Drop-off Date *
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
                          Drop-off Time *
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
                      Driver Age
                    </label>
                    <select
                      value={bookingData.driverAge}
                      onChange={(e) => handleInputChange('driverAge', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="21-24">21-24 years (Additional fee applies)</option>
                      <option value="25-64">25-64 years</option>
                      <option value="65+">65+ years</option>
                    </select>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Add-ons</h3>
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
                            Premium Insurance Coverage (+$15/day)
                          </label>
                          <p className="text-sm text-gray-500">
                            Comprehensive coverage with lower deductible
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
                            GPS Navigation System (+$10/day)
                          </label>
                          <p className="text-sm text-gray-500">
                            Premium GPS with real-time traffic updates
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
                            Child Safety Seat (+$8/day)
                          </label>
                          <p className="text-sm text-gray-500">
                            Suitable for children 2-7 years old
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
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
                        Last Name *
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
                        Email Address *
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
                        Phone Number *
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
                        Driver License Number *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.driverLicense}
                        onChange={(e) => handleContactChange('driverLicense', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        You'll need to present your physical license at pickup
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Rental Period</h4>
                          <p className="text-sm text-gray-600">
                            {bookingData.pickupDate} at {bookingData.pickupTime} - {bookingData.dropoffDate} at {bookingData.dropoffTime}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Duration</h4>
                          <p className="text-sm text-gray-600">{pricing.days} day{pricing.days > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">Contact Information</h4>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="mt-6">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label className="text-sm text-gray-700">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                              Terms and Conditions
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
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
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Vehicle ({pricing.days} day{pricing.days > 1 ? 's' : ''})
                    </span>
                    <span className="text-gray-900">${pricing.subtotal}</span>
                  </div>
                  
                  {bookingData.addInsurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Premium Insurance</span>
                      <span className="text-gray-900">${pricing.insurance}</span>
                    </div>
                  )}
                  
                  {pricing.addons > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="text-gray-900">${pricing.addons}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900">${Math.round(pricing.total * 0.1)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-600">${Math.round(pricing.total * 1.1)}</span>
                  </div>
                </div>

                {/* Important Information */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">Important Information</h4>
                      <div className="mt-2 text-xs text-blue-700">
                        <p>• Valid driver's license required</p>
                        <p>• Minimum age: 21 years</p>
                        <p>• Security deposit: $200</p>
                        <p>• Free cancellation up to 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Your Vehicle</h4>
                  <p className="text-sm text-gray-600">
                    {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">${mockVehicle.dailyRate}/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}