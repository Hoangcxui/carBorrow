import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative page-container py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Thuê xe dễ dàng với
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400"> CarBorrow</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-2xl mx-auto">
              Trải nghiệm tự do lái xe với bộ sưu tập đa dạng các phương tiện chất lượng cao. 
              Đặt online, lái xe ngay!
            </p>
            
            {/* Quick Search Form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto backdrop-blur-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Địa điểm</label>
                  <select className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium transition-all">
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ngày nhận</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ngày trả</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 font-medium transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 opacity-0">Search</label>
                  <Link 
                    href="/vehicles" 
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    Tìm xe
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/vehicles" className="px-10 py-4 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Xem tất cả xe
              </Link>
              <Link href="/register" className="px-10 py-4 border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="page-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tại sao chọn CarBorrow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi làm cho việc thuê xe trở nên đơn giản, giá cả phải chăng và đáng tin cậy với dịch vụ cao cấp mà bạn có thể tin tưởng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                XE
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Đội xe cao cấp</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Lựa chọn từ bộ sưu tập đa dạng các xe được bảo dưỡng tốt, cao cấp cho mọi dịp.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                24/7
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Dịch vụ 24/7</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Hỗ trợ khách hàng suốt ngày đêm và thời gian nhận xe linh hoạt phù hợp với lịch trình của bạn.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                OK
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Bảo hiểm toàn diện</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Tất cả xe đều có bảo hiểm toàn diện để bạn an tâm.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                5
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Dịch vụ 5 sao</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Liên tục được khách hàng đánh giá 5 sao về dịch vụ xuất sắc và đáng tin cậy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative page-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-primary-100">
            Tham gia cùng hàng nghìn khách hàng hài lòng tin tưởng CarBorrow cho nhu cầu di chuyển của họ.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/vehicles" className="px-12 py-5 bg-white text-primary-600 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Xem tất cả xe
            </Link>
            <Link href="/register" className="px-12 py-5 border-2 border-white rounded-full text-lg font-bold hover:bg-white hover:text-primary-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}