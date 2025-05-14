import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';
import api from './services/api';
import './App.css';

function App() {
  // i18n 설정
  const { t, i18n } = useTranslation();
  
  // 상태 관리
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentTranslations, setRecentTranslations] = useState([]);
  const [direction, setDirection] = useState('ko2ja'); // 기본 번역 방향: 한국어→일본어
  
  // 인증 컨텍스트 사용
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 언어 변경 핸들러
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };
  
  // 컴포넌트 마운트 시 최근 번역 기록 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentTranslations();
    }
  }, [isAuthenticated]);
  
  // 최근 번역 기록 가져오기
  const fetchRecentTranslations = async () => {
    try {
      const response = await api.get('/history?limit=3');
      setRecentTranslations(response.data);
    } catch (err) {
      console.error('히스토리 조회 오류:', err);
    }
  };

  // 번역 요청 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/translate', {
        text: inputText,
        direction: direction
      });
      
      setResult(response.data);
      
      // 번역 성공 후 최근 기록 다시 가져오기
      if (isAuthenticated) {
        fetchRecentTranslations();
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(t('errors.login_required'));
        // 인증 만료 시 로그인 페이지로 리다이렉트
        logout();
        navigate('/login');
      } else {
        setError(t('errors.translation_failed'));
        console.error('Translation error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // 번역 방향에 따른 라벨 설정
  const getDirectionLabel = () => {
    return t(`direction.${direction}`);
  };

  // 번역 방향에 따른 입력 필드 라벨 설정
  const getInputLabel = () => {
    return direction === 'ko2ja' ? t('form.ko_input') : t('form.ja_input');
  };

  // 번역 방향에 따른 입력 필드 placeholder 설정
  const getInputPlaceholder = () => {
    return direction === 'ko2ja' ? t('form.ko_placeholder') : t('form.ja_placeholder');
  };

  // 번역 방향 전환 처리
  const toggleDirection = () => {
    setDirection(prev => prev === 'ko2ja' ? 'ja2ko' : 'ko2ja');
    setResult(null); // 결과 초기화
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('title')}</h1>
        
        {/* 네비게이션 메뉴 */}
        <nav className="main-nav">
          {isAuthenticated ? (
            <>
              <span className="welcome-text">{t('nav.welcome', { username: user?.username || t('user') })}</span>
              <Link to="/history" className="nav-link">{t('nav.history')}</Link>
              <button onClick={logout} className="logout-btn">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              <Link to="/register" className="nav-link">{t('nav.register')}</Link>
            </>
          )}
          
          {/* 언어 전환 버튼 */}
          <div className="language-selector">
            <button 
              className={`lang-btn ${i18n.language === 'ko' ? 'active' : ''}`} 
              onClick={() => changeLanguage('ko')}
            >
              한국어
            </button>
            <button 
              className={`lang-btn ${i18n.language === 'ja' ? 'active' : ''}`} 
              onClick={() => changeLanguage('ja')}
            >
              日本語
            </button>
          </div>
        </nav>
      </header>
      
      <main className="container">
        <div className="direction-toggle">
          <button 
            onClick={toggleDirection} 
            className="direction-btn"
            title={t('change_direction')}
          >
            <span className="current-direction">{getDirectionLabel()}</span>
            <span className="toggle-icon">⇄</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="translation-form">
          <div className="form-group">
            <label htmlFor="inputText">{getInputLabel()}</label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getInputPlaceholder()}
              rows={5}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t('form.translating') : t('form.translate')}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        
        {result && (
          <div className="result-container">
            {/* 번역 결과만 기본적으로 표시 */}
            <div className="result-box">
              <h3>{t('result.translated')}</h3>
              <p className="result-text">{result.reviewed}</p>
            </div>
            
            {/* 원문 보기 옵션 - 접었다 펼 수 있는 방식으로 변경 */}
            <details className="initial-translation-details">
              <summary>{t('result.show_original', '원문 보기')}</summary>
              <div className="initial-translation">
                <p>{result.original}</p>
              </div>
            </details>
            
            {/* 초벌 번역 결과 - 접었다 펼 수 있는 방식 유지 */}
            <details className="initial-translation-details">
              <summary>{t('result.initial')}</summary>
              <div className="initial-translation">
                <p>{result.translated}</p>
              </div>
            </details>
          </div>
        )}
        
        {/* 최근 번역 기록 표시 (인증된 사용자에게만) */}
        {isAuthenticated && recentTranslations.length > 0 && (
          <div className="recent-translations">
            <h3>{t('history.recent')}</h3>
            <ul className="translations-list">
              {recentTranslations.map((item) => (
                <li key={item.id} className="translation-item">
                  <div className="translation-meta">
                    <span className="translation-date">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="translation-content">
                    <p className="translation-original">{item.original_text.substring(0, 50)}
                      {item.original_text.length > 50 ? '...' : ''}
                    </p>
                    <p className="translation-result">{item.reviewed_text.substring(0, 50)}
                      {item.reviewed_text.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/history" className="view-all-link">{t('history.view_all')}</Link>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}

export default App;