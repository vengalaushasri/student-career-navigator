# Student Career Navigator — Complete Full-Stack Upgrade

## What Is Included in This ZIP
1. **Backend (`backend/`) — Java 21 + Spring Boot 4.2 + PostgreSQL**
   - `model/StudentProfile.java`: Detailed student onboarding profile (age, qualification, stream, marks, subjects, interests, goals, state/city, annual ₹ budget, relocation, learning mode).
   - `model/EducationPathway.java`: Post-10th & Post-12th pathways (Intermediate + Degree, Polytechnic Diploma, ITI Vocational) with fees, eligibility, pros/cons, and sources.
   - `model/GovernmentScheme.java`: Central & State scholarships (NSP PM-USP, Telangana ePASS, AICTE Pragati & Saksham) with official URLs and verification dates.
   - `model/College.java`: Searchable institutions (JNTUH, Osmania University, KITSW Warangal, Govt Polytechnic Warangal) with fee breakdowns, accreditation, and Google Maps links.
   - `model/LearningResource.java` & `model/RoadmapStep.java`: Free NPTEL/SWAYAM/Skill India courses and interactive step-by-step roadmaps.
   - `service/GeminiCareerService.java`: Grounded Gemini AI counselor with automatic deterministic fallback when `GEMINI_API_KEY` is not set.
   - `controller/StudentController.java` & `controller/NavigatorController.java`: Full REST endpoints for profiles, AI guidance, pathways, schemes, colleges, budget gap analysis, and roadmaps.
   - `config/PlatformDataSeeder.java`: Seeds verified initial data automatically on startup without touching your existing `DataSeeder.java`.

2. **Frontend (`frontend/`) — React + Vite**
   - `src/App.jsx`: Clean 8-tab responsive navigation shell preserving all your existing components (`StudentProfile`, `CareerForm`, `SkillManager`, `CareerList`).
   - `src/components/StudentOnboardingWizard.jsx`: 4-step student profile & budget wizard.
   - `src/components/AiCareerAdvisor.jsx`: AI career recommendations + side-by-side career comparison table.
   - `src/components/EducationPathways.jsx`: Post-10th & Post-12th pathway navigator.
   - `src/components/BudgetAndSchemesHub.jsx`: Total annual cost vs. family budget gap calculator + Government schemes explorer.
   - `src/components/CollegeDiscovery.jsx`: Location, type, and tuition-budget college finder with Maps links.
   - `src/components/RoadmapAndResources.jsx`: Interactive learning roadmap with live status tracking + free resources.
   - `src/components/ParentSummaryView.jsx`: Plain-language financial and educational summary for parents.

## How to Apply in 30 Seconds
1. Extract this ZIP into your `C:\Users\vveng\student-career-navigator` folder (overwrite when prompted—none of your existing `Career`, `Skill`, `Student`, or `GlobalExceptionHandler` files are removed).
2. Restart the Spring Boot backend:
   ```powershell
   $env:DB_PASSWORD="your_postgres_password"
   $env:GEMINI_API_KEY="your_gemini_api_key"   # optional; works with built-in fallback if omitted
   cd backend
   ./mvnw spring-boot:run
   ```
3. Refresh the React frontend at `http://localhost:5173`.
