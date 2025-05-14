LangGPT - 한일/일한 AI 번역 서비스
<img alt="LangGPT 로고" src="https://via.placeholder.com/150x50?text=LangGPT">
📌 소개
LangGPT는 최신 AI 기술을 활용한 한국어-일본어 양방향 번역 서비스입니다. 일반 번역기보다 더 자연스러운 번역 결과를 제공하기 위해 2단계 번역 프로세스를 적용하여 기계 번역의 한계를 뛰어넘습니다.

✨ 주요 기능
양방향 번역: 한국어 → 일본어, 일본어 → 한국어 번역 지원
2단계 번역 프로세스: 초벌 번역 후 AI가 다시 검토하여 품질 향상
번역 기록 저장: 사용자별 번역 기록 보관 및 조회
사용자 인증: JWT 기반 안전한 사용자 인증 시스템
반응형 디자인: 모바일 및 데스크톱 환경 모두 지원
🛠️ 기술 스택
백엔드
FastAPI: 고성능 API 서버 프레임워크
LangChain: AI 모델 통합 및 프롬프트 관리
PostgreSQL: 사용자 및 번역 데이터 저장
Redis: 번역 결과 캐싱
JWT: 토큰 기반 인증
SQLAlchemy: ORM 데이터베이스 관리
OpenAI API: GPT 기반 번역 및 검토
프론트엔드
React: 사용자 인터페이스 구축
React Router: 클라이언트 사이드 라우팅
Axios: API 통신
Context API: 상태 관리
🚀 설치 및 실행 방법
사전 요구사항
Node.js 16.x 이상
Python 3.9 이상
PostgreSQL
Redis

백엔드 설정
# 저장소 클론
git clone https://github.com/username/langgpt.git
cd langgpt

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# 서버 실행
uvicorn backend:app --reload

프론트엔드 설정

# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start

📄 환경 변수 설정
# .env 파일
DATABASE_URL=postgresql://username:password@localhost/langgpt
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_jwt_secret_key

📂 프로젝트 구조
LangGPT/
├── backend.py           # FastAPI 백엔드
├── requirements.txt     # 파이썬 의존성
├── .env                 # 환경 변수
└── frontend/            # React 프론트엔드
    ├── public/
    ├── src/
    │   ├── App.js       # 메인 애플리케이션
    │   ├── App.css      # 스타일시트
    │   ├── index.js     # 진입점
    │   ├── services/    # API 서비스
    │   ├── components/  # React 컴포넌트
    │   └── context/     # Context API
    ├── package.json
    └── README.md

📸 스크린샷
메인 번역 화면
<img alt="메인 화면" src="https://via.placeholder.com/800x450?text=메인+번역+화면">
로그인 화면
<img alt="로그인 화면" src="https://via.placeholder.com/800x450?text=로그인+화면">
번역 기록
<img alt="번역 기록" src="https://via.placeholder.com/800x450?text=번역+기록+화면">

🔍 기능 상세
2단계 번역 프로세스
초벌 번역: 원문을 기본 AI 번역
번역 검토: 초벌 번역을 검토하여 더 자연스럽게 개선
결과 비교: 초벌 번역과 검토된 번역을 비교 가능
캐싱 시스템
자주 요청되는 번역에 대해 Redis를 활용한 캐싱을 통해 응답 시간 단축 및 API 비용 절감

사용자별 데이터 관리
사용자마다 번역 기록을 저장하고 조회할 수 있어 이전 번역 내용 쉽게 참조 가능

🌐 데모
라이브 데모 링크

👨‍💻 개발자 정보
개발자 이름
📜 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다 - 자세한 내용은 LICENSE 파일을 참조하세요.

⭐ 이 프로젝트가 마음에 드셨다면 GitHub 저장소에 Star를 눌러주세요!