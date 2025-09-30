'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

// Mock complaints data
const mockComplaints = [
  {
    id: 'CP001',
    customer: 'Nguyễn Văn An',
    customerEmail: 'nguyenvanan@gmail.com',
    customerPhone: '0123456789',
    bookingId: 'BK001',
    vehicle: 'Toyota Camry 2023',
    category: 'Vehicle Issue',
    priority: 'High',
    subject: 'Xe có tiếng động lạ khi phanh',
    description: 'Khi tôi phanh xe, có tiếng kêu rất to và xe rung lắc. Tôi lo lắng về vấn đề an toàn và muốn được hỗ trợ ngay lập tức.',
    status: 'Open',
    createdDate: '2024-09-29',
    updatedDate: '2024-09-29',
    assignedTo: 'Lê Văn Tâm',
    response: null,
    images: ['/api/placeholder/300/200'],
    resolution: null
  },
  {
    id: 'CP002',
    customer: 'Trần Thị Bình',
    customerEmail: 'tranthibinh@gmail.com',
    customerPhone: '0987654321',
    bookingId: 'BK002',
    vehicle: 'Honda Civic 2022',
    category: 'Service Issue',
    priority: 'Medium',
    subject: 'Nhân viên giao xe không đúng giờ',
    description: 'Tôi đã đặt lịch nhận xe lúc 9h sáng nhưng phải đợi đến 10h30 mới có người mang xe đến. Điều này ảnh hưởng đến lịch trình công việc của tôi.',
    status: 'In Progress',
    createdDate: '2024-09-28',
    updatedDate: '2024-09-29',
    assignedTo: 'Phạm Minh Đức',
    response: 'Chúng tôi xin lỗi về sự bất tiện này. Chúng tôi đang kiểm tra và sẽ cải thiện quy trình giao xe.',
    images: [],
    resolution: null
  },
  {
    id: 'CP003',
    customer: 'Lê Minh Cường',
    customerEmail: 'leminhcuong@gmail.com',
    customerPhone: '0369258147',
    bookingId: 'BK003',
    vehicle: 'Ford Escape 2023',
    category: 'Billing Issue',
    priority: 'Low',
    subject: 'Bị tính phí thêm không rõ lý do',
    description: 'Trong hóa đơn có khoản phí $25 nhưng không được giải thích rõ ràng. Tôi muốn được làm rõ khoản phí này.',
    status: 'Resolved',
    createdDate: '2024-09-25',
    updatedDate: '2024-09-27',
    assignedTo: 'Nguyễn Thu Hà',
    response: 'Khoản phí $25 là phí vệ sinh xe do phát hiện có vết bẩn và mùi thuốc lá trong xe. Chúng tôi đã gửi email chi tiết kèm hình ảnh.',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    resolution: 'Đã hoàn tiền $15 sau khi xem xét lại mức độ vết bẩn.'
  },
  {
    id: 'CP004',
    customer: 'Phạm Thu Hương',
    customerEmail: 'phamthuhuong@gmail.com',
    customerPhone: '0147258369',
    bookingId: 'BK004',
    vehicle: 'Chevrolet Malibu 2021',
    category: 'Vehicle Issue',
    priority: 'High',
    subject: 'Xe bị hết xăng giữa đường',
    description: 'Xe đột nhiên dừng giữa đường do hết xăng mặc dù đồng hồ báo còn 1/4 bình. Tôi phải gọi cứu hộ và bị trễ cuộc họp quan trọng.',
    status: 'Open',
    createdDate: '2024-09-30',
    updatedDate: '2024-09-30',
    assignedTo: null,
    response: null,
    images: ['/api/placeholder/300/200'],
    resolution: null
  }
];

