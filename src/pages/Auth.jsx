import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail, User, Phone, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isLogin && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isLogin && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
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
    
    setTimeout(() => {
      login({
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        phone: formData.phone
      });
      
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute bottom-20 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"
        />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Welcome</span>
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div 
          key={isLogin ? 'login-header' : 'signup-header'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className={`w-20 h-20 bg-gradient-to-r ${
              isLogin ? 'from-blue-500 to-purple-600' : 'from-purple-500 to-blue-600'
            } rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
          >
            {isLogin ? <Lock className="text-white" size={32} /> : <UserPlus className="text-white" size={32} />}
          </motion.div>
          <h2 className="text-4xl font-bold gradient-text mb-3">
            {isLogin ? 'Welcome Back' : 'Join Us Today'}
          </h2>
          <p className="text-xl text-gray-600">
            {isLogin ? 'Sign in to continue your recharge journey' : 'Create your account and start recharging'}
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLogin 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                !isLogin 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {/* Name Field - Only for Signup */}
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div
              layout
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : `border-gray-200 focus:ring-${isLogin ? 'blue' : 'purple'}-500 focus:border-${isLogin ? 'blue' : 'purple'}-500 bg-white`
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
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Phone Field - Only for Signup */}
              {!isLogin && (
                <motion.div
                  key="phone-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <motion.div
              layout
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : `border-gray-200 focus:ring-${isLogin ? 'blue' : 'purple'}-500 focus:border-${isLogin ? 'blue' : 'purple'}-500 bg-white`
                  }`}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
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
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Confirm Password Field - Only for Signup */}
              {!isLogin && (
                <motion.div
                  key="confirm-password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me / Terms */}
            <motion.div
              layout
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Forgot password?
                  </Link>
                </div>
              ) : (
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
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${
                isLogin 
                  ? 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                  : 'from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
              } text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                `${isLogin ? 'Sign In' : 'Create Account'} →`
              )}
            </motion.button>
          </form>
        </motion.div>


      </div>
    </div>
  );
};

export default Auth;