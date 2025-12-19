import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-load authentication state on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await API.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setIsLoggedIn(true);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error('Login error details:', error);
      let message = 'Login failed';
      if (error.code === 'ERR_NETWORK') {
        message = 'Network error - Please check if the server is running';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/register', userData);

      // Auto login after successful signup
      return await login({ email: userData.email, password: userData.password });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      console.error('Signup error:', message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleData) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/google/token', {
        googleId: googleData.sub,
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
      });

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setIsLoggedIn(true);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Google login failed';
      console.error('Google login error:', message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    isLoggedIn,
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    signup,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};