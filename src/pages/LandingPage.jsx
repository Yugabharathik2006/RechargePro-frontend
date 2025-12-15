import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';

const LandingPage = () => {
  const featuredPlans = [
    {
      id: 1,
      price: 299,
      validity: '28 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      popular: true
    },
    {
      id: 2,
      price: 719,
      validity: '84 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    {
      id: 3,
      price: 199,
      validity: '18 Days',
      data: '2 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    }
  ];

  const services = [
    { icon: '📱', title: 'Mobile Recharge', desc: 'Instant prepaid recharge' },
    { icon: '💳', title: 'Bill Payment', desc: 'Pay postpaid bills easily' },
    { icon: '📺', title: 'DTH Recharge', desc: 'Recharge DTH services' },
    { icon: '🎁', title: 'Special Offers', desc: 'Exclusive cashback deals' }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Instant Mobile
              <span className="block text-yellow-300">Recharge</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Recharge your mobile instantly with the best plans, exclusive offers, and 24/7 support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/plans" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                View All Plans
              </Link>
              <Link 
                to="/signup" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Everything you need for your mobile recharge</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Recharge Plans</h2>
            <p className="text-xl text-gray-600">Popular plans chosen by millions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/plans" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10 Sec</div>
              <div className="text-blue-100">Average Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of users who trust us for their mobile recharge needs
          </p>
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Create Account Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;