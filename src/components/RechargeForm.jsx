import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Button from './Button';
import { CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  mobileNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').required('Mobile number is required'),
  paymentMethod: yup.string().required(),
  upiId: yup.string().when('paymentMethod', {
    is: 'upi',
    then: (schema) => schema.required('Please enter your UPI ID'),
    otherwise: (schema) => schema.notRequired()
  }),
  cardNumber: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.min(16, 'Please enter a valid card number').required('Card number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  expiryDate: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Please enter expiry date'),
    otherwise: (schema) => schema.notRequired()
  }),
  cvv: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.min(3, 'Please enter valid CVV').required('CVV is required'),
    otherwise: (schema) => schema.notRequired()
  }),
});

const RechargeForm = ({ onSubmit }) => {
  const { theme, selectedOperator, rechargeAmount, isProcessingPayment, setIsProcessingPayment } = useApp();

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentMethod: 'upi',
      mobileNumber: '',
      upiId: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    },
    mode: 'onChange'
  });

  const mobileNumber = watch('mobileNumber');
  const paymentMethod = watch('paymentMethod');

  const onFormSubmit = async (data) => {
    if (!selectedOperator || !rechargeAmount) {
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment processing with a delay, then call onSubmit
    await new Promise(resolve => setTimeout(resolve, 3000));

    await onSubmit({
      mobileNumber: data.mobileNumber,
      operator: selectedOperator,
      amount: rechargeAmount,
      paymentMethod: data.paymentMethod,
      transactionId: `TXN${Date.now().toString().slice(-8)}`
    });

    setIsProcessingPayment(false);
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

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mobile Number
          </label>
          <input
            type="tel"
            {...register('mobileNumber', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }
            })}
            placeholder="Enter 10-digit mobile number"
            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg font-medium placeholder:text-slate-500 ${errors.mobileNumber
              ? 'border-red-500 bg-red-50 text-slate-900'
              : 'border-gray-200 focus:border-blue-500 bg-white text-slate-900'
              } focus:outline-none`}
            maxLength="10"
          />
          {errors.mobileNumber && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <span>⚠️</span>
              <span>{errors.mobileNumber.message}</span>
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
          <div className={`p-6 rounded-2xl border-2 ${rechargeAmount ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rechargeAmount ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'
                  }`}>
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <div className="font-bold text-2xl text-slate-900">
                    {rechargeAmount ? `₹${rechargeAmount}` : '₹0'}
                  </div>
                  <div className="text-sm text-slate-700">
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
              onClick={() => setValue('paymentMethod', 'upi')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'upi'
                ? 'border-blue-500 bg-blue-50 text-slate-900'
                : 'border-gray-200 bg-white hover:border-gray-300 text-slate-900'
                }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold text-sm">UPI</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setValue('paymentMethod', 'card')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50 text-slate-900'
                : 'border-gray-200 bg-white hover:border-gray-300 text-slate-900'
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
              {...register('upiId')}
              placeholder="yourname@upi"
              className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg placeholder:text-slate-500 ${errors.upiId ? 'border-red-500 bg-red-50 text-slate-900' : 'border-gray-200 focus:border-blue-500 bg-white text-slate-900'
                } focus:outline-none`}
            />
            {errors.upiId && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <span>⚠️</span>
                <span>{errors.upiId.message}</span>
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
                {...register('cardNumber', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);
                  }
                })}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg placeholder:text-slate-500 ${errors.cardNumber ? 'border-red-500 bg-red-50 text-slate-900' : 'border-gray-200 focus:border-blue-500 bg-white text-slate-900'
                  } focus:outline-none`}
              />
              {errors.cardNumber && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <span>⚠️</span>
                  <span>{errors.cardNumber.message}</span>
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
                  {...register('expiryDate', {
                    onChange: (e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      e.target.value = value;
                    }
                  })}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 placeholder:text-slate-500 ${errors.expiryDate ? 'border-red-500 bg-red-50 text-slate-900' : 'border-gray-200 focus:border-blue-500 bg-white text-slate-900'
                    } focus:outline-none`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  CVV
                </label>
                <input
                  type="text"
                  {...register('cvv', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    }
                  })}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 placeholder:text-slate-500 ${errors.cvv ? 'border-red-500 bg-red-50 text-slate-900' : 'border-gray-200 focus:border-blue-500 bg-white text-slate-900'
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

        <Button
          type="submit"
          disabled={!isValid || !selectedOperator || !rechargeAmount || isProcessingPayment}
          isLoading={isProcessingPayment}
          className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-xl hover:from-green-600 hover:via-blue-600 hover:to-purple-600 shadow-2xl"
        >
          Pay ₹{rechargeAmount || 0} →
        </Button>
      </form>
    </motion.div>
  );
};

export default RechargeForm;