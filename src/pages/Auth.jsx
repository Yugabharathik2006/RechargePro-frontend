import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { ArrowLeft, Lock, Mail, User, Phone, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

// Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 0, 0)">
      <path fill="#EA4335" d="M12 5.04c1.66 0 3.14.57 4.31 1.57l3.2-3.2C17.46 1.4 14.93.36 12 .36 7.31.36 3.25 3.18 1.27 7.27l3.71 2.88C5.89 7.08 8.68 5.04 12 5.04z" />
      <path fill="#4285F4" d="M23.64 12.27c0-.87-.08-1.71-.22-2.52H12v4.76h6.54c-.28 1.52-1.13 2.81-2.41 3.67l3.71 2.88c2.16-2 3.4-4.94 3.4-8.79z" />
      <path fill="#FBBC05" d="M4.98 14.24c-.24-.71-.38-1.46-.38-2.24s.14-1.53.38-2.24L1.27 6.88C.46 8.48 0 10.18 0 12s.46 3.52 1.27 5.12l3.71-2.88z" />
      <path fill="#34A853" d="M12 24c2.93 0 5.39-1 7.19-2.73l-3.71-2.88c-.97.65-2.21 1.03-3.48 1.03-3.32 0-6.11-2.04-7.02-5.11l-3.71 2.88C3.25 20.82 7.31 24 12 24z" />
    </g>
  </svg>
);

// Animated loading dots for Google button
const LoadingDots = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}
  </div>
);

const loginSchema = yup.object().shape({
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signupSchema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // All hooks must be called unconditionally at the top
  const { login, signup, googleLogin, isLoggedIn, isLoading: authIsLoading } = useAuth();

  const { register, handleSubmit, formState: { errors, touchedFields }, reset, trigger } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
    mode: 'onTouched', // Only validate after field is touched/blurred
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    reset();
  }, [isLogin, reset]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data) => {
    // Validate form data before submitting (handles autofill edge cases)
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    let result;

    if (isLogin) {
      result = await login({ email: data.email, password: data.password });
    } else {
      result = await signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'USER'
      });
    }

    if (result.success) {
      toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
      navigate('/home');
    } else {
      toast.error(result.message || 'Authentication failed');
    }
  };

  // Google OAuth login using useGoogleLogin hook
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();

        const result = await googleLogin({
          sub: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        });

        if (result.success) {
          toast.success('Welcome! Signed in with Google 🎉');
          navigate('/home');
        } else {
          toast.error(result.message || 'Google authentication failed');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Google authentication failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-In was unsuccessful. Please try again.');
      setIsGoogleLoading(false);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">

      {/* Back Button - Fixed Top Left Corner */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className="group flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-white/50 hover:bg-white hover:shadow-xl transition-all duration-300"
        >
          <motion.div
            whileHover={{ x: -3 }}
            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </motion.div>
          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors pr-1">
            Back
          </span>
        </Link>
      </motion.div>

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
            className={`w-20 h-20 bg-gradient-to-r ${isLogin ? 'from-blue-500 to-purple-600' : 'from-purple-500 to-blue-600'
              } rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
          >
            {isLogin ? <Lock className="text-white" size={32} /> : <UserPlus className="text-white" size={32} />}
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
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
              onClick={() => navigate('/login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isLogin
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${!isLogin
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </motion.button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                      {...register('name')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${errors.name && touchedFields.name
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && touchedFields.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.name.message}</span>
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
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${errors.email && touchedFields.email
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : `border-gray-200 focus:ring-${isLogin ? 'blue' : 'purple'}-500 focus:border-${isLogin ? 'blue' : 'purple'}-500 bg-white`
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && touchedFields.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.email.message}</span>
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
                      {...register('phone')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${errors.phone && touchedFields.phone
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-white'
                        }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  {errors.phone && touchedFields.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.phone.message}</span>
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  {...register('password')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${errors.password && touchedFields.password
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
              {errors.password && touchedFields.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{errors.password.message}</span>
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
                      {...register('confirmPassword')}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${errors.confirmPassword && touchedFields.confirmPassword
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
                  {errors.confirmPassword && touchedFields.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{errors.confirmPassword.message}</span>
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
            <Button
              type="submit"
              disabled={authIsLoading}
              isLoading={authIsLoading}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-2xl ${isLogin
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
                }`}
            >
              {isLogin ? 'Sign In' : 'Create Account'} →
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <motion.button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isGoogleLoading}
              className="relative w-full group overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

              {/* Inner button content */}
              <div className="relative m-[2px] bg-white rounded-[14px] px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-gray-50">
                {isGoogleLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold text-gray-700">
                      Connecting<LoadingDots />
                    </span>
                  </>
                ) : (
                  <>
                    {/* Google Icon with hover animation */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <GoogleIcon className="w-6 h-6" />
                    </motion.div>

                    {/* Button text */}
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                      {isLogin ? 'Continue with Google' : 'Sign up with Google'}
                    </span>

                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" />
                      </svg>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
              </motion.div>
            </motion.button>
          </form>
        </motion.div>

      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Auth;