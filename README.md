# LangGPT: Korean-Japanese AI Translation Service

## 📌 Introduction
LangGPT is an AI-powered translation service specializing in Korean-Japanese bidirectional translation. Using a two-step translation process, it provides more natural-sounding results beyond the limitations of conventional machine translation.

## ✨ Key Features
- **Bidirectional Translation**: Support for Korean → Japanese and Japanese → Korean
- **Two-step Translation Process**: Initial translation followed by AI review to improve quality
- **Translation History**: Store and retrieve user-specific translation records
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Support for both mobile and desktop environments
- **Bilingual Interface**: Full support for both Korean and Japanese UI

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

## 🚀 Installation and Setup

### Prerequisites
- Node.js 16.x or higher
- Python 3.9 or higher
- PostgreSQL

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
# Edit .env file

# Run server
uvicorn backend:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 📄 Environment Variable Setup
```
# .env file
DATABASE_URL=postgresql://username:password@localhost/langgpt
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_jwt_secret_key
```

## 📂 Project Structure
```
LangGPT/
├── backend.py           # FastAPI backend
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── frontend/            # React frontend
    ├── public/
    ├── src/
    │   ├── App.js       # Main application
    │   ├── App.css      # Stylesheet
    │   ├── index.js     # Entry point
    │   ├── i18n/        # Internationalization
    │   ├── services/    # API services
    │   ├── components/  # React components
    │   └── context/     # Context API
    ├── package.json
    └── README.md
```

## 📸 Screenshots

### Main Translation Screen
<img alt="Main Screen" src="https://via.placeholder.com/800x450?text=Main+Translation+Screen">

### Login Screen
<img alt="Login Screen" src="https://via.placeholder.com/800x450?text=Login+Screen">

### Translation History
<img alt="Translation History" src="https://via.placeholder.com/800x450?text=Translation+History+Screen">

## 🔍 Detailed Features

### Two-step Translation Process
- **Initial Translation**: Basic AI translation of the source text
- **Translation Review**: Review of the initial translation for a more natural result
- **Result Comparison**: Ability to compare initial and reviewed translations

### User Data Management
- Users can store and access their translation history for easy reference to previous translations

## 👨‍💻 Developer Information
- **Name**: HAN SHIN (韓 信)
- **GitHub**: [hanshindata](https://github.com/hanshindata)
- **Email**: han.shin.data@gmail.com
