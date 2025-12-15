import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addRecharge = (rechargeData) => {
    const newRecharge = {
      id: Date.now(),
      ...rechargeData,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setRechargeHistory(prev => [newRecharge, ...prev]);
    return newRecharge;
  };

  const clearRechargeData = () => {
    setSelectedOperator('');
    setRechargeAmount(0);
  };

  const value = {
    theme,
    toggleTheme,
    user,
    login,
    logout,
    selectedOperator,
    setSelectedOperator,
    rechargeAmount,
    setRechargeAmount,
    rechargeHistory,
    setRechargeHistory,
    addRecharge,
    clearRechargeData,
    isProcessingPayment,
    setIsProcessingPayment
  };

  return (
    <AppContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};