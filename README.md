# Student Career Navigator

A full-stack web application that matches students with ideal tech career paths based on their current skills and highlights skill gaps to bridge.

## Tech Stack
* **Backend:** Java 21, Spring Boot 4, Spring Data JPA, Jakarta Validation
* **Database:** PostgreSQL
* **Frontend:** React, Vite

## Features
* **Skill-to-Career Matching:** Calculates percentage match scores and lists matched vs. missing skills for every career path.
* **Student Profile & Skill Tracking:** Create student profiles and dynamically add or remove skills.
* **Career & Skill Management:** Full CRUD endpoints with input validation and structured error responses.
* **Automatic Database Seeding:** Pre-populates realistic tech skills, career tracks, and sample student profiles on first launch.

## Local Setup

### 1. Prerequisites
* Java 21+
* Node.js 18+
* PostgreSQL running locally with a database named `career_navigator`

### 2. Backend Setup
```bash
cd backend
# Set your PostgreSQL password as an environment variable
# Windows PowerShell:
$env:DB_PASSWORD="your_postgres_password"
# macOS / Linux:
# export DB_PASSWORD=your_postgres_password

./mvnw spring-boot:run
```
The API runs on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The web app runs on `http://localhost:5173`.
