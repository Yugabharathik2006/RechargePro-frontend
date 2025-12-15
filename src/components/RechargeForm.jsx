import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react';

const RechargeForm = ({ onSubmit }) => {
  const { theme, selectedOperator, rechargeAmount, isProcessingPayment, setIsProcessingPayment } = useApp();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const validateMobileNumber = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    setIsValidNumber(value.length === 0 || validateMobileNumber(value));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateMobileNumber(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (paymentMethod === 'upi' && !upiId) {
      newErrors.upiId = 'Please enter your UPI ID';
    }
    
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!expiryDate) {
        newErrors.expiryDate = 'Please enter expiry date';
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'Please enter valid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedOperator || !rechargeAmount) {
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onSubmit({
        mobileNumber,
        operator: selectedOperator,
        amount: rechargeAmount,
        paymentMethod,
        transactionId: `TXN${Date.now().toString().slice(-8)}`
      });
      setIsProcessingPayment(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-2xl p-8"
    >
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4"
        >
          <CreditCard className="text-white" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Complete Payment</h2>
        <p className="text-gray-600">Secure and instant processing</p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={handleNumberChange}
            placeholder="Enter 10-digit mobile number"
            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg font-medium ${
              !isValidNumber 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 bg-white'
            } focus:outline-none`}
            maxLength="10"
          />
          {!isValidNumber && mobileNumber.length > 0 && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <span>⚠️</span>
              <span>Please enter a valid 10-digit mobile number</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Selected Operator
          </label>
          <div className="p-6 rounded-2xl border-2 border-gray-200 bg-gray-50">
            {selectedOperator ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2">
                    <img 
                      src={selectedOperator.logo} 
                      alt={`${selectedOperator.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{selectedOperator.name}</div>
                    <div className="text-sm text-gray-600">{selectedOperator.description}</div>
                  </div>
                </div>
                <div className="text-green-500 text-2xl">✓</div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <span className="text-4xl mb-2 block">📱</span>
                <span>No operator selected</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Recharge Amount
          </label>
          <div className={`p-6 rounded-2xl border-2 ${
            rechargeAmount ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  rechargeAmount ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'
                }`}>
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <div className="font-bold text-2xl text-gray-800">
                    {rechargeAmount ? `₹${rechargeAmount}` : '₹0'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {rechargeAmount ? 'Plan selected' : 'No plan selected'}
                  </div>
                </div>
              </div>
              {rechargeAmount && (
                <div className="text-green-500 text-2xl">✓</div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                paymentMethod === 'upi'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold text-sm">UPI</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold text-sm">Card</div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === 'upi' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                errors.upiId ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 bg-white'
              } focus:outline-none`}
            />
            {errors.upiId && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <span>⚠️</span>
                <span>{errors.upiId}</span>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                  errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 bg-white'
                } focus:outline-none`}
              />
              {errors.cardNumber && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <span>⚠️</span>
                  <span>{errors.cardNumber}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setExpiryDate(value);
                  }}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    errors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 bg-white'
                  } focus:outline-none`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 bg-white'
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 p-6 rounded-2xl border border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <Shield className="text-white" size={16} />
            </motion.div>
            <span className="font-semibold text-blue-700">Secure Payment</span>
          </div>
          <p className="text-sm text-blue-600">
            Your payment is protected by 256-bit SSL encryption and processed instantly.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!isValidNumber || !mobileNumber || !selectedOperator || !rechargeAmount || isProcessingPayment}
          className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-green-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        >
          {isProcessingPayment ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-3"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Processing Payment...</span>
            </motion.div>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Pay ₹{rechargeAmount || 0} →
            </motion.span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RechargeForm;