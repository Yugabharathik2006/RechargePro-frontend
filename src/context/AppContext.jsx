import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

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
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [historyError, setHistoryError] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    setPlansError(null);
    try {
      const response = await API.get('/plans');
      const data = response.data;

      if (Array.isArray(data) && data.length === 0) {
        // Auto-seed if empty
        try {
          await API.post('/plans/seed');
          const seededResponse = await API.get('/plans');
          setPlans(seededResponse.data);
        } catch (seedError) {
          console.warn('Failed to seed plans:', seedError);
          setPlans([]);
        }
      } else if (Array.isArray(data)) {
        setPlans(data);
      } else if (data.data && Array.isArray(data.data)) {
        setPlans(data.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch plans';
      console.error('Fetch plans error:', message);
      setPlansError(message);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addRecharge = async (rechargeData) => {
    try {
      setIsProcessingPayment(true);
      const response = await API.post('/transactions', rechargeData);
      const data = response.data;

      setRechargeHistory(prev => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Recharge failed';
      console.error('Recharge error:', message);
      return { success: false, message };
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const response = await API.get('/transactions');
      const data = response.data;

      if (Array.isArray(data)) {
        setRechargeHistory(data);
      } else if (data.data && Array.isArray(data.data)) {
        setRechargeHistory(data.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch history';
      console.error('Fetch history error:', message);
      setHistoryError(message);
    } finally {
      setIsLoadingHistory(false);
    }
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
    fetchHistory,
    plans,
    fetchPlans,
    clearRechargeData,
    isProcessingPayment,
    setIsProcessingPayment,
    isLoadingPlans,
    isLoadingHistory,
    plansError,
    historyError,
  };

  return (
    <AppContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};