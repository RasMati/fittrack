# FitTrack Backend API

## Setup
1. Install dependencies: `npm install`
2. Create `.env` file with your database credentials
3. Run development server: `npm run dev`

## API Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/workouts/exercises` - Get all exercises (Auth required)
- GET `/api/workouts/sessions` - Get user's workout sessions (Auth required)
- POST `/api/workouts/sessions` - Create new workout session (Auth required)
- POST `/api/workouts/sessions/:id/logs` - Add exercise log (Auth required)
- DELETE `/api/workouts/sessions/:id` - Delete session (Auth required)
- GET `/api/workouts/dashboard` - Get dashboard stats (Auth required)