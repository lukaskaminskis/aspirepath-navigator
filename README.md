# AspirePath Navigator

AspirePath Navigator is an AI-powered career analysis platform that helps professionals understand their career trajectory, automation risks, and upskilling opportunities. The platform provides personalized insights by analyzing LinkedIn profiles and resumes.

## Features

- **Career Analysis Dashboard**
  - Automation risk assessment
  - Key strengths evaluation
  - Skills improvement recommendations
  - Personalized career path suggestions
  - Real student testimonials
  - Career uncertainties FAQ

- **Smart Analysis**
  - LinkedIn profile analysis
  - Resume parsing
  - AI-powered insights
  - Data-driven recommendations

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn UI components
- React Hook Form for form handling
- Zod for form validation

### Backend
- FastAPI (Python)
- PostgreSQL (Heroku)
- LangChain for AI processing
- SQLAlchemy ORM
- Alembic for migrations

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL
- Heroku CLI (for deployment)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd aspirepath-navigator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd aspirepath-navigator-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/aspirepath
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Run migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Database Setup

### Local Development
1. Create a PostgreSQL database:
   ```bash
   createdb aspirepath
   ```

2. Update the DATABASE_URL in `.env`

### Heroku Deployment
1. Create a Heroku app:
   ```bash
   heroku create aspirepath-navigator
   ```

2. Add Postgres:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   ```

## Project Structure

```
aspirepath-navigator/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── types/         # TypeScript types
└── public/            # Static assets

aspirepath-navigator-backend/
├── app/
│   ├── core/          # Core configurations
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── api/           # API routes
├── alembic/           # Database migrations
└── tests/             # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- World Economic Forum's Future of Jobs Report
- LinkedIn Workplace Learning Report
- Epoch AI research
- McKinsey & Company insights
