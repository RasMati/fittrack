# 🏋️ FitTrack - Workout Tracker

FitTrack is a full-stack workout tracking application that lets users register, log in, browse a built-in exercise library, create workout sessions, and view dashboard statistics. It combines a Node.js/Express backend with a React frontend and a PostgreSQL database.

## Project Overview

This project provides a simple fitness tracking experience with authentication, exercise discovery, workout logging, and progress summaries.

## Setup and Run

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- A local PostgreSQL server

### Backend setup

```bash
cd backend/src
npm install
```

Create a .env file in the backend src folder with your local database settings:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=event_management_db
JWT_SECRET=your_super_secret_key
BCRYPT_ROUNDS=10
CLIENT_URL=http://localhost:3001
```

Start the backend server:

```bash
npm start
```

The backend initializes the required tables on startup and seeds the exercise library if it is empty.

### Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The frontend should be available at http://localhost:3001.

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg
- JWT authentication
- bcrypt
- dotenv
- CORS/helmet/rate limiting

### Frontend
- React.js
- React Router
- Axios
- React Toastify

## Database DDL and Schema

The SQL schema and seed data are stored in:

- [database/ddl.sql](database/ddl.sql)
- [database/seed.sql](database/seed.sql)

The main tables are:
- users
- exercises
- workout_sessions
- workout_logs

## Extra Features Implemented Beyond the Course Scope

- Database-backed authentication and persistence
- Seeded exercise library for immediate use
- Workout dashboard with summary statistics
- Protected API routes and auth-aware frontend navigation
- Automatic schema initialization and exercise seeding on backend startup
