package com.careernavigator.backend.controller;

import com.careernavigator.backend.model.*;
import com.careernavigator.backend.repository.*;
import com.careernavigator.backend.security.OwnershipGuard;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/navigator")
public class NavigatorController {

    private final EducationPathwayRepository pathwayRepository;
    private final GovernmentSchemeRepository schemeRepository;
    private final CollegeRepository collegeRepository;
    private final LearningResourceRepository resourceRepository;
    private final RoadmapStepRepository roadmapRepository;
    private final StudentRepository studentRepository;
    private final StudentProfileRepository profileRepository;
    private final OwnershipGuard ownershipGuard;

    public NavigatorController(
            EducationPathwayRepository pathwayRepository,
            GovernmentSchemeRepository schemeRepository,
            CollegeRepository collegeRepository,
            LearningResourceRepository resourceRepository,
            RoadmapStepRepository roadmapRepository,
            StudentRepository studentRepository,
            StudentProfileRepository profileRepository,
            OwnershipGuard ownershipGuard) {
        this.pathwayRepository = pathwayRepository;
        this.schemeRepository = schemeRepository;
        this.collegeRepository = collegeRepository;
        this.resourceRepository = resourceRepository;
        this.roadmapRepository = roadmapRepository;
        this.studentRepository = studentRepository;
        this.profileRepository = profileRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @GetMapping("/pathways")
    public List<EducationPathway> getPathways(@RequestParam(required = false) String stage) {
        if (stage != null && !stage.isBlank() && !stage.equalsIgnoreCase("ALL")) {
            return pathwayRepository.findByStartingStageIgnoreCase(stage);
        }
        return pathwayRepository.findAll();
    }

    @GetMapping("/schemes")
    public List<GovernmentScheme> getSchemes(@RequestParam(required = false) String state) {
        List<GovernmentScheme> all = schemeRepository.findAll();
        if (state == null || state.isBlank() || state.equalsIgnoreCase("ALL")) {
            return all;
        }
        return all.stream()
                .filter(s -> "ALL".equalsIgnoreCase(s.getApplicableState())
                        || s.getApplicableState().toLowerCase().contains(state.toLowerCase()))
                .collect(Collectors.toList());
    }

    @GetMapping("/colleges")
    public List<College> getColleges(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer maxBudget) {
        return collegeRepository.findAll().stream()
                .filter(c -> city == null || city.isBlank()
                        || c.getCity().toLowerCase().contains(city.toLowerCase())
                        || c.getState().toLowerCase().contains(city.toLowerCase()))
                .filter(c -> type == null || type.isBlank() || type.equalsIgnoreCase("ALL")
                        || c.getInstitutionType().equalsIgnoreCase(type))
                .filter(c -> maxBudget == null || maxBudget <= 0
                        || (c.getAnnualTuitionFeeInr() != null && c.getAnnualTuitionFeeInr() <= maxBudget))
                .collect(Collectors.toList());
    }

    @GetMapping("/resources")
    public List<LearningResource> getResources(@RequestParam(required = false) Boolean freeOnly) {
        List<LearningResource> all = resourceRepository.findAll();
        if (Boolean.TRUE.equals(freeOnly)) {
            return all.stream().filter(r -> Boolean.TRUE.equals(r.getIsFree())).collect(Collectors.toList());
        }
        return all;
    }

    @GetMapping("/budget-analysis/{studentId}")
    public ResponseEntity<Map<String, Object>> analyzeBudget(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "false") boolean includeHostel) {
        ownershipGuard.verifyStudentAccess(studentId);
        StudentProfile profile = profileRepository.findByStudentId(studentId).orElse(new StudentProfile());
        int studentBudget = profile.getAnnualBudgetInr() != null ? profile.getAnnualBudgetInr() : 50000;

        List<Map<String, Object>> collegeEvaluations = new ArrayList<>();
        for (College c : collegeRepository.findAll()) {
            int tuition = c.getAnnualTuitionFeeInr() != null ? c.getAnnualTuitionFeeInr() : 0;
            int hostel = includeHostel && c.getAnnualHostelFoodFeeInr() != null ? c.getAnnualHostelFoodFeeInr() : 0;
            int other = c.getOtherAnnualFeeInr() != null ? c.getOtherAnnualFeeInr() : 0;
            int totalAnnual = tuition + hostel + other;
            int gap = totalAnnual - studentBudget;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("collegeId", c.getId());
            row.put("collegeName", c.getName());
            row.put("city", c.getCity());
            row.put("institutionType", c.getInstitutionType());
            row.put("tuitionFee", tuition);
            row.put("hostelFoodFee", hostel);
            row.put("booksExamTransportFee", other);
            row.put("totalAnnualCost", totalAnnual);
            row.put("studentBudget", studentBudget);
            row.put("withinBudget", gap <= 0);
            row.put("financialGap", Math.max(0, gap));
            row.put("feeIsEstimated", c.getFeeIsEstimated());
            row.put("recommendation", gap <= 0
                    ? "Fits within your annual family budget."
                    : "Exceeds budget by ₹" + gap + "/yr. Explore state fee reimbursement (e.g., Telangana ePASS / NSP) or Government institution alternatives.");
            collegeEvaluations.add(row);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("studentAnnualBudgetInr", studentBudget);
        response.put("includeHostel", includeHostel);
        response.put("evaluations", collegeEvaluations);
        response.put("matchingSchemesCount", schemeRepository.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/roadmap/{studentId}")
    public List<RoadmapStep> getStudentRoadmap(@PathVariable Long studentId) {
        ownershipGuard.verifyStudentAccess(studentId);
        return roadmapRepository.findByStudentIdOrderByStepOrderAsc(studentId);
    }

    @PostMapping("/roadmap/{studentId}/generate")
    @Transactional
    public List<RoadmapStep> generateRoadmap(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "Full-Stack Software Developer") String career) {
        ownershipGuard.verifyStudentAccess(studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        roadmapRepository.deleteByStudentId(studentId);

        List<RoadmapStep> steps = buildTemplateRoadmap(student, career);
        return roadmapRepository.saveAll(steps);
    }

    @PatchMapping("/roadmap/step/{stepId}/status")
    public ResponseEntity<RoadmapStep> updateStepStatus(
            @PathVariable Long stepId,
            @RequestParam String status) {
        RoadmapStep step = roadmapRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("Step not found"));
        ownershipGuard.verifyStudentAccess(step.getStudent().getId());
        step.setStatus(status);
        return ResponseEntity.ok(roadmapRepository.save(step));
    }

    private List<RoadmapStep> buildTemplateRoadmap(Student student, String career) {
        String lower = career.toLowerCase();
        List<RoadmapStep> list = new ArrayList<>();

        if (lower.contains("data")) {
            list.add(createStep(student, career, 1, "Phase 1: Mathematics & Excel Foundations",
                    "Master descriptive statistics, probability, Excel pivot tables, VLOOKUP/XLOOKUP, and data cleaning.",
                    "3 Weeks", "NPTEL – Business Analytics & Data Mining", "https://nptel.ac.in",
                    "Clean and analyze an Indian State Education & Budget dataset in Excel", "COMPLETED"));
            list.add(createStep(student, career, 2, "Phase 2: SQL & Relational Databases",
                    "Write complex JOINs, GROUP BY aggregations, subqueries, and window functions in PostgreSQL.",
                    "4 Weeks", "SWAYAM – Database Management System", "https://swayam.gov.in",
                    "Query a 10,000-row college admissions & placement database", "IN_PROGRESS"));
            list.add(createStep(student, career, 3, "Phase 3: Python for Data Analysis",
                    "Learn NumPy, Pandas, Matplotlib, and Seaborn to automate exploratory data analysis.",
                    "5 Weeks", "NPTEL – Python for Data Science", "https://nptel.ac.in",
                    "Build an automated scholarship eligibility & fee trend notebook", "NOT_STARTED"));
            list.add(createStep(student, career, 4, "Phase 4: BI Dashboards & Portfolio",
                    "Create interactive dashboards in Power BI / Tableau and publish 3 end-to-end case studies on GitHub.",
                    "4 Weeks", "Skill India Digital Hub – Data Analytics", "https://www.skillindiadigital.gov.in",
                    "Interactive Indian Higher Education Affordability Dashboard", "NOT_STARTED"));
        } else {
            list.add(createStep(student, career, 1, "Phase 1: Programming & Problem Solving Core",
                    "Master core Java / Python syntax, OOP principles, Git version control, and basic data structures.",
                    "4 Weeks", "NPTEL – Programming in Java", "https://nptel.ac.in",
                    "CLI Student Budget & Scholarship Calculator in Java", "COMPLETED"));
            list.add(createStep(student, career, 2, "Phase 2: Backend APIs & PostgreSQL",
                    "Build RESTful APIs with Spring Boot, JPA/Hibernate, input validation, and relational schemas.",
                    "5 Weeks", "SWAYAM – Modern Application Development", "https://swayam.gov.in",
                    "REST API for College & Scheme Discovery with filters", "IN_PROGRESS"));
            list.add(createStep(student, career, 3, "Phase 3: Modern Frontend with React",
                    "Build responsive UIs with React hooks, state management, REST integration, and clean UX.",
                    "4 Weeks", "Skill India Digital Hub – Web Development", "https://www.skillindiadigital.gov.in",
                    "Interactive Career & Fee Comparison Dashboard", "NOT_STARTED"));
            list.add(createStep(student, career, 4, "Phase 4: Cloud Deployment & Internship Prep",
                    "Containerize or deploy full-stack apps, document APIs in Postman, and practice DSA & system design.",
                    "4 Weeks", "AICTE Internship Portal", "https://internship.aicte-india.org",
                    "Deploy full-stack Student Career Navigator with live README", "NOT_STARTED"));
        }
        return list;
    }

    private RoadmapStep createStep(Student student, String career, int order, String title,
                                   String desc, String duration, String resTitle, String resUrl,
                                   String project, String status) {
        RoadmapStep s = new RoadmapStep();
        s.setStudent(student);
        s.setTargetCareer(career);
        s.setStepOrder(order);
        s.setPhaseTitle(title);
        s.setDescription(desc);
        s.setEstimatedDuration(duration);
        s.setFreeResourceTitle(resTitle);
        s.setFreeResourceUrl(resUrl);
        s.setPracticalProject(project);
        s.setStatus(status);
        return s;
    }
}
