import axios from 'axios';

// API 기본 URL 설정
// 개발 환경에서는 .env의 값 사용, 프로덕션에서는 상대 경로 또는 실제 배포 URL 사용
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://langgpt-backend.onrender.com'
  : process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('Using API URL:', API_URL);

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
