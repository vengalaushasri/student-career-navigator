package com.careernavigator.backend.service;

import com.careernavigator.backend.model.Career;
import com.careernavigator.backend.model.College;
import com.careernavigator.backend.model.GovernmentScheme;
import com.careernavigator.backend.model.Skill;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.model.StudentProfile;
import com.careernavigator.backend.repository.CareerRepository;
import com.careernavigator.backend.repository.CollegeRepository;
import com.careernavigator.backend.repository.GovernmentSchemeRepository;
import com.careernavigator.backend.repository.StudentProfileRepository;
import com.careernavigator.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiCareerService {

    private final StudentRepository studentRepository;
    private final StudentProfileRepository profileRepository;
    private final CareerRepository careerRepository;
    private final GovernmentSchemeRepository schemeRepository;
    private final CollegeRepository collegeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient restClient;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String geminiModel;

    public GeminiCareerService(
            StudentRepository studentRepository,
            StudentProfileRepository profileRepository,
            CareerRepository careerRepository,
            GovernmentSchemeRepository schemeRepository,
            CollegeRepository collegeRepository) {
        this.studentRepository = studentRepository;
        this.profileRepository = profileRepository;
        this.careerRepository = careerRepository;
        this.schemeRepository = schemeRepository;
        this.collegeRepository = collegeRepository;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(10));
        requestFactory.setReadTimeout(Duration.ofSeconds(25));
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> generateCareerGuidance(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        StudentProfile profile = profileRepository.findByStudentId(studentId).orElse(new StudentProfile());
        List<Career> availableCareers = careerRepository.findAll();
        List<GovernmentScheme> relevantSchemes = filterRelevantSchemes(profile);
        List<College> affordableColleges = filterAffordableColleges(profile);

        if (geminiApiKey == null || geminiApiKey.isBlank() || "your_gemini_api_key".equals(geminiApiKey)) {
            return buildFallbackGuidance(student, profile, availableCareers, relevantSchemes,
                    "Deterministic Skill & Budget Engine (Set a real GEMINI_API_KEY for live Gemini AI reasoning)");
        }

        try {
            String prompt = buildGroundedPrompt(student, profile, availableCareers, relevantSchemes, affordableColleges);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + geminiModel + ":generateContent";

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                    "generationConfig", Map.of("responseMimeType", "application/json")
            );

            String responseBody = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("x-goog-api-key", geminiApiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            String jsonText = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asString();

            Map<String, Object> parsed = objectMapper.readValue(jsonText, Map.class);
            parsed.put("source", "Gemini AI (" + geminiModel + ") + Grounded DB Records");
            return parsed;

        } catch (Exception ex) {
            return buildFallbackGuidance(student, profile, availableCareers, relevantSchemes,
                    "Fallback Engine (AI temporarily unavailable: " + ex.getMessage() + ")");
        }
    }

    private List<GovernmentScheme> filterRelevantSchemes(StudentProfile profile) {
        String state = profile.getHomeState();
        return schemeRepository.findAll().stream()
                .filter(s -> state == null || state.isBlank()
                        || "ALL".equalsIgnoreCase(s.getApplicableState())
                        || s.getApplicableState().toLowerCase().contains(state.toLowerCase()))
                .limit(8)
                .collect(Collectors.toList());
    }

    private List<College> filterAffordableColleges(StudentProfile profile) {
        Integer budget = profile.getAnnualBudgetInr();
        return collegeRepository.findAll().stream()
                .filter(c -> budget == null || budget <= 0
                        || c.getAnnualTuitionFeeInr() == null
                        || c.getAnnualTuitionFeeInr() <= budget * 1.5)
                .limit(8)
                .collect(Collectors.toList());
    }

    private String buildGroundedPrompt(
            Student student, StudentProfile p, List<Career> careers,
            List<GovernmentScheme> schemes, List<College> colleges) {
        String existingSkills = student.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.joining(", "));

        String catalog = careers.stream()
                .map(c -> "- " + c.getTitle() + ": " + c.getDescription()
                        + " (Skills: " + c.getSkills().stream().map(Skill::getName).collect(Collectors.joining(", ")) + ")")
                .collect(Collectors.joining("\n"));

        String schemeCatalog = schemes.isEmpty() ? "None loaded" : schemes.stream()
                .map(s -> "- " + s.getName() + " [" + s.getLevel() + " / " + s.getApplicableState()
                        + "] | Benefit: " + s.getFinancialBenefit() + " | Portal: " + s.getOfficialWebsite())
                .collect(Collectors.joining("\n"));

        String collegeCatalog = colleges.isEmpty() ? "None loaded" : colleges.stream()
                .map(c -> "- " + c.getName() + " (" + c.getCity() + ", " + c.getInstitutionType()
                        + ") | Tuition: ₹" + c.getAnnualTuitionFeeInr() + "/yr | Exam: " + c.getEntranceExam())
                .collect(Collectors.joining("\n"));

        return """
                You are an expert Indian Student Career Counselor and Education Economist.
                Analyze this student's profile and return ONLY valid JSON matching the schema below.
                CRITICAL GROUNDING RULE: Only cite government schemes and colleges listed in the VERIFIED DATABASE RECORDS below. Do NOT invent fake scheme names, fake fee numbers, or unverified portal links. Keep salary figures realistic for India (INR LPA) with city/experience context.

                STUDENT PROFILE:
                - Name: %s
                - Age: %s
                - Current Qualification: %s
                - Stream: %s
                - Academic Score: %s
                - Preferred Subjects: %s
                - Interests & Passions: %s
                - Preferred Domains: %s
                - Primary Goal: %s
                - Home State / Preferred City: %s / %s
                - Annual Family Education Budget (INR): %s
                - Social Category: %s
                - Willing to Relocate: %s
                - Learning Mode: %s
                - Current Skills: %s

                VERIFIED CAREERS IN DATABASE:
                %s

                VERIFIED GOVERNMENT SCHEMES IN DATABASE:
                %s

                VERIFIED COLLEGES IN DATABASE:
                %s

                Return JSON with this exact structure:
                {
                  "studentSummary": "2-sentence empathetic summary of student strengths, constraints, and goal",
                  "recommendations": [
                    {
                      "careerTitle": "string",
                      "matchScore": 85,
                      "whySuitable": "clear explanation connecting interests, skills, and budget",
                      "qualificationsRequired": "e.g., B.Tech CSE / BCA / Diploma + Portfolio",
                      "salaryRangeIndia": "e.g., ₹4.5 - ₹8 LPA (Fresher, Hyderabad/Bengaluru), ₹14 - ₹25 LPA (5+ yrs)",
                      "industryDemand": "High / Growing - brief reason",
                      "keySkillsNeeded": ["skill1", "skill2", "skill3"],
                      "advantages": ["pro 1", "pro 2"],
                      "disadvantages": ["con 1", "con 2"],
                      "budgetFitNote": "reference matching verified schemes or colleges from the database above to fit the student's ₹ annual budget"
                    }
                  ]
                }
                Provide 4 diverse, realistic career recommendations tailored to the student's profile.
                """.formatted(
                student.getName(), p.getAge(), p.getCurrentQualification(), p.getStream(),
                p.getAcademicScore(), p.getPreferredSubjects(), p.getInterestsAndPassions(),
                p.getPreferredDomains(), p.getCareerGoalType(), p.getHomeState(),
                p.getPreferredCity(), p.getAnnualBudgetInr(), p.getSocialCategory(),
                p.getWillingToRelocate(), p.getLearningMode(),
                existingSkills.isEmpty() ? "None listed yet" : existingSkills,
                catalog, schemeCatalog, collegeCatalog
        );
    }

    private Map<String, Object> buildFallbackGuidance(
            Student student, StudentProfile profile, List<Career> careers,
            List<GovernmentScheme> schemes, String note) {
        Set<String> studentSkillNames = student.getSkills().stream()
                .map(s -> s.getName().toLowerCase())
                .collect(Collectors.toSet());

        String topSchemeHint = schemes.isEmpty()
                ? "NSP / State Fee Reimbursement portals"
                : schemes.stream().limit(2).map(GovernmentScheme::getName).collect(Collectors.joining(", "));

        List<Map<String, Object>> recs = new ArrayList<>();
        for (Career c : careers) {
            List<String> reqNames = c.getSkills().stream().map(Skill::getName).toList();
            long matched = reqNames.stream().filter(n -> studentSkillNames.contains(n.toLowerCase())).count();
            int score = reqNames.isEmpty() ? 60 : (int) Math.min(96, 48 + (matched * 48 / reqNames.size()));

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("careerTitle", c.getTitle());
            item.put("matchScore", score);
            item.put("whySuitable", c.getDescription() + (profile.getPreferredDomains() != null && !profile.getPreferredDomains().isBlank()
                    ? " Aligns with your interest in " + profile.getPreferredDomains() + "." : ""));
            item.put("qualificationsRequired", "10+2 / Polytechnic Diploma / Relevant Bachelor's Degree or Vocational Certification");
            item.put("salaryRangeIndia", "Estimated ₹3.5 – ₹8.5 LPA (Entry-level, Hyderabad/Bengaluru/Pune) | ₹12 – ₹24 LPA (5+ yrs)");
            item.put("industryDemand", "High & Growing across Indian IT, GCCs, and Digital Product firms");
            item.put("keySkillsNeeded", reqNames);
            item.put("advantages", List.of("Strong remote & hybrid opportunities", "Free official courses available on NPTEL & SWAYAM"));
            item.put("disadvantages", List.of("Requires continuous upskilling and hands-on portfolio projects"));
            item.put("budgetFitNote", profile.getAnnualBudgetInr() != null
                    ? "Fits within ₹" + profile.getAnnualBudgetInr() + "/yr via Government/State colleges or schemes like " + topSchemeHint + "."
                    : "Enter your annual family budget in the Profile tab to match schemes such as " + topSchemeHint + ".");
            recs.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("source", note);
        result.put("studentSummary", "Personalized career analysis for " + student.getName()
                + (profile.getCurrentQualification() != null ? " (" + profile.getCurrentQualification() + ")" : "")
                + " balancing academic background, skill readiness, and family budget.");
        result.put("recommendations", recs);
        return result;
    }
}
