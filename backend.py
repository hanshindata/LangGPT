from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 사용자 인증 시스템 라이브러리
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import Session
import uuid
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# .env 파일 로드
load_dotenv()

# FastAPI 애플리케이션 초기화
app = FastAPI(title="LangGPT API")

# CORS 설정 개선
frontend_url = os.getenv("FRONTEND_URL", "https://www.langgpt.pro")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url, 
        "http://localhost:3000",
        "https://langgpt.pro",       # 루트 도메인 추가
        "https://www.langgpt.pro"    # www 서브도메인 추가
        "https://langgpt-six.vercel.app"  # 기존 Vercel 도메인
    ],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# HTTPS 강제화 (프로덕션 환경에서)
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# 신뢰할 수 있는 호스트만 허용
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=[
        frontend_url.replace("https://", ""), 
        "localhost",
        "langgpt.pro",
        "www.langgpt.pro"
        "langgpt-six.vercel.app"  # 기존 Vercel 도메인 추가
    ]
)

# 보안 헤더 미들웨어 (CSRF 방지 등)
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# 데이터베이스 설정
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:비밀번호@localhost/langgpt")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT 토큰 설정
SECRET_KEY = os.getenv("SECRET_KEY", str(uuid.uuid4()))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해싱
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 데이터베이스 모델 정의
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class TranslationHistory(Base):
    __tablename__ = "translation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    original_text = Column(String)
    translated_text = Column(String)
    reviewed_text = Column(String)
    created_at = Column(String, default=lambda: datetime.now().isoformat())

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 의존성 함수 - 데이터베이스 세션 획득
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 사용자 인증 함수
def get_user(db: Session, username: str):
    """사용자명으로 사용자 조회"""
    return db.query(User).filter(User.username == username).first()

def verify_password(plain_password, hashed_password):
    """비밀번호 검증"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """비밀번호 해싱"""
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str):
    """사용자 인증"""
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    """JWT 액세스 토큰 생성"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """현재 인증된 사용자 가져오기"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    return user

# 사용자 등록 요청 모델
class UserRegisterRequest(BaseModel):
    username: str
    email: str
    password: str

# 사용자 인증 API 엔드포인트
@app.post("/register")
async def register(
    user_data: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """새 사용자 등록"""
    db_user = get_user(db, user_data.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username, 
        email=user_data.email, 
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}

@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """로그인 및 액세스 토큰 발급"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# JSON 로그인 요청 모델
class LoginRequest(BaseModel):
    username: str
    password: str

# JSON 로그인 엔드포인트 추가
@app.post("/login")
async def login_json(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """JSON 형식으로 로그인 요청 처리"""
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# 사용자 정보 조회 엔드포인트 추가
@app.get("/api/me")
async def get_user_info(current_user: User = Depends(get_current_user)):
    """현재 인증된 사용자 정보 반환"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    }

# API 요청/응답 모델
class TranslationRequest(BaseModel):
    text: str
    direction: str = "ko2ja"  # ko2ja(한국어→일본어) 또는 ja2ko(일본어→한국어)
    api_key: str  # 사용자 API 키 필드 추가

class TranslationResponse(BaseModel):
    original: str
    translated: str
    reviewed: str

# 한국어→일본어 번역 프롬프트 템플릿
ko_to_ja_translation_prompt = ChatPromptTemplate.from_template("""
한국어 텍스트를 자연스러운 일본어로 번역한다.
원문: {text}

번역 시 다음을 지켜주세요:
1. 문맥을 정확히 파악하여 번역
2. 일본어 문법에 맞게 자연스럽게 번역
3. 원문의 의도와 뉘앙스를 정확히 전달
4. 원문이 반말이면 반말로, 존댓말이면 존댓말로 번역
5. 자연스러운 일본어 표현 사용
""")

# 일본어→한국어 번역 프롬프트 템플릿
ja_to_ko_translation_prompt = ChatPromptTemplate.from_template("""
일본어 텍스트를 자연스러운 한국어로 번역한다.
원문: {text}

번역 시 다음을 지켜주세요:
1. 문맥을 정확히 파악하여 번역
2. 한국어 문법에 맞게 자연스럽게 번역
3. 원문의 의도와 뉘앙스를 정확히 전달
4. 원문이 반말이면 반말로, 경어체면 경어체로 번역
5. 자연스러운 한국어 표현 사용
""")

# 한국어→일본어 번역 검토 프롬프트 템플릿
ko_to_ja_review_prompt = ChatPromptTemplate.from_template("""
다음 한국어-일본어 번역을 검토하고 개선된 최종 번역을 제공한다:

원문(한국어): {original}
초벌 번역(일본어): {translated}

다음 항목을 고려하여 번역을 개선한다:
1. 문맥에 정확히 파악하여 어휘를 알맞게 선택했는가?
2. 원문이 반말이면 반말로, 존댓말이면 존댓말로 번역했는가?
3. 자연스러운 일본어 표현인가?

개선된 최종 번역만 제공한다. 설명이나 부가 설명 없이 개선된 일본어 번역만 작성한다.
""")

# 일본어→한국어 번역 검토 프롬프트 템플릿
ja_to_ko_review_prompt = ChatPromptTemplate.from_template("""
다음 일본어-한국어 번역을 검토하고 개선된 최종 번역을 제공한다:

원문(일본어): {original}
초벌 번역(한국어): {translated}

다음 항목을 고려하여 번역을 개선한다:
1. 문맥에 정확히 파악하여 어휘를 알맞게 선택했는가?
2. 원문이 반말이면 반말로, 경어체면 경어체로 번역했는가?
3. 자연스러운 한국어 표현인가?

개선된 최종 번역만 제공한다. 설명이나 부가 설명 없이 개선된 한국어 번역만 작성한다.
""")

# 번역 API 엔드포인트
@app.post("/translate", response_model=TranslationResponse)
async def translate(
    request: TranslationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    api_key: str = Header(None, alias="X-API-KEY")  # 헤더 API 키를 선택적으로 변경
):
    try:
        # API 키 검증 - 헤더 우선, 없으면 요청 본문 사용
        used_api_key = api_key if api_key else request.api_key
        
        if not used_api_key or not used_api_key.startswith("sk-"):
            raise HTTPException(
                status_code=400,
                detail="Valid OpenAI API key is required"
            )
        
        # 사용자 API 키로 LLM 인스턴스 생성
        user_llm = ChatOpenAI(
            api_key=used_api_key,
            model="gpt-4.1-mini",
            temperature=0.7,
            max_tokens=2000
        )
        
        # 번역 방향에 따라 프롬프트 선택
        if request.direction == "ko2ja":
            translation_prompt = ko_to_ja_translation_prompt
            review_prompt = ko_to_ja_review_prompt
        elif request.direction == "ja2ko":
            translation_prompt = ja_to_ko_translation_prompt
            review_prompt = ja_to_ko_review_prompt
        else:
            raise HTTPException(status_code=400, detail="Invalid translation direction")
        
        # 번역 실행
        translation_chain = translation_prompt | user_llm
        initial_translation_result = translation_chain.invoke({"text": request.text})
        initial_translation = initial_translation_result.content
        
        # 검토 과정
        review_chain = review_prompt | user_llm
        reviewed_translation_result = review_chain.invoke({
            "original": request.text,
            "translated": initial_translation
        })
        reviewed_translation = reviewed_translation_result.content
        
        # 결과 생성
        result = {
            "original": request.text,
            "translated": initial_translation.strip(),
            "reviewed": reviewed_translation.strip()
        }
        
        # 결과를 DB에 저장
        history = TranslationHistory(
            user_id=current_user.id,
            original_text=request.text,
            translated_text=initial_translation.strip(),
            reviewed_text=reviewed_translation.strip()
        )
        db.add(history)
        db.commit()

        return result
        
    except Exception as e:
        # 보다 유용한 에러 메시지 제공
        error_message = str(e)
        if "sk-" in error_message:
            # API 키는 숨기되 오류 유형은 표시
            if "invalid_api_key" in error_message.lower() or "authentication" in error_message.lower():
                error_message = "Invalid API key provided"
            elif "rate_limit" in error_message.lower():
                error_message = "OpenAI API rate limit exceeded"
            elif "insufficient_quota" in error_message.lower():
                error_message = "OpenAI API quota exceeded"
            else:
                error_message = "OpenAI API error occurred"
        
        print(f"Error during translation: {error_message}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {error_message}")

# 번역 기록 조회 API
@app.get("/history")
async def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20
):
    """사용자별 번역 기록 조회"""
    histories = (
        db.query(TranslationHistory)
        .filter(TranslationHistory.user_id == current_user.id)
        .order_by(TranslationHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    
    return histories    

# 개발 서버 실행 코드
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)