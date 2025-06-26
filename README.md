Habit Tracker App

A habit tracking web application that allows users to register, log in, track daily habits, and view streak statistics and a calendar of completions.

Technologies:

Frontend (React + Vite + TypeScript)
- React Router DOM – Routing and navigation
- React Context API – Authentication state
- Tailwind CSS – Styling
- React Icons – Icons for UI
- React Calendar – Calendar visualization of habit history
- JWT – Used for authentication

Backend (Node.js + Express + Prisma)
- Express.js – REST API server
- Prisma ORM – Database access layer
- PostgreSQL (via Docker) – Relational database containerized with Docker
- bcrypt – Password hashing
- sonwebtoken – JWT token handling
- Docker – Runs PostgreSQL database container

Prerequisites

- Node.js
- npm
- Docker
- Git

Backend Setup
1. docker run --name habit-tracker-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=habit_tracker \
  -p 5432:5432 \
  -d postgres
2. git clone ..
3. cd habit-tracker-server
4. npm install
5. create .env file:
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habit_tracker
6. npx prisma migrate dev --name init
7. node index.js

The backend will run at http://localhost:4000

Frontend Setup
1. cd habit-tracker-frontend
2. npm install
3. npm run dev

The frontend will run at http://localhost:5173

Go to http://localhost:5173/register