const statusConfig = {
  'Open': { label: 'Mở', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
  'In Progress': { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  'Resolved': { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  'Closed': { label: 'Đã đóng', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
};

const priorityConfig = {
  'High': { label: 'Cao', color: 'bg-red-100 text-red-800' },
  'Medium': { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  'Low': { label: 'Thấp', color: 'bg-green-100 text-green-800' }
};

const categoryConfig = {
  'Vehicle Issue': 'Vấn đề xe',
  'Service Issue': 'Vấn đề dịch vụ',
  'Billing Issue': 'Vấn đề thanh toán',
  'App Issue': 'Vấn đề ứng dụng',
  'Other': 'Khác'
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    return matchesStatus && matchesPriority && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highPriority: complaints.filter(c => c.priority === 'High').length
  };

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
        : complaint
    ));
    toast.success(`Đã cập nhật trạng thái thành ${statusConfig[newStatus as keyof typeof statusConfig].label}`);
  };

  const handleAssignComplaint = (complaintId: string, assignee: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, assignedTo: assignee, updatedDate: new Date().toISOString().split('T')[0] }
        : complaint
    ));
    toast.success(`Đã giao phản ánh cho ${assignee}`);
  };

  const handleResponseSubmit = () => {
    if (selectedComplaint && responseText.trim()) {
      setComplaints(prev => prev.map(complaint => 
        complaint.id === selectedComplaint.id 
          ? { 
              ...complaint, 
              response: responseText.trim(),
              status: complaint.status === 'Open' ? 'In Progress' : complaint.status,
              updatedDate: new Date().toISOString().split('T')[0]
            }
          : complaint
      ));
      toast.success('Đã gửi phản hồi');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedComplaint(null);
    }
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || ExclamationTriangleIcon;
    return <IconComponent className="h-4 w-4 mr-1" />;
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
                <h1 className="text-3xl font-bold text-gray-900">Quản lý phản ánh</h1>
                <p className="mt-2 text-gray-600">
                  Xử lý các phản ánh và khiếu nại từ khách hàng ({filteredComplaints.length} phản ánh)
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-500">Tổng phản ánh</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.open}</div>
              <div className="text-sm text-gray-500">Chưa xử lý</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">Đang xử lý</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
              <div className="text-sm text-gray-500">Đã giải quyết</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.highPriority}</div>
              <div className="text-sm text-gray-500">Ưu tiên cao</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Open">Mở</option>
                  <option value="In Progress">Đang xử lý</option>
                  <option value="Resolved">Đã giải quyết</option>
                  <option value="Closed">Đã đóng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ ưu tiên
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="High">Cao</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Low">Thấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phản ánh
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Vehicle Issue">Vấn đề xe</option>
                  <option value="Service Issue">Vấn đề dịch vụ</option>
                  <option value="Billing Issue">Vấn đề thanh toán</option>
                  <option value="App Issue">Vấn đề ứng dụng</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-4">
                        #{complaint.id} - {complaint.subject}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[complaint.status as keyof typeof statusConfig].color}`}>
                        {getStatusIcon(complaint.status)}
                        {statusConfig[complaint.status as keyof typeof statusConfig].label}
                      </span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig[complaint.priority as keyof typeof priorityConfig].color}`}>
                        {priorityConfig[complaint.priority as keyof typeof priorityConfig].label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <strong>Khách hàng:</strong> {complaint.customer}
                      </div>
                      <div>
                        <strong>Phương tiện:</strong> {complaint.vehicle}
                      </div>
                      <div>
                        <strong>Loại:</strong> {categoryConfig[complaint.category as keyof typeof categoryConfig]}
                      </div>
                      <div>
                        <strong>Ngày tạo:</strong> {new Date(complaint.createdDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-900 leading-relaxed">
                        {complaint.description.length > 150 
                          ? `${complaint.description.substring(0, 150)}...` 
                          : complaint.description
                        }
                      </p>
                    </div>

                    {complaint.assignedTo && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Được giao cho:</strong> {complaint.assignedTo}
                      </div>
                    )}

                    {complaint.response && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="text-sm font-medium text-blue-900 mb-1">Phản hồi:</div>
                        <p className="text-blue-800 text-sm">{complaint.response}</p>
                      </div>
                    )}

                    {complaint.resolution && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                        <div className="text-sm font-medium text-green-900 mb-1">Giải pháp:</div>
                        <p className="text-green-800 text-sm">{complaint.resolution}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setResponseText(complaint.response || '');
                        setShowResponseModal(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Phản hồi"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </button>

                    {/* Quick Status Actions */}
                    {complaint.status === 'Open' && (
                      <button
                        onClick={() => handleStatusChange(complaint.id, 'In Progress')}
                        className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full hover:bg-yellow-200"
                      >
                        Bắt đầu xử lý
                      </button>
                    )}
                    
                    {complaint.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(complaint.id, 'Resolved')}
                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                      >
                        Đánh dấu đã giải quyết
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {complaint.customerEmail}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {complaint.customerPhone}
                    </div>
                  </div>
                  <div>
                    Cập nhật: {new Date(complaint.updatedDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có phản ánh nào</p>
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

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Phản hồi khiếu nại #{selectedComplaint?.id}
                  </h3>
                  
                  {/* Complaint Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedComplaint?.subject}</h4>
                    <p className="text-sm text-gray-700 mb-2">{selectedComplaint?.description}</p>
                    <div className="text-xs text-gray-500">
                      Khách hàng: {selectedComplaint?.customer} | Xe: {selectedComplaint?.vehicle}
                    </div>
                  </div>

                  {/* Response Textarea */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phản hồi của bạn:
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập phản hồi chi tiết về vấn đề khách hàng gặp phải..."
                    />
                  </div>

                  {/* Status Update */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cập nhật trạng thái:
                    </label>
                    <select
                      value={selectedComplaint?.status}
                      onChange={(e) => {
                        if (selectedComplaint) {
                          setSelectedComplaint({...selectedComplaint, status: e.target.value});
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Open">Mở</option>
                      <option value="In Progress">Đang xử lý</option>
                      <option value="Resolved">Đã giải quyết</option>
                      <option value="Closed">Đã đóng</option>
                    </select>
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
                    setSelectedComplaint(null);
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

      {/* Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 max-h-screen overflow-y-auto">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                    Chi tiết phản ánh #{selectedComplaint.id}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin cơ bản</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div><strong>Tiêu đề:</strong> {selectedComplaint.subject}</div>
                          <div><strong>Loại:</strong> {categoryConfig[selectedComplaint.category as keyof typeof categoryConfig]}</div>
                          <div><strong>Mức độ:</strong> {priorityConfig[selectedComplaint.priority as keyof typeof priorityConfig].label}</div>
                          <div><strong>Trạng thái:</strong> {statusConfig[selectedComplaint.status as keyof typeof statusConfig].label}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div><strong>Tên:</strong> {selectedComplaint.customer}</div>
                          <div><strong>Email:</strong> {selectedComplaint.customerEmail}</div>
                          <div><strong>Điện thoại:</strong> {selectedComplaint.customerPhone}</div>
                          <div><strong>Mã đơn thuê:</strong> {selectedComplaint.bookingId}</div>
                          <div><strong>Xe:</strong> {selectedComplaint.vehicle}</div>
                        </div>
                      </div>
                    </div>

                    {/* Complaint Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Nội dung phản ánh</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900 leading-relaxed">{selectedComplaint.description}</p>
                        </div>
                      </div>

                      {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Hình ảnh đính kèm</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedComplaint.images.map((image: string, index: number) => (
                              <div key={index} className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                                <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response and Resolution */}
                  {(selectedComplaint.response || selectedComplaint.resolution) && (
                    <div className="mt-6 space-y-4">
                      {selectedComplaint.response && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Phản hồi</h4>
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                            <p className="text-blue-800">{selectedComplaint.response}</p>
                          </div>
                        </div>
                      )}

                      {selectedComplaint.resolution && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Giải pháp</h4>
                          <div className="bg-green-50 border-l-4 border-green-400 p-4">
                            <p className="text-green-800">{selectedComplaint.resolution}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Lịch sử</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Tạo:</strong> {new Date(selectedComplaint.createdDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div>
                          <strong>Cập nhật cuối:</strong> {new Date(selectedComplaint.updatedDate).toLocaleDateString('vi-VN')}
                        </div>
                        {selectedComplaint.assignedTo && (
                          <div>
                            <strong>Được giao cho:</strong> {selectedComplaint.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}