import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  CarIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  StarIcon 
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="page-container py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Rent Premium Cars with
              <span className="text-primary-200"> Confidence</span>
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Experience the freedom of driving with our wide selection of premium vehicles. 
              Book online, drive away happy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vehicles" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Browse Vehicles
              </Link>
              <Link href="/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CarBorrow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make car rental simple, affordable, and reliable with premium service you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">
                Choose from our wide selection of well-maintained, premium vehicles for every occasion.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">
                Round-the-clock customer support and flexible pickup times to fit your schedule.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-600">
                All vehicles come with comprehensive insurance coverage for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Service</h3>
              <p className="text-gray-600">
                Consistently rated 5 stars by our customers for exceptional service and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="page-container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CarBorrow for their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles" className="btn-primary text-lg px-8 py-3">
              View All Vehicles
            </Link>
            <Link href="/register" className="btn-secondary text-lg px-8 py-3">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}