import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const OperatorCard = ({ operator, isSelected, onSelect }) => {
  const { theme } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`p-8 rounded-3xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl' 
          : 'bg-white text-gray-800 hover:bg-gray-50 shadow-xl'
      }`}
      onClick={() => onSelect(operator)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {isSelected && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">✓</span>
        </div>
      )}

      <div className="text-center">
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <img 
            src={operator.logo} 
            alt={`${operator.name} logo`}
            className="w-full h-full object-contain"
          />
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-3"
        >
          {operator.name}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}
        >
          {operator.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default OperatorCard;