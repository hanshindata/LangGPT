import axios from 'axios';

// API 기본 URL - 환경 변수가 설정되어 있으면 사용, 없으면 기본값 사용
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
});

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
