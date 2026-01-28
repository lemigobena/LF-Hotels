# New LF Restaurant System

## Project Overview
A multi-hotel management system allowing a Super Admin to manage multiple hotels, Hotel Admins to manage their specific services, and customers to browse and reserve services.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS (Premium Design)
- **Backend**: Node.js, Express, Prisma, PostgreSQL (Neon)

## How to Run

### 1. Database Setup
Ensure your PostgreSQL database is running and the `DATABASE_URL` is set in `backend/.env`.

Run migrations (if not already done):
```bash
cd backend
npx prisma migrate dev --name init
```

### 2. Start the Backend
Open a terminal:
```bash
cd backend
npm install  # Install dependencies if needed
npm run dev
```
*Server will start on `http://localhost:5000`*

### 3. Start the Frontend
Open a **new** terminal:
```bash
cd frontend
npm install  # Install dependencies if needed
npm run dev
```
*Application will open at `http://localhost:5173`*

## Key URLs
- **Landing Page**: `http://localhost:5173/`
- **Login**: `http://localhost:5173/login`
- **Super Admin Dashboard**: `http://localhost:5173/admin/super` (Requires Login)
- **Hotel Admin Dashboard**: `http://localhost:5173/admin/hotel` (Requires Login)
