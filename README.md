# CareerNavigator — AI-Powered Student Career, Scholarship & College Guidance Platform

**CareerNavigator** is a full-stack career counseling and academic decision-support platform designed for Indian students (Post-10th, Intermediate/12th, Diploma, and Undergraduate) and their families. It combines **Google Gemini AI career recommendations** with **real financial affordability modeling**, **central & state government scholarship discovery (NSP, Telangana ePASS, AICTE)**, **institution filtering**, and **step-by-step skill roadmaps**.

---

## Key Features

1. **Comprehensive Student Profiling & Skill Portfolio**
   - Captures academic qualification (10th, 12th/Inter, Diploma, UG), stream, marks/percentage, interests, target city, annual family budget (₹), relocation preference, and preferred learning mode.
   - Manages verified technical/soft skills and performs instant skill-gap matching against stored careers.

2. **AI Career Match & Side-by-Side Comparison**
   - Integrates **Google Gemini API** via Spring `RestClient` (with an automatic deterministic fallback engine) to generate tailored career recommendations.
   - Displays match scores, entry-level and experienced Indian salary ranges (LPA), market demand, pros/cons, and budget-fit notes.

3. **Post-10th & Post-12th Education Pathways Explorer**
   - Maps structured academic and vocational routes (Polytechnic Diplomas, ITI trades, B.Tech, BCA/B.Sc., and skill-first tracks) with eligibility criteria, duration, typical fees, and career outcomes.

4. **Budget & Government Schemes Hub**
   - Calculates annual tuition + optional hostel/food expenses against the student's family budget to highlight surplus or funding gaps.
   - Surfaces verified scholarships including **National Scholarship Portal (NSP)**, **Telangana ePASS**, and **AICTE Pragati/Saksham**.

5. **College & Institution Discovery**
   - Filters institutions by city (e.g., Hyderabad, Warangal), institution type (`Government` vs. `Private`), and maximum annual tuition budget with direct links to official websites and Google Maps.

6. **Personalized Learning Roadmap & Free Resources**
   - Generates ordered, career-specific learning milestones with persistent progress tracking (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`) and curated free/low-cost courses (NPTEL, SWAYAM).

7. **Parent Decision Guide**
   - Translates technical career and academic data into a plain-language financial commitment, scholarship eligibility, and ROI summary for parents.

8. **Admin Catalog Management**
   - Full CRUD management for careers, skills, and career-to-skill mappings.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Plus Jakarta Sans Design System, Fetch REST Client |
| **Backend** | Java 21+, Spring Boot 4.2, Spring Data JPA, Spring Validation, Spring `RestClient` |
| **Database** | PostgreSQL |
| **AI Engine** | Google Gemini API (with deterministic fallback service) |

---

## Project Architecture

```text
student-career-navigator/
├── backend/
│   └── src/main/java/com/careernavigator/backend/
│       ├── controller/     # REST API endpoints (/api/students, /api/careers, /api/navigator)
│       ├── model/          # JPA Entities (Student, StudentProfile, Career, Skill, RoadmapStep, etc.)
│       ├── repository/     # Spring Data JPA repositories
│       └── service/        # GeminiCareerService, Budget & Navigator business logic
└── frontend/
    └── src/
        ├── components/     # 8 modular React views (Onboarding, AI Advisor, Pathways, Schemes, Colleges, Roadmap, Parent Guide, Admin)
        ├── api.js          # Centralized REST API client
        ├── index.css       # Design tokens & responsive styling
        └── App.jsx         # Global state, student switcher, and module navigation