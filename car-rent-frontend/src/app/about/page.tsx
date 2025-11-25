'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircleIcon, UserGroupIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  const features = [
    {
      icon: CheckCircleIcon,
      title: 'Đa dạng phương tiện',
      description: 'Hơn 100+ xe từ phổ thông đến cao cấp, đáp ứng mọi nhu cầu của bạn'
    },
    {
      icon: UserGroupIcon,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Nhân viên được đào tạo bài bản, phục vụ tận tâm 24/7'
    },
    {
      icon: ClockIcon,
      title: 'Thuê xe nhanh chóng',
      description: 'Đặt xe online dễ dàng, nhận xe trong 30 phút'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bảo hiểm toàn diện',
      description: 'Xe được bảo hiểm đầy đủ, an tâm trên mọi chặng đường'
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="page-container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Về CarBorrow
              </h1>
              <p className="text-xl text-primary-100">
                Dịch vụ cho thuê xe hàng đầu tại TP.HCM với hơn 5 năm kinh nghiệm
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="page-container py-16">
          {/* Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
            <div className="prose prose-lg">
              <p className="text-gray-600 leading-relaxed mb-4">
                CarBorrow được thành lập vào năm 2020 với sứ mệnh mang đến dịch vụ cho thuê xe 
                chất lượng cao, tiện lợi và đáng tin cậy cho người dân Sài Gòn. Chúng tôi hiểu rằng 
                việc di chuyển là nhu cầu thiết yếu trong cuộc sống hiện đại.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Với đội xe đa dạng từ xe tiết kiệm đến xe sang, từ xe 4 chỗ đến xe 7 chỗ, 
                CarBorrow cam kết đáp ứng mọi nhu cầu của khách hàng. Tất cả xe đều được 
                bảo dưỡng định kỳ và kiểm tra kỹ lưỡng trước mỗi chuyến đi.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ nhân viên của chúng tôi luôn sẵn sàng hỗ trợ 24/7, đảm bảo trải nghiệm 
                thuê xe của bạn luôn suôn sẻ và thoải mái nhất.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Tại sao chọn CarBorrow?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Địa điểm phục vụ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="font-bold text-lg mb-2">HUFLIT - Cơ sở Sư Vạn Hạnh</h3>
                <p className="text-gray-600">828 Sư Vạn Hạnh, Quận 10, TP.HCM</p>
                <p className="text-sm text-gray-500 mt-1">📞 028 3863 6636</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="font-bold text-lg mb-2">HUFLIT - Cơ sở Trường Sơn</h3>
                <p className="text-gray-600">32 Trường Sơn, Quận Tân Bình, TP.HCM</p>
                <p className="text-sm text-gray-500 mt-1">📞 028 3844 0091</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="font-bold text-lg mb-2">HUFLIT - Cơ sở Ba Gia</h3>
                <p className="text-gray-600">52-70 Ba Gia, Quận Tân Bình, TP.HCM</p>
                <p className="text-sm text-gray-500 mt-1">📞 028 3842 3377</p>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="font-bold text-lg mb-2">HUFLIT - Cơ sở Hóc Môn</h3>
                <p className="text-gray-600">806 Lê Quang Đạo, Quận 12, TP.HCM</p>
                <p className="text-sm text-gray-500 mt-1">📞 028 3755 5555</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
