'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  StarIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    customer: 'Nguyễn Văn An',
    customerEmail: 'nguyenvanan@gmail.com',
    vehicle: 'Toyota Camry 2023',
    bookingId: 'BK001',
    rating: 5,
    comment: 'Xe rất sạch sẽ và tiện nghi. Dịch vụ tuyệt vời, nhân viên thân thiện. Tôi sẽ thuê lại lần sau.',
    date: '2024-09-28',
    status: 'published',
    response: null,
    helpful: 12,
    reported: 0
  },
  {
    id: 2,
    customer: 'Trần Thị Bình',
    customerEmail: 'tranthibinh@gmail.com',
    vehicle: 'Honda Civic 2022',
    bookingId: 'BK002',
    rating: 4,
    comment: 'Xe chạy êm, tiết kiệm xăng. Chỉ có điều thủ tục nhận xe hơi lâu một chút.',
    date: '2024-09-27',
    status: 'published',
    response: 'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cải thiện quy trình nhận xe để nhanh chóng hơn.',
    helpful: 8,
    reported: 0
  },
  {
    id: 3,
    customer: 'Lê Minh Cường',
    customerEmail: 'leminhcuong@gmail.com',
    vehicle: 'Ford Escape 2023',
    bookingId: 'BK003',
    rating: 3,
    comment: 'Xe ổn nhưng có mùi khói thuốc lá. Cần làm sạch kỹ hơn trước khi giao xe.',
    date: '2024-09-26',
    status: 'pending',
    response: null,
    helpful: 5,
    reported: 1
  },
  {
    id: 4,
    customer: 'Phạm Thu Hương',
    customerEmail: 'phamthuhuong@gmail.com',
    vehicle: 'Chevrolet Malibu 2021',
    bookingId: 'BK004',
    rating: 2,
    comment: 'Xe có tiếng kêu lạ khi phanh. Rất lo lắng về vấn đề an toàn.',
    date: '2024-09-25',
    status: 'pending',
    response: null,
    helpful: 2,
    reported: 3
  },
  {
    id: 5,
    customer: 'Hoàng Văn Đức',
    customerEmail: 'hoangvanduc@gmail.com',
    vehicle: 'Nissan Altima 2022',
    bookingId: 'BK005',
    rating: 5,
    comment: 'Dịch vụ xuất sắc! Xe mới, sạch sẽ. App đặt xe rất tiện lợi. Highly recommended!',
    date: '2024-09-24',
    status: 'published',
    response: 'Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi bạn hài lòng với dịch vụ.',
    helpful: 15,
    reported: 0
  }
];

const statusConfig = {
  'published': { label: 'Đã xuất bản', color: 'bg-green-100 text-green-800' },
  'pending': { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  'hidden': { label: 'Đã ẩn', color: 'bg-red-100 text-red-800' }
};

const ratingColors = {
  5: 'text-green-600',
  4: 'text-blue-600', 
  3: 'text-yellow-600',
  2: 'text-orange-600',
  1: 'text-red-600'
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    return matchesRating && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: reviews.length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    pending: reviews.filter(r => r.status === 'pending').length,
    published: reviews.filter(r => r.status === 'published').length,
    reported: reviews.filter(r => r.reported > 0).length
  };

  const handleApproveReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'published' } : review
    ));
    toast.success('Đã duyệt đánh giá');
  };

  const handleRejectReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'hidden' } : review
    ));
    toast.success('Đã ẩn đánh giá');
  };

  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Đã xóa đánh giá');
    }
  };

  const handleResponseSubmit = () => {
    if (selectedReview && responseText.trim()) {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id 
          ? { ...review, response: responseText.trim() }
          : review
      ));
      toast.success('Đã gửi phản hồi');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedReview(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link 
                href="/admin" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Quay lại Dashboard
              </Link>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá</h1>
                <p className="mt-2 text-gray-600">
                  Xem và quản lý các đánh giá từ khách hàng ({filteredReviews.length} đánh giá)
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-500">Tổng đánh giá</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.averageRating}</div>
              <div className="text-sm text-gray-500">Điểm TB</div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(parseFloat(stats.averageRating)))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-500">Chờ duyệt</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.published}</div>
              <div className="text-sm text-gray-500">Đã xuất bản</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.reported}</div>
              <div className="text-sm text-gray-500">Bị báo cáo</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo điểm đánh giá
                </label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả điểm</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                  <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                  <option value="3">⭐⭐⭐ (3 sao)</option>
                  <option value="2">⭐⭐ (2 sao)</option>
                  <option value="1">⭐ (1 sao)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo trạng thái
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="hidden">Đã ẩn</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  <FunnelIcon className="h-5 w-5 inline mr-2" />
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {renderStars(review.rating)}
                        <span className={`ml-2 text-lg font-semibold ${ratingColors[review.rating as keyof typeof ratingColors]}`}>
                          {review.rating}/5
                        </span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[review.status as keyof typeof statusConfig].color}`}>
                        {statusConfig[review.status as keyof typeof statusConfig].label}
                      </span>
                      {review.reported > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          {review.reported} báo cáo
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <strong>Khách hàng:</strong> {review.customer}
                      </div>
                      <div>
                        <strong>Phương tiện:</strong> {review.vehicle}
                      </div>
                      <div>
                        <strong>Mã đơn:</strong> {review.bookingId}
                      </div>
                      <div>
                        <strong>Ngày đánh giá:</strong> {new Date(review.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveReview(review.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Duyệt đánh giá"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRejectReview(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Từ chối đánh giá"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setResponseText(review.response || '');
                        setShowResponseModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Phản hồi"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa đánh giá"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Review Comment */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-900 leading-relaxed">{review.comment}</p>
                </div>

                {/* Admin Response */}
                {review.response && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="text-sm font-medium text-blue-900">Phản hồi từ Admin:</div>
                    </div>
                    <p className="text-blue-800 text-sm">{review.response}</p>
                  </div>
                )}

                {/* Review Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span>{review.helpful} người thấy hữu ích</span>
                    {review.reported > 0 && (
                      <span className="text-red-600">{review.reported} báo cáo</span>
                    )}
                  </div>
                  <div>
                    Email: {review.customerEmail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy đánh giá nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Phản hồi đánh giá
                  </h3>
                  
                  {/* Original Review */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      {renderStars(selectedReview?.rating || 0)}
                      <span className="ml-2 font-semibold">{selectedReview?.customer}</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedReview?.comment}</p>
                  </div>

                  {/* Response Textarea */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phản hồi của bạn:
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập phản hồi của bạn..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleResponseSubmit}
                  disabled={!responseText.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gửi phản hồi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedReview(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}