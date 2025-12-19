import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Zap, CreditCard, Wifi, Shield, Users, TrendingUp, Award, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import OperatorCard from '../components/OperatorCard';
import PlanCard from '../components/PlanCard';
import RechargeForm from '../components/RechargeForm';
import Modal from '../components/Modal';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';

const operators = [
  {
    id: 'airtel',
    name: 'Airtel',
    description: "India's fastest 5G network",
    logo: 'https://s.yimg.com/zb/imgv1/4b6c4320-7846-39f4-8b72-13a3348db670/t_500x300',
  },
  {
    id: 'jio',
    name: 'Jio',
    description: 'Pan-India 4G & 5G coverage',
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Jio-Logo.png',
  },
  {
    id: 'vi',
    name: 'Vi',
    description: 'Premium postpaid experience',
    logo: 'https://s.yimg.com/fz/api/res/1.2/__gkjj0PdmI25FfLh9vmcQ--~C/YXBwaWQ9c3JjaGRkO2g9MTQ0O3E9ODA7dz0xNDQ-/https://s.yimg.com/zb/imgv1/b4c4f890-3927-3b9a-a8e8-68288fc852ab/t_500x300',
  },
  {
    id: 'bsnl',
    name: 'BSNL',
    description: 'Affordable nationwide plans',
    logo: 'https://static.vecteezy.com/system/resources/previews/051/805/644/non_2x/bsnl-transparent-orange-color-logo-free-png.png',
  },
];

// Professional promotional banners with images (swapped from Plans page)
const promoBanners = [
  {
    id: 1,
    title: 'Unlimited Entertainment',
    subtitle: 'Stream, Play & Connect Without Limits',
    description: 'Get unlimited data with our premium plans. Watch HD videos, play games, and stay connected 24/7.',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&h=300&fit=crop',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    stats: [
      { label: 'Happy Users', value: '10M+' },
      { label: 'Data Speed', value: '100Mbps' },
    ],
    badge: 'MOST POPULAR',
    icon: Wifi,
  },
  {
    id: 2,
    title: 'Family Plans Save More',
    subtitle: 'Connect Your Loved Ones Together',
    description: 'Special family bundles with shared data and unlimited calling. Save up to 40% on group plans.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    stats: [
      { label: 'Savings', value: '40%' },
      { label: 'Members', value: 'Up to 5' },
    ],
    badge: 'FAMILY DEAL',
    icon: Users,
  },
  {
    id: 3,
    title: 'Work From Anywhere',
    subtitle: 'Professional Plans for Remote Workers',
    description: 'High-speed data plans designed for professionals. Stable connection for video calls and uploads.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    stats: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Support', value: '24/7' },
    ],
    badge: 'FOR PROFESSIONALS',
    icon: TrendingUp,
  },
  {
    id: 4,
    title: 'Student Special Offer',
    subtitle: 'Affordable Plans for Young Minds',
    description: 'Exclusive discounts for students. Get more data at less price with valid student ID.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    stats: [
      { label: 'Discount', value: '30%' },
      { label: 'Validity', value: '90 Days' },
    ],
    badge: 'STUDENT OFFER',
    icon: Award,
  },
  {
    id: 5,
    title: 'Gaming Booster Plans',
    subtitle: 'Low Latency, High Performance',
    description: 'Specially optimized for gamers. Ultra-low ping and dedicated bandwidth for seamless gaming.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    gradient: 'from-red-500 via-pink-500 to-rose-500',
    stats: [
      { label: 'Ping', value: '<10ms' },
      { label: 'Speed', value: '150Mbps' },
    ],
    badge: 'GAMERS CHOICE',
    icon: Zap,
  },
];

const Home = () => {
  const {
    plans,
    fetchPlans,
    addRecharge,
    rechargeHistory,
    setSelectedOperator: setContextSelectedOperator,
    setRechargeAmount,
    fetchHistory,
  } = useApp();

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [completedOperator, setCompletedOperator] = useState(null);
  const [completedPlan, setCompletedPlan] = useState(null);
  const [lastTransactionId, setLastTransactionId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const location = useLocation();

  // Auto-rotate promotional banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const operatorId = params.get('operator');

    if (!operatorId) return;

    const normalizedOperator = operatorId.toLowerCase() === 'vodafone' ? 'vi' : operatorId.toLowerCase();
    const matchedOperator = operators.find((item) => item.id === normalizedOperator);

    if (matchedOperator) {
      setSelectedOperator(matchedOperator);
      setSelectedPlan(null);
      setCurrentStep(2);
      setContextSelectedOperator(matchedOperator);
      setRechargeAmount(0);
    }
  }, [location.search, setContextSelectedOperator, setRechargeAmount]);

  const normalizedSelectedId = selectedOperator?.id === 'vodafone' ? 'vi' : selectedOperator?.id;

  const filteredPlans = selectedOperator
    ? plans.filter((plan) => plan.operator?.toLowerCase() === normalizedSelectedId)
    : plans;

  const handleOperatorSelect = (operator) => {
    setSelectedOperator(operator);
    setSelectedPlan(null);
    setCurrentStep(2);
    setContextSelectedOperator(operator);
    setRechargeAmount(0);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setCurrentStep(3);
    setRechargeAmount(plan.price);
  };

  const handleRechargeSubmit = async (paymentDetails) => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      toast.error('Please log in to complete your recharge.');
      navigate('/login');
      return;
    }

    if (!selectedOperator || !selectedPlan) {
      toast.error('Please choose an operator and plan first.');
      return;
    }

    const payload = {
      operator: {
        name: selectedOperator.name,
        logo: selectedOperator.logo,
      },
      mobileNumber: paymentDetails.mobileNumber,
      amount: selectedPlan.price,
      paymentMethod: paymentDetails.paymentMethod,
      transactionId: paymentDetails.transactionId,
      plan: {
        validity: selectedPlan.validity,
        data: selectedPlan.data,
        calls: selectedPlan.calls,
        features: selectedPlan.features || [],
      },
    };

    const result = await addRecharge(payload);

    if (!result?.success) {
      toast.error(result?.message || 'Recharge failed. Please try again.');
      return;
    }

    setCompletedOperator(selectedOperator);
    setCompletedPlan(selectedPlan);
    setLastTransactionId(paymentDetails.transactionId);

    toast.success('Recharge successful!');
    setShowSuccessModal(true);
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 4000);

    setCurrentStep(1);
    setSelectedOperator(null);
    setSelectedPlan(null);
    setContextSelectedOperator('');
    setRechargeAmount(0);
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060f] via-[#0b1021] to-[#0c132f] text-slate-100">
      <Toaster position="bottom-right" />
      {isConfettiActive && viewportSize.width > 0 && viewportSize.height > 0 && (
        <Confetti
          width={viewportSize.width}
          height={viewportSize.height}
          numberOfPieces={220}
          recycle={false}
        />
      )}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-cyan-500/10 to-purple-700/30 blur-3xl" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.25),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,0,128,0.2),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(0,128,255,0.25),transparent_25%)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white drop-shadow-[0_4px_30px_rgba(0,255,255,0.45)]"
          >
            Recharge smarter with <span className="gradient-text">RechargePRO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12"
          >
            One-tap mobile recharges, curated plans, and instant confirmation across every leading network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10"
          >
            {[Smartphone, Zap, CreditCard].map((Icon, index) => {
              const stepNumber = index + 1;
              const labels = ['Choose Operator', 'Pick a Plan', 'Pay Securely'];

              return (
                <div key={labels[index]} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,255,255,0.25)] ring-1 ring-cyan-400/30 transition-all ${currentStep > stepNumber
                        ? 'bg-gradient-to-br from-emerald-500 to-cyan-400 text-slate-900'
                        : currentStep === stepNumber
                          ? 'bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white'
                          : 'bg-slate-900/70 text-slate-500'
                        }`}
                    >
                      {currentStep > stepNumber ? '✓' : <Icon size={26} />}
                    </motion.div>
                    <span
                      className={`mt-3 text-sm font-semibold ${currentStep >= stepNumber ? 'text-cyan-300' : 'text-slate-500'
                        }`}
                    >
                      {labels[index]}
                    </span>
                  </div>
                  {stepNumber < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > stepNumber ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 origin-left rounded-full hidden md:block"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Professional Promotional Banner Carousel */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              {promoBanners.map((banner, index) => {
                if (index !== currentSlide) return null;
                const IconComponent = banner.icon;

                return (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className={`relative bg-gradient-to-r ${banner.gradient} rounded-3xl overflow-hidden`}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Content Section */}
                      <div className="flex-1 p-8 lg:p-12 relative z-10">
                        {/* Badge */}
                        <motion.span
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold text-white mb-4"
                        >
                          <IconComponent className="w-4 h-4" />
                          {banner.badge}
                        </motion.span>

                        {/* Title */}
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl lg:text-4xl font-bold text-white mb-3"
                        >
                          {banner.title}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-xl text-white/90 font-semibold mb-3"
                        >
                          {banner.subtitle}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-white/75 mb-6 max-w-md"
                        >
                          {banner.description}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex gap-6"
                        >
                          {banner.stats.map((stat, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                              <div className="text-2xl font-bold text-white">{stat.value}</div>
                              <div className="text-sm text-white/70">{stat.label}</div>
                            </div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Image Section */}
                      <div className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 z-10 lg:bg-gradient-to-l lg:from-black/30" />
                        <motion.img
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.7 }}
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Floating elements */}
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center z-20"
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Banner Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {promoBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentSlide
                  ? 'w-10 h-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500'
                  : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                  }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-[0_4px_30px_rgba(0,255,255,0.35)]">Choose your network</h2>
                <p className="text-lg text-slate-300">
                  Pick your operator to see curated plan recommendations.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08 },
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {operators.map((operator) => (
                  <motion.div
                    key={operator.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <OperatorCard
                      operator={operator}
                      isSelected={selectedOperator?.id === operator.id}
                      onSelect={handleOperatorSelect}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
              >
                <div>
                  <h2 className="text-4xl font-bold gradient-text mb-2">Choose your plan</h2>
                  <p className="text-lg text-slate-300">
                    Tailored options for {selectedOperator?.name}.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentStep(1);
                    setSelectedPlan(null);
                    setSelectedOperator(null);
                    setContextSelectedOperator('');
                    setRechargeAmount(0);
                  }}
                  className="self-start md:self-center bg-slate-900/70 border border-cyan-500/30 px-5 py-2 rounded-xl shadow-lg text-sm font-medium text-cyan-100 hover:bg-slate-800/80"
                >
                  ← Change operator
                </motion.button>
              </motion.div>

              {filteredPlans.length === 0 ? (
                <div className="bg-slate-900/60 border border-cyan-500/20 rounded-3xl shadow-2xl p-10 text-center">
                  <p className="text-lg text-slate-300">
                    No plans available for this operator yet. Please try another network.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredPlans.map((plan) => (
                    <motion.div
                      key={plan._id || plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PlanCard
                        plan={plan}
                        onSelect={() => handlePlanSelect(plan)}
                        isSelected={(selectedPlan?._id || selectedPlan?.id) === (plan._id || plan.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left gap-6 mb-12"
              >
                <div className="w-full">
                  <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_4px_30px_rgba(0,255,255,0.35)]">Complete your recharge</h2>
                  <p className="text-lg text-slate-300">
                    Secure payment with instant confirmation.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Your payment is protected with multi-factor authentication and bank-grade encryption.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-900/70 border border-cyan-500/40 text-cyan-100 px-6 py-3 rounded-xl hover:bg-slate-800/80 transition-colors shadow-lg"
                >
                  ← Back to plans
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <RechargeForm onSubmit={handleRechargeSubmit} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <Modal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              setCompletedOperator(null);
              setCompletedPlan(null);
              setLastTransactionId('');
            }}
            size="lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative overflow-hidden text-center py-10 px-8 bg-gradient-to-br from-slate-900 via-slate-950 to-[#0c132f] rounded-3xl border border-cyan-500/30 shadow-[0_0_55px_rgba(0,255,255,0.18)]"
            >
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.25),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,0,128,0.22),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(52,211,153,0.25),transparent_25%)]" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 20 }}
                className="relative w-28 h-28 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(52,211,153,0.5)]"
              >
                {/* Rocket float upward */}
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [-40, -10], opacity: 1 }}
                  transition={{ delay: 0.2, duration: 2, ease: 'easeInOut' }}
                  className="relative"
                >
                  <Rocket className="w-12 h-12 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
                </motion.div>

                {/* Pulsing glow orbits */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.6, 0] }}
                  transition={{ delay: 0.25, duration: 1.8, repeat: Infinity, repeatDelay: 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-300/40"
                />

                {/* Inner shimmer glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ delay: 0.3, duration: 2, repeat: Infinity, repeatDelay: 0.4 }}
                  className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-300/30 via-emerald-300/20 to-fuchsia-300/30 blur-lg"
                />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-3xl font-extrabold mb-2 text-white drop-shadow-[0_4px_30px_rgba(0,255,255,0.25)]"
              >
                Recharge confirmed
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="text-slate-300 mb-6"
              >
                Instant activation in under 2 minutes. A receipt has been generated below.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative bg-slate-900/80 border border-cyan-500/25 rounded-2xl p-5 text-left shadow-[0_0_35px_rgba(0,255,255,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2">
                      <img
                        src={completedOperator?.logo}
                        alt={`${completedOperator?.name ?? 'Operator'} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Operator</div>
                      <div className="text-lg font-bold text-white">{completedOperator?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Amount</div>
                    <div className="text-2xl font-extrabold text-emerald-300">₹{completedPlan?.price}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
                  <div>
                    <div className="text-slate-500">Validity</div>
                    <div className="text-slate-100 font-semibold">{completedPlan?.validity}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Data</div>
                    <div className="text-slate-100 font-semibold">{completedPlan?.data}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Calls</div>
                    <div className="text-slate-100 font-semibold">{completedPlan?.calls ?? 'Unlimited'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Txn ID</div>
                    <div className="text-slate-100 font-mono text-xs">{lastTransactionId || 'Processing...'}</div>
                  </div>
                </div>

                {completedPlan?.features?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {completedPlan.features.map((feature, idx) => (
                      <span
                        key={`${feature}-${idx}`}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-200 border border-cyan-400/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-300"
              >
                <div className="flex items-center gap-2 bg-slate-900/70 border border-emerald-400/25 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
                  <span className="text-emerald-300">●</span>
                  <span>Bank-grade encryption</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/70 border border-cyan-400/25 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <span className="text-cyan-300">⚡</span>
                  <span>Instant confirmation</span>
                </div>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {rechargeHistory.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-slate-900/70 border border-cyan-500/20 rounded-3xl shadow-[0_0_40px_rgba(0,255,255,0.12)] p-8">
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_4px_30px_rgba(0,255,255,0.35)]">Recent recharges</h3>
            <div className="space-y-4">
              {rechargeHistory.slice(0, 3).map((recharge) => {
                const timestamp = recharge.createdAt || recharge.timestamp;

                return (
                  <div
                    key={recharge._id || recharge.id}
                    className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700 rounded-2xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-900/80 rounded-2xl flex items-center justify-center p-2 border border-slate-700">
                        <img
                          src={recharge.operator?.logo}
                          alt={`${recharge.operator?.name ?? 'Operator'} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{recharge.operator?.name}</div>
                        <div className="text-sm text-slate-400">{recharge.mobileNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{recharge.amount}</div>
                      <div className="text-xs text-slate-500">
                        {timestamp ? new Date(timestamp).toLocaleDateString() : 'Just now'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;