import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📱</span>
              </div>
              <span className="text-xl font-bold">MobileRecharge</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for instant mobile recharges with the best plans and offers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-400 hover:text-white transition-colors">
                  Recharge Plans
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Mobile Recharge</li>
              <li>Bill Payment</li>
              <li>DTH Recharge</li>
              <li>Data Card Recharge</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>📞 1800-123-4567</p>
              <p>📧 support@mobilerecharge.com</p>
              <p>🕒 24/7 Customer Support</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 MobileRecharge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;