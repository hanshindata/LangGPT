import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  // 언어 변경 핸들러
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError(t('errors.password_mismatch', '비밀번호가 일치하지 않습니다.'));
      return;
    }
    
    setLoading(true);
    
    try {
      // 회원가입 API 호출 - API 키 없이 진행
      await api.post('/register', {
        username,
        email,
        password
      });
      
      // 회원가입 성공 후 자동 로그인
      const loginSuccess = await login(username, password);
      
      if (loginSuccess) {
        navigate('/');
      } else {
        // 로그인 실패 시 로그인 페이지로 이동
        navigate('/login', { state: { message: t('auth.register_success', '회원가입이 완료되었습니다. 로그인해주세요.') } });
      }
    } catch (err) {
      // 에러 처리 로직 개선
      let errorMessage = t('errors.register_failed', '회원가입 중 오류가 발생했습니다.');
      
      if (err.response && err.response.data) {
        // 에러가 객체일 경우 문자열로 변환하여 처리
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (detail && typeof detail === 'object') {
          // 객체인 경우 JSON 문자열로 변환하지 않고 기본 메시지 사용
          errorMessage = t('errors.invalid_input', '입력 형식이 올바르지 않습니다.');
        }
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* 언어 선택 버튼 */}
      <div className="auth-language-selector">
        <button 
          className={`lang-btn-alt ${i18n.language === 'ko' ? 'active' : ''}`} 
          onClick={() => changeLanguage('ko')}
        >
          한국어
        </button>
        <button 
          className={`lang-btn-alt ${i18n.language === 'ja' ? 'active' : ''}`} 
          onClick={() => changeLanguage('ja')}
        >
          日本語
        </button>
      </div>
      
      {/* LangGPT 로고 및 설명 추가 */}
      <div className="auth-logo">
        <h1>LangGPT</h1>
        <p className="auth-description">{t('auth.tagline', '머신러닝 기반 한일/일한 번역 서비스')}</p>
      </div>
      
      <h2>{t('nav.register', '회원가입')}</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">{t('auth.username', '사용자명')}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">{t('auth.email', '이메일')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">{t('auth.password', '비밀번호')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">{t('auth.confirm_password', '비밀번호 확인')}</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn" 
          disabled={loading}
        >
          {loading ? t('loading', '처리 중...') : t('nav.register', '회원가입')}
        </button>
      </form>
      
      <p className="auth-link">
        {t('auth.have_account', '이미 계정이 있으신가요?')} <Link to="/login">{t('auth.login_link', '로그인하기')}</Link>
      </p>
    </div>
  );
};

export default Register;