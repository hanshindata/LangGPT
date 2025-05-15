import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TranslationHistory = () => {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 언어 변경 핸들러
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setHistory(response.data);
      } catch (err) {
        setError(t('errors.history_failed', '기록을 불러오는데 실패했습니다.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [t]);

  return (
    <div className="history-container">
      {/* 헤더 섹션 추가 - 뒤로가기 버튼 및 언어 선택기 */}
      <div className="settings-header">
        <Link to="/" className="back-to-app-btn">
          &larr; {t('history.back_to_translator', '번역기로 돌아가기')}
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

      <h2>{t('history.title', '나의 번역 기록')}</h2>
      
      {loading ? (
        <p className="loading-message">{t('loading', '불러오는 중...')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty-message">{t('history.empty', '번역 기록이 없습니다.')}</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-original">
                  <h4>{t('result.original', '원문')}</h4>
                  <p>{item.original_text}</p>
                </div>
                <div className="history-translated">
                  <h4>{t('result.translated', '번역 결과')}</h4>
                  <p>{item.reviewed_text}</p>
                </div>
                <div className="history-date">
                  <small>{new Date(item.created_at).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;