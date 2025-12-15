import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful signup and auto-login
      login({
        email: formData.email,
        name: formData.name,
        phone: formData.phone
      });
      
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 relative">
      {/* Back Button - Top Corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 left-6 z-20"
      >
        <motion.div
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Welcome</span>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div 
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <UserPlus className="text-white" size={32} />
          </motion.div>
          <h2 className="text-4xl font-bold gradient-text mb-3">Join Us Today</h2>
          <p className="text-xl text-gray-600">Create your account and start recharging</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </motion.p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
              </div>
              {errors.phone && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.phone}</span>
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.password}</span>
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.confirmPassword}</span>
                </motion.p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Creating Account...
                </div>
              ) : (
                'Create Account →'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-500 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default Signup;