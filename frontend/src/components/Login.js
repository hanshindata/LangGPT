import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 언어 변경 핸들러
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError(t('errors.login_failed', '로그인에 실패했습니다. 사용자명과 비밀번호를 확인하세요.'));
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
      
      <h2>{t('nav.login', '로그인')}</h2>
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
          <label htmlFor="password">{t('auth.password', '비밀번호')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-btn">{t('nav.login', '로그인')}</button>
      </form>
      
      <p className="auth-link">
        {t('auth.no_account', '계정이 없으신가요?')} <Link to="/register">{t('nav.register', '회원가입')}</Link>
      </p>
    </div>
  );
};

export default Login;