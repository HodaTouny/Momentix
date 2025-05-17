# Momentix – Full-Stack Event Booking Platform

[Live Demo](https://atc-01060584671-1.onrender.com)

Momentix is a full-stack web application that enables seamless event browsing, booking, and administration — designed with modern architecture, AI-powered multilingual support, and a secure, scalable backend.

All diagrams, architecture, testing strategy, database models, and system workflows are documented in detail in the [Project_Documentation.pdf](./Project_Documentation.pdf).

## Live Application

- URL: [https://atc-01060584671-1.onrender.com](https://atc-01060584671-1.onrender.com)
- Hosted on Render (frontend and backend)
- Initial load may take up to 60 seconds due to cold start on free Render plan

## Core Features

- Role-based access control (Admin, User)
- JWT-based auth flow with secure cookies
- Browse, search, and book events
- Prevent duplicate bookings per user per event
- Admin event management (create, edit, delete)
- Event analytics with visual charts (Chart.js)
- AI-generated Arabic/English event descriptions
- Cloud-based image uploads (Cloudinary)
- Rate limiting, helmet, input validation (Joi)
- Testing with Jest and Postman

## Tech Stack

Frontend: React, Axios, React Router, i18next, Chart.js  
Backend: Node.js, Express, Prisma, PostgreSQL, Redis  
Auth: JWT, Cookies  
AI: Gemini API, ChatGPT (assistance)  
DevOps: Render, GitHub, Postman  
Media: Cloudinary

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ATC_01060584671.git
cd ATC_01060584671
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma generate
```

#### .env example (backend/.env)

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/momentix
NODE_ENV=development
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN=your_refresh_token
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
```

#### Edit /backend/src/lib/cors.js for local development

```js
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

module.exports = corsOptions;
```

#### Start Backend

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

#### .env example (frontend/.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run Backend Tests

```bash
cd backend
npm test
```

## Documentation

- [Project_Documentation.pdf](./Project_Documentation.pdf)

## Developer

Hoda Samir Touny Mohammed  
hodasammir@gmail.com  
