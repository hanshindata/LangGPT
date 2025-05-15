import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // 컴포넌트 로드 시 API 키 상태 확인
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setHasApiKey(true);
    }
  }, []);

  // 언어 변경 핸들러
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // API 키 형식 검증
      if (!apiKey || !apiKey.startsWith('sk-')) {
        setError(t('settings.invalid_api_key', 'API 키 형식이 올바르지 않습니다. OpenAI API 키는 "sk-"로 시작해야 합니다.'));
        setLoading(false);
        return;
      }

      // 로컬 스토리지에 API 키 저장
      localStorage.setItem('openai_api_key', apiKey);
      setHasApiKey(true);
      setMessage(t('settings.api_key_updated', 'API 키가 성공적으로 업데이트되었습니다.'));
      setApiKey('');
    } catch (err) {
      setError(t('settings.update_failed', 'API 키 업데이트에 실패했습니다.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      {/* 언어 선택 버튼 */}
      <div className="settings-header">
        <Link to="/" className="back-to-app-btn">
          &larr; {t('settings.back_to_translator', '번역기로 돌아가기')}
        </Link>
        
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
      </div>
      
      <h2>{t('settings.title', '계정 설정')}</h2>
      
      <div className="settings-section">
        <h3>{t('settings.api_key_section', 'OpenAI API 키 설정')}</h3>
        
        {hasApiKey ? (
          <div className="api-key-status success">
            <p>✅ {t('settings.api_key_active', 'API 키가 설정되어 있습니다.')}</p>
          </div>
        ) : (
          <div className="api-key-status warning">
            <p>⚠️ {t('settings.api_key_required', 'API 키를 설정하지 않으면 번역 기능을 사용할 수 없습니다.')}</p>
          </div>
        )}
        
        <p>{t('settings.api_key_description', 
            '번역 서비스 이용을 위해 본인의 OpenAI API 키가 필요합니다. API 키는 브라우저에 저장되며 서버로 전송되지 않습니다.')}</p>
        
        <div className="api-key-instructions">
          <h4>{t('settings.api_key_instructions', 'API 키 설정 방법')}</h4>
          <ol>
            <li>{t('settings.visit_openai', '1. OpenAI 웹사이트를 방문하세요: ')}<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">openai.com/api-keys</a></li>
            <li>{t('settings.create_account', '2. 계정이 없다면 계정을 만드세요.')}</li>
            <li>{t('settings.create_key', '3. "API 키 생성"을 클릭하여 새 API 키를 만드세요.')}</li>
            <li>{t('settings.copy_key', '4. 생성된 API 키를 아래 입력란에 붙여넣으세요.')}</li>
          </ol>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="apiKey">{t('settings.api_key', 'OpenAI API 키')}</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t('loading', '처리 중...') : t('settings.save', '저장')}
          </button>
        </form>
      </div>
      
      <div className="settings-section">
        <h3>{t('settings.account_info', '계정 정보')}</h3>
        <div className="account-info">
          <p><strong>{t('auth.username', '사용자명')}:</strong> {user?.username}</p>
          <p><strong>{t('auth.email', '이메일')}:</strong> {user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
