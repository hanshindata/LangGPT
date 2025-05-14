import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/me');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 로그인 함수
  const login = async (username, password) => {
    try {
      const response = await api.post('/login', {
        username,
        password,
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      const userResponse = await api.get('/api/me');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 회원가입 함수
  const register = async (username, email, password) => {
    try {
      await api.post('/register', {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};