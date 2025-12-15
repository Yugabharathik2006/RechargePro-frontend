import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlanCard from '../components/PlanCard';
import toast from 'react-hot-toast';
import { Filter, Search, RefreshCw, Phone, MessageCircle } from 'lucide-react';

const RechargePlans = () => {
  const navigate = useNavigate();
  const { setSelectedOperator, setRechargeAmount } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOperatorFilter, setSelectedOperatorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');

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

  const allPlans = [
    {
      id: 1,
      price: 299,
      validity: '28 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      popular: true,
      operator: 'airtel',
      category: 'popular',
      features: ['Free Roaming', 'Disney+ Hotstar Mobile', 'Wynk Music Premium'],
      description: 'Perfect for daily usage with entertainment benefits'
    },
    {
      id: 2,
      price: 719,
      validity: '84 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'airtel',
      category: 'validity',
      features: ['Free Roaming', 'Netflix Mobile', 'Amazon Prime Video'],
      description: 'Long validity plan with premium OTT benefits'
    },
    {
      id: 3,
      price: 199,
      validity: '18 Days',
      data: '2 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'jio',
      category: 'data',
      features: ['Free Roaming', 'JioTV', 'JioCinema'],
      description: 'High data plan for heavy internet users'
    },
    {
      id: 4,
      price: 259,
      validity: '30 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      popular: true,
      operator: 'jio',
      category: 'popular',
      features: ['Free Roaming', 'JioTV', 'JioCinema', 'JioSaavn'],
      description: 'Most popular monthly plan with Jio apps'
    },
    {
      id: 5,
      price: 666,
      validity: '84 Days',
      data: '1.5 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'jio',
      category: 'validity',
      features: ['Free Roaming', 'Netflix Mobile', 'Disney+ Hotstar'],
      description: 'Extended validity with premium entertainment'
    },
    {
      id: 6,
      price: 309,
      validity: '28 Days',
      data: '2 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'vi',
      category: 'data',
      features: ['Free Roaming', 'Vi Movies & TV', 'Weekend Data Rollover'],
      description: 'High-speed data with weekend rollover benefits'
    },
    {
      id: 7,
      price: 449,
      validity: '56 Days',
      data: '2 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'vi',
      category: 'validity',
      features: ['Free Roaming', 'Netflix Mobile', 'Amazon Prime Video'],
      description: 'Perfect balance of data and validity'
    },
    {
      id: 8,
      price: 197,
      validity: '18 Days',
      data: '2 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      popular: true,
      operator: 'bsnl',
      category: 'popular',
      features: ['Free Roaming', 'BSNL Tunes', 'Location Based Services'],
      description: 'Budget-friendly plan with good data allocation'
    },
    {
      id: 9,
      price: 399,
      validity: '70 Days',
      data: '1 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'bsnl',
      category: 'validity',
      features: ['Free Roaming', 'BSNL Mail', 'Web SMS'],
      description: 'Long validity plan for light data users'
    },
    {
      id: 10,
      price: 599,
      validity: '28 Days',
      data: '3 GB/Day',
      calls: 'Unlimited',
      sms: '100/Day',
      operator: 'airtel',
      category: 'data',
      features: ['Free Roaming', 'Netflix Mobile', 'Disney+ Hotstar', 'Amazon Prime'],
      description: 'Premium data plan with all OTT benefits'
    }
  ];

  const filteredPlans = allPlans.filter(plan => {
    // Category filter
    const categoryMatch = selectedCategory === 'all' || 
      (selectedCategory === 'popular' && plan.popular) ||
      (selectedCategory === 'data' && parseFloat(plan.data) >= 2) ||
      (selectedCategory === 'validity' && parseInt(plan.validity) >= 56);
    
    // Operator filter
    const operatorMatch = selectedOperatorFilter === 'all' || plan.operator === selectedOperatorFilter;
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Recharge Plans</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our wide range of prepaid plans with the best offers and benefits
          </p>
        </motion.div>

        {/* Search and Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by price, validity, data, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
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
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Filter size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Plan Category</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <p className={`text-xs ${
                      selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {category.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Operator Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Operator</h3>
              <div className="grid grid-cols-2 gap-3">
                {operators.map((operator) => (
                  <motion.button
                    key={operator.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOperatorFilter(operator.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedOperatorFilter === operator.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <p className="text-gray-600 text-lg">
            Showing <span className="font-bold text-blue-600">{sortedPlans.length}</span> plans
            {selectedOperatorFilter !== 'all' && (
              <span> for <span className="font-bold capitalize text-purple-600">{selectedOperatorFilter}</span></span>
            )}
            {selectedCategory !== 'all' && (
              <span> in <span className="font-bold text-green-600">{categories.find(c => c.id === selectedCategory)?.name}</span> category</span>
            )}
          </p>
        </motion.div>

        {/* Plans Grid */}
        <AnimatePresence>
          {sortedPlans.length > 0 ? (
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
            >
              {sortedPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
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
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No Plans Found</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms to find the perfect plan
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our experts are available 24/7 to help you find the perfect plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Live Chat</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone size={20} />
              <span>Call Support</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RechargePlans;