import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { theme } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative ${sizeClasses[size]} w-full transform transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        <div className={`${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } rounded-xl shadow-2xl overflow-hidden`}>
          
          {title && (
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;