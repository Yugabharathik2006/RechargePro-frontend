import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlanCard from '../components/PlanCard';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { Filter, Search, RefreshCw, Phone, MessageCircle, Gift, Zap, Shield, Clock, Percent, Star } from 'lucide-react';

// Promotional Slides Data (swapped from Home page)
const promoSlides = [
  {
    id: 1,
    title: '🎁 First Recharge Bonus!',
    subtitle: 'Get ₹50 cashback on your first recharge above ₹199',
    description: 'New users get instant cashback credited to their wallet',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: Gift,
    badge: 'NEW USER',
  },
  {
    id: 2,
    title: '⚡ Lightning Fast Recharge',
    subtitle: 'Instant activation within seconds',
    description: 'No waiting, no delays - your recharge is processed instantly 24/7',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    icon: Zap,
    badge: 'INSTANT',
  },
  {
    id: 3,
    title: '🔒 100% Secure Payments',
    subtitle: 'Bank-grade encryption for all transactions',
    description: 'Your payment details are protected with advanced security protocols',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    icon: Shield,
    badge: 'SECURE',
  },
  {
    id: 4,
    title: '💰 Best Price Guarantee',
    subtitle: 'Lowest prices across all operators',
    description: 'We match any lower price - save more on every recharge!',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    icon: Percent,
    badge: 'SAVINGS',
  },
  {
    id: 5,
    title: '⏰ 24/7 Customer Support',
    subtitle: 'Always here when you need us',
    description: 'Round-the-clock support via chat, email, and phone',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    icon: Clock,
    badge: 'SUPPORT',
  },
  {
    id: 6,
    title: '⭐ Exclusive Member Rewards',
    subtitle: 'Earn points on every transaction',
    description: 'Redeem points for free recharges, discounts & premium benefits',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    icon: Star,
    badge: 'REWARDS',
  },
];

const RechargePlans = () => {
  const navigate = useNavigate();
  const { setSelectedOperator, setRechargeAmount, plans, fetchPlans, isLoadingPlans, plansError } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOperatorFilter, setSelectedOperatorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  // Auto-rotate promo slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const categories = [
    { id: 'all', name: 'All Plans', icon: '📱', description: 'View all available plans' },
    { id: 'popular', name: 'Popular', icon: '🔥', description: 'Most chosen plans' },
    { id: 'data', name: 'Data Heavy', icon: '📶', description: '2GB+ daily data' },
    { id: 'validity', name: 'Long Validity', icon: '⏰', description: '56+ days validity' }
  ];

  const operators = [
    { id: 'all', name: 'All Operators', icon: '🌐' },
    { id: 'airtel', name: 'Airtel', icon: '🔴' },
    { id: 'jio', name: 'Jio', icon: '🔵' },
    { id: 'vi', name: 'Vi', icon: '🟣' },
    { id: 'bsnl', name: 'BSNL', icon: '🟡' }
  ];

  const filteredPlans = plans.filter(plan => {
    // Category filter
    const categoryMatch = selectedCategory === 'all' ||
      (selectedCategory === 'popular' && plan.popular) ||
      (selectedCategory === 'data' && parseFloat(plan.data) >= 2) ||
      (selectedCategory === 'validity' && parseInt(plan.validity) >= 56);

    // Operator filter
    const operatorMatch = selectedOperatorFilter === 'all' || plan.operator.toLowerCase() === selectedOperatorFilter.toLowerCase();

    // Search filter
    const searchMatch = searchTerm === '' ||
      plan.price.toString().includes(searchTerm) ||
      plan.validity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.operator.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && operatorMatch && searchMatch;
  });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'validity':
        return parseInt(a.validity) - parseInt(b.validity);
      case 'data':
        return parseFloat(b.data) - parseFloat(a.data);
      default:
        return 0;
    }
  });

  const handlePlanSelect = (plan) => {
    // Set operator based on plan
    const operatorData = {
      airtel: { id: 1, name: 'Airtel', icon: '🔴', description: "India's fastest 5G network" },
      jio: { id: 2, name: 'Jio', icon: '🔵', description: 'Digital India ka network' },
      vi: { id: 3, name: 'Vi', icon: '🟣', description: 'Be unlimited with Vi' },
      bsnl: { id: 4, name: 'BSNL', icon: '🟡', description: 'Connecting India since 1854' }
    };

    setSelectedOperator(operatorData[plan.operator]);
    setRechargeAmount(plan.price);

    toast.success(`Selected ${plan.operator.toUpperCase()} ₹${plan.price} plan!`, {
      duration: 2000,
      position: 'top-center',
    });

    // Navigate to home page with step 3 (payment)
    navigate('/home', { state: { step: 3, selectedPlan: plan } });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedOperatorFilter('all');
    setSearchTerm('');
    setSortBy('price');
    toast.success('Filters reset successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060f] via-[#0b1021] to-[#0c132f] pt-24 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-[0_4px_30px_rgba(255,0,128,0.35)]">
            <span className="text-white">Recharge </span>
            <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose from our wide range of prepaid plans with the best offers and benefits
          </p>
        </motion.div>

        {/* Promotional Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              {promoSlides.map((slide, index) => {
                if (index !== currentSlide) return null;
                const IconComponent = slide.icon;

                return (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={`relative bg-gradient-to-r ${slide.gradient} p-1 rounded-3xl`}
                  >
                    {/* Inner card with glassmorphism */}
                    <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-6 md:p-8 overflow-hidden">
                      {/* Background decorations */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                      <div className="relative flex flex-col md:flex-row items-center gap-6">
                        {/* Icon */}
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-2xl`}
                        >
                          <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          {/* Badge */}
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${slide.gradient} text-white mb-3`}
                          >
                            {slide.badge}
                          </motion.span>

                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {slide.title}
                          </h3>
                          <p className="text-lg md:text-xl font-semibold text-cyan-300 mb-2">
                            {slide.subtitle}
                          </p>
                          <p className="text-sm md:text-base text-slate-400">
                            {slide.description}
                          </p>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-shrink-0 px-6 py-3 bg-gradient-to-r ${slide.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
                        >
                          Learn More →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {promoSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentSlide
                  ? 'w-8 h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500'
                  : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                  }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Search and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl shadow-[0_0_35px_rgba(0,255,255,0.15)] p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300" size={20} />
              <input
                type="text"
                placeholder="Search by price, validity, data, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-cyan-500/30 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-950/60 border border-cyan-500/30 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="validity">Validity</option>
                <option value="data">Data Amount</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="p-3 bg-slate-900/70 text-cyan-100 rounded-xl border border-cyan-500/30 hover:bg-slate-800/70 transition-colors shadow-lg"
              >
                <RefreshCw size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/70 border border-fuchsia-500/25 rounded-2xl shadow-[0_0_35px_rgba(255,0,128,0.15)] p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8">

            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Filter size={20} className="text-cyan-300" />
                <h3 className="text-lg font-semibold text-slate-100">Plan Category</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white shadow-lg'
                      : 'bg-slate-800/70 text-slate-200 hover:bg-slate-800'
                      }`}
                  >
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <p className={`text-xs ${selectedCategory === category.id ? 'text-white/80' : 'text-slate-400'
                      }`}>
                      {category.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Operator Filter */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Operator</h3>
              <div className="grid grid-cols-2 gap-3">
                {operators.map((operator) => (
                  <motion.button
                    key={operator.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOperatorFilter(operator.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${selectedOperatorFilter === operator.id
                      ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white shadow-lg'
                      : 'bg-slate-800/70 text-slate-200 hover:bg-slate-800'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{operator.icon}</span>
                      <span className="font-semibold">{operator.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-slate-300 text-lg">
            Showing <span className="font-bold text-cyan-300">{sortedPlans.length}</span> plans
            {selectedOperatorFilter !== 'all' && (
              <span> for <span className="font-bold capitalize text-fuchsia-400">{selectedOperatorFilter}</span></span>
            )}
            {selectedCategory !== 'all' && (
              <span> in <span className="font-bold text-emerald-400">{categories.find(c => c.id === selectedCategory)?.name}</span> category</span>
            )}
          </p>
        </motion.div>

        {/* Plans Grid */}
        <AnimatePresence>
          {isLoadingPlans ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full mx-auto mb-6"
              />
              <p className="text-2xl text-slate-300 font-semibold">Loading plans...</p>
            </motion.div>
          ) : plansError ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">⚠️</div>
              <h3 className="text-3xl font-bold text-red-400 mb-4">Failed to Load Plans</h3>
              <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                {plansError}
              </p>
              <Button
                onClick={fetchPlans}
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-fuchsia-700 shadow-lg"
              >
                Retry Loading
              </Button>
            </motion.div>
          ) : sortedPlans.length > 0 ? (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
            >
              {sortedPlans.map((plan, index) => (
                <motion.div
                  key={plan._id || plan.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PlanCard
                    plan={plan}
                    onSelect={handlePlanSelect}
                    showOperator={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-slate-300 mb-4">No Plans Found</h3>
              <p className="text-xl text-slate-400 mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms to find the perfect plan
              </p>
              <Button
                onClick={resetFilters}
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-fuchsia-700 shadow-lg"
              >
                Reset All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-fuchsia-700 to-cyan-600 text-white rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(255,0,128,0.25)]"
        >
          <h2 className="text-4xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our experts are available 24/7 to help you find the perfect plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              className="px-8 py-4 rounded-xl font-bold text-cyan-900 bg-white hover:bg-slate-100"
              icon={MessageCircle}
            >
              Live Chat
            </Button>
            <Button
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30"
              icon={Phone}
            >
              Call Support
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RechargePlans;