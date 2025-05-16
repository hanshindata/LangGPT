# LangGPT: Korean-Japanese AI Translation Service

## 📌 Introduction
LangGPT is an AI-powered translation service specializing in Korean-Japanese bidirectional translation. Using a two-step translation process, it provides more natural-sounding results beyond the limitations of conventional machine translation.

## ✨ Features
- **Bidirectional Translation**: Support for Korean → Japanese and Japanese → Korean
- **Two-step Translation Process**: Initial translation followed by AI review to improve quality.
    - *Initial Translation*: Basic AI translation of the source text.
    - *Translation Review*: Review of the initial translation for a more natural result.
    - *Result Comparison*: Ability to compare initial and reviewed translations.
- **Translation History**: Store and retrieve user-specific translation records for easy reference.
- **User Authentication**: Secure JWT-based authentication system.
- **Responsive Design**: Support for both mobile and desktop environments.
- **Bilingual Interface**: Full support for both Korean and Japanese UI.
- **User API Keys**: Users provide their own OpenAI API keys for translation operations.
    - API keys are securely stored in the browser session.
    - API keys are never permanently stored on the server.
    - Users can manage their API keys in the Settings page.

## 🌐 Live Demo
Try out the live version: [https://langgpt.pro/](https://langgpt.pro/)

## 📸 Screenshots

### Main Translation Screen
<img alt="Main Screen" src="./screenshots/main_screen.png" width="800">

### Login Screen
<img alt="Login Screen" src="./screenshots/login_screen.png">

### Translation History
<img alt="Translation History" src="./screenshots/translation_history.png">

### API Key Settings
<img alt="Settings Screen" src="./screenshots/settings_screen.png">

## 🛠️ Technology Stack
### Backend
- **FastAPI**: High-performance API server framework
- **LangChain**: AI model integration and prompt management
- **PostgreSQL**: User and translation data storage
- **JWT**: Token-based authentication
- **SQLAlchemy**: ORM database management
- **OpenAI API**: GPT-based translation and review

### Frontend
- **React**: User interface construction
- **React Router**: Client-side routing
- **i18next**: Internationalization
- **Axios**: API communication
- **Context API**: State management

### Infrastructure
- **Render**: Backend API hosting
- **Vercel**: Frontend hosting and deployment
- **PostgreSQL (Cloud)**: Database hosting

## 🚀 Installation and Setup

### Prerequisites
- Node.js 16.x or higher
- Python 3.9 or higher
- PostgreSQL
- OpenAI API Key (required for each user)

### Backend Setup
```bash
# Clone repository
git clone https://github.com/hanshindata/LangGPT.git
cd LangGPT

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your database and JWT settings

# Run server
uvicorn backend:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your backend URL

# Start development server
npm start
```

## 📄 Environment Variable Setup
```
# Backend .env file
DATABASE_URL=postgresql://username:password@localhost/langgpt
SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

# Frontend .env file
REACT_APP_API_URL=http://localhost:8000
```

## ⚠️ API Key Requirements
Each user needs to provide their own OpenAI API key to use the translation service:
- API keys are securely stored in the browser session
- API keys are never permanently stored on the server
- Users can manage their API keys in the Settings page
- Visit [OpenAI Platform](https://platform.openai.com/api-keys) to generate an API key

## 🚢 Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `SECRET_KEY`: Secret key for JWT
   - `FRONTEND_URL`: URL of your frontend application
4. Deploy with the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel)
1. Import your GitHub repository on Vercel
2. Add environment variables:
   - `REACT_APP_API_URL`: URL of your backend API
3. Deploy with default settings

## 📂 Project Structure
```
LangGPT/
├── backend.py           # FastAPI backend server
├── requirements.txt     # Python dependencies
├── .env                # Environment variables (development)
├── .env.example        # Example environment variables template
├── screenshots/        # Application screenshots
└── frontend/           # React frontend application
    ├── public/         # Static files
    ├── package.json    # Node.js dependencies
    ├── .env            # Frontend environment variables
    └── src/
        ├── App.js      # Main application component
        ├── App.css     # Main stylesheet
        ├── index.js    # Entry point
        ├── i18n/       # Internationalization
        │   ├── i18n.js # i18n configuration
        │   └── locales/# Translation files
        │       ├── ko.json # Korean translations
        │       └── ja.json # Japanese translations
        ├── services/   # API services
        │   └── api.js  # API client configuration
        ├── components/ # React components
        │   ├── Login.js      # Login component
        │   ├── Register.js   # Registration component
        │   ├── Settings.js   # API key management component
        │   └── TranslationHistory.js # History component
        └── context/    # React context management
            └── AuthContext.js # Authentication context
```

## 👨‍💻 Developer Information
- **Name**: HAN SHIN (韓 信)
- **GitHub**: [hanshindata](https://github.com/hanshindata)
- **Email**: han.shin.data@gmail.com
