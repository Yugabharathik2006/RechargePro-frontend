import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OperatorCard from '../components/OperatorCard';
import PlanCard from '../components/PlanCard';
import RechargeForm from '../components/RechargeForm';
import Modal from '../components/Modal';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { Smartphone, CreditCard, History, Zap } from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const { theme, selectedOperator, setSelectedOperator, rechargeAmount, setRechargeAmount } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Handle navigation from RechargePlans page
  useEffect(() => {
    if (location.state?.step && location.state?.selectedPlan) {
      setCurrentStep(location.state.step);
      setSelectedPlan(location.state.selectedPlan);
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const operators = [
    { id: 1, name: 'Airtel', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Airtel-Logo.png', description: 'India\'s fastest 5G network' },
    { id: 2, name: 'Jio', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Jio-Logo.png', description: 'Digital India ka network' },
    { id: 3, name: 'Vi', logo: '/src/assets/vodafone-logo.svg', description: 'Be unlimited with Vi' },
    { id: 4, name: 'BSNL', logo: '/src/assets/bsnl-logo.svg', description: 'Connecting India since 1854' }
  ];

  const getPlansForOperator = (operatorName) => {
    const plansByOperator = {
      'Airtel': [
        {
          id: 'air1',
          price: 179,
          validity: '28 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Essential',
          features: ['National Roaming', 'Airtel Thanks Benefits', 'Wynk Music Free']
        },
        {
          id: 'air2',
          price: 299,
          validity: '28 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: true,
          category: 'Popular',
          features: ['National Roaming', 'Disney+ Hotstar Mobile', 'Wynk Music Premium', 'Airtel Xstream Premium']
        },
        {
          id: 'air3',
          price: 549,
          validity: '56 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Long Term',
          features: ['National Roaming', 'Disney+ Hotstar Mobile', 'Amazon Prime Video Mobile', 'Wynk Music Premium']
        },
        {
          id: 'air4',
          price: 719,
          validity: '84 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Value Pack',
          features: ['National Roaming', 'Netflix Mobile', 'Disney+ Hotstar Mobile', 'Airtel Thanks Gold']
        }
      ],
      'Jio': [
        {
          id: 'jio1',
          price: 149,
          validity: '20 Days',
          data: '1 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Starter',
          features: ['JioTV', 'JioCinema', 'JioSaavn Pro', 'JioCloud 50GB']
        },
        {
          id: 'jio2',
          price: 239,
          validity: '28 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: true,
          category: 'Most Popular',
          features: ['JioTV Premium', 'JioCinema Premium', 'JioSaavn Pro', 'Disney+ Hotstar Mobile']
        },
        {
          id: 'jio3',
          price: 399,
          validity: '56 Days',
          data: '2.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Data Booster',
          features: ['JioTV Premium', 'Netflix Mobile', 'Amazon Prime Video Mobile', 'JioCloud 100GB']
        },
        {
          id: 'jio4',
          price: 666,
          validity: '84 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Annual Saver',
          features: ['All Jio Apps Premium', 'Disney+ Hotstar Super', 'Netflix Mobile', 'JioFiber Discount']
        }
      ],
      'Vi': [
        {
          id: 'vi1',
          price: 179,
          validity: '24 Days',
          data: '1 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Basic',
          features: ['Vi Movies & TV', 'Weekend Data Rollover', 'Vi App Benefits']
        },
        {
          id: 'vi2',
          price: 299,
          validity: '28 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: true,
          category: 'RedX Premium',
          features: ['Disney+ Hotstar Mobile', 'Vi Movies & TV Premium', 'Weekend Data Rollover', 'Priority Network']
        },
        {
          id: 'vi3',
          price: 479,
          validity: '56 Days',
          data: '1.5 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Long Validity',
          features: ['Netflix Mobile', 'Amazon Prime Video Mobile', 'Vi Movies & TV Premium', 'Data Rollover']
        },
        {
          id: 'vi4',
          price: 719,
          validity: '84 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Hero Unlimited',
          features: ['All OTT Benefits', 'Priority Customer Care', 'Weekend Data Rollover', 'Vi Premium Services']
        }
      ],
      'BSNL': [
        {
          id: 'bsnl1',
          price: 107,
          validity: '25 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Budget Best',
          features: ['BSNL Tunes', 'Location Based Services', 'BSNL Mail']
        },
        {
          id: 'bsnl2',
          price: 187,
          validity: '28 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: true,
          category: 'Value Champion',
          features: ['BSNL Tunes Premium', 'Eros Now', 'Location Services', 'BSNL WiFi Access']
        },
        {
          id: 'bsnl3',
          price: 319,
          validity: '54 Days',
          data: '3 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Data Rich',
          features: ['Eros Now Premium', 'BSNL WiFi Unlimited', 'Premium Customer Care', 'Data Rollover']
        },
        {
          id: 'bsnl4',
          price: 797,
          validity: '160 Days',
          data: '2 GB/Day',
          calls: 'Unlimited',
          sms: '100/Day',
          popular: false,
          category: 'Long Term Saver',
          features: ['All BSNL Services', 'Eros Now Annual', 'Priority Network', 'BSNL Broadband Discount']
        }
      ]
    };
    return plansByOperator[operatorName] || [];
  };

  const plans = selectedOperator ? getPlansForOperator(selectedOperator.name) : [];

  const handleOperatorSelect = (operator) => {
    setSelectedOperator(operator);
    setCurrentStep(2);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setRechargeAmount(plan.price);
    setCurrentStep(3);
  };

  const handleRechargeSubmit = (rechargeData) => {
    // Add to recharge history
    const newRecharge = {
      id: Date.now(),
      ...rechargeData,
      plan: selectedPlan,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setRechargeHistory(prev => [newRecharge, ...prev]);
    
    toast.success('🎉 Recharge Successful!', {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
        padding: '16px'
      }
    });
    
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setCurrentStep(1);
      setSelectedOperator('');
      setSelectedPlan(null);
      setRechargeAmount(0);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster />
      {showSuccessModal && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Instant Mobile</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recharge
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Experience lightning-fast recharges with exclusive offers and instant processing
          </motion.p>

          {/* Progress Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center space-x-4 mb-12"
          >
            {[
              { step: 1, label: 'Choose Operator', icon: Smartphone },
              { step: 2, label: 'Select Plan', icon: Zap },
              { step: 3, label: 'Complete Payment', icon: CreditCard }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl' 
                        : 'bg-white text-gray-400 shadow-lg'
                    }`}
                  >
                    {currentStep > step ? '✓' : <Icon size={24} />}
                  </motion.div>
                  <span className={`mt-3 text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
                {step < 3 && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep > step ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-1 mx-4 rounded-full ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`} 
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        
        <AnimatePresence mode="wait">
          {/* Step 1: Operator Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold gradient-text mb-4">Choose Your Network</h2>
                <p className="text-xl text-gray-600">Select your mobile operator to continue</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {operators.map((operator, index) => (
                  <motion.div
                    key={operator.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
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

          {/* Step 2: Plan Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-12"
              >
                <div>
                  <h2 className="text-4xl font-bold gradient-text mb-2">Choose Your Plan</h2>
                  <p className="text-xl text-gray-600">Select the perfect plan for {selectedOperator?.name}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  ← Back
                </motion.button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <PlanCard plan={plan} onSelect={handlePlanSelect} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Recharge Form */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-12"
              >
                <div>
                  <h2 className="text-4xl font-bold gradient-text mb-2">Complete Your Recharge</h2>
                  <p className="text-xl text-gray-600">Enter your details to proceed</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  ← Back
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Recharge Successful!"
        size="lg"
      >
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl animate-bounce">✅</div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h3>
          <div className="bg-green-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="text-gray-600">Operator:</span>
                <div className="font-bold text-gray-800">{selectedOperator?.name}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-600">Amount:</span>
                <div className="font-bold text-green-600 text-xl">₹{selectedPlan?.price}</div>
              </div>
              <div className="text-left">
                <span className="text-gray-600">Validity:</span>
                <div className="font-bold text-gray-800">{selectedPlan?.validity}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-600">Data:</span>
                <div className="font-bold text-gray-800">{selectedPlan?.data}</div>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Your recharge will be activated within 2-3 minutes
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>🔒</span>
            <span>Transaction ID: TXN{Date.now().toString().slice(-8)}</span>
          </div>
        </div>
      </Modal>

      {/* Recent Recharges */}
      {rechargeHistory.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold gradient-text mb-6">Recent Recharges</h3>
            <div className="space-y-4">
              {rechargeHistory.slice(0, 3).map((recharge) => (
                <div key={recharge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2">
                      <img 
                        src={recharge.operator.logo} 
                        alt={`${recharge.operator.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{recharge.operator.name}</div>
                      <div className="text-sm text-gray-600">{recharge.mobileNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">₹{recharge.amount}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(recharge.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;