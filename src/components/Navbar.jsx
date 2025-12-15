import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Smartphone, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <Smartphone className="text-white" size={20} />
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              MobileRecharge
            </motion.span>
            <div className="ml-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs text-white font-semibold">
              Mobile Recharge Pro
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/home" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/plans" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
              >
                Recharge Plans
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/history" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
              >
                History
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>

            {/* Authentication Links */}
            {isLoggedIn ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 text-gray-600">
                  <User size={16} />
                  <span>Welcome, {user?.name || user?.email}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ y: -2 }}>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Signup
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;