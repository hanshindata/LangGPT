import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const TranslationHistory = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <h2>{t('history.title', '나의 번역 기록')}</h2>
      {loading ? (
        <p>{t('loading', '불러오는 중...')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="history-list">
          {history.length === 0 ? (
            <p>{t('history.empty', '번역 기록이 없습니다.')}</p>
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