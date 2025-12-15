import { motion } from 'framer-motion';
import { Check, Zap, Phone, MessageSquare, Wifi } from 'lucide-react';

const PlanCard = ({ plan, onSelect, isSelected = false, showOperator = false }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
    >
      
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🔥 POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`p-6 ${
        plan.popular 
          ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' 
          : 'bg-gradient-to-br from-gray-600 to-gray-700'
      } text-white relative`}>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold mb-1">₹{plan.price}</div>
            <div className="text-sm opacity-90">{plan.validity}</div>
            {showOperator && plan.operator && (
              <div className="text-xs opacity-75 mt-1 capitalize">
                {plan.operator} Network
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4 mb-6">
          
          {/* Data */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wifi size={16} className="text-white" />
              </div>
              <span className="font-medium text-gray-700">Data</span>
            </div>
            <span className="font-bold text-blue-600">{plan.data}</span>
          </motion.div>
          
          {/* Calls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-3 bg-green-50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </div>
              <span className="font-medium text-gray-700">Calls</span>
            </div>
            <span className="font-bold text-green-600">{plan.calls}</span>
          </motion.div>
          
          {/* SMS */}
          {plan.sms && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">SMS</span>
              </div>
              <span className="font-bold text-purple-600">{plan.sms}</span>
            </motion.div>
          )}
        </div>

        {/* Description */}
        {plan.description && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-4"
          >
            <p className="text-sm text-gray-600 italic">{plan.description}</p>
          </motion.div>
        )}

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Included Benefits:</h4>
            <div className="space-y-2">
              {plan.features.slice(0, 3).map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <Check size={14} className="text-green-500" />
                  <span>{feature}</span>
                </motion.div>
              ))}
              {plan.features.length > 3 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{plan.features.length - 3} more benefits
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Select Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(plan)}
          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
            isSelected
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isSelected ? (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              <Check size={20} />
              <span>Selected</span>
            </motion.div>
          ) : (
            'Select Plan'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlanCard;