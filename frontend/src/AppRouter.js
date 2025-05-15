// AppRouter.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import TranslationHistory from './components/TranslationHistory';
import Settings from './components/Settings';
import { AuthContext } from './context/AuthContext';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // 로딩 중일 때 대기 화면
  if (loading) return <div>로딩 중...</div>;
  
  // 인증되지 않았으면 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <TranslationHistory />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter;