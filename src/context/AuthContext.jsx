import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('data');
    setUser(null);
  }, []);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        await API.get('/auth');
        const stored = JSON.parse(localStorage.getItem('data') || 'null');
        if (stored) setUser(stored);
        else logout();
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [logout]);

  const login = async (credentials) => {
    const { data } = await API.post('/login', credentials);
    if (data.status) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('data', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (credentials) => {
    const { data } = await API.post('/register', credentials);
    if (data.status) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('data', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
