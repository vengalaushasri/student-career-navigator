package com.careernavigator.backend.config;

import com.careernavigator.backend.model.*;
import com.careernavigator.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class PlatformDataSeeder implements CommandLineRunner {

    private final EducationPathwayRepository pathwayRepository;
    private final GovernmentSchemeRepository schemeRepository;
    private final CollegeRepository collegeRepository;
    private final LearningResourceRepository resourceRepository;
    private final StudentRepository studentRepository;
    private final StudentProfileRepository profileRepository;

    public PlatformDataSeeder(
            EducationPathwayRepository pathwayRepository,
            GovernmentSchemeRepository schemeRepository,
            CollegeRepository collegeRepository,
            LearningResourceRepository resourceRepository,
            StudentRepository studentRepository,
            StudentProfileRepository profileRepository) {
        this.pathwayRepository = pathwayRepository;
        this.schemeRepository = schemeRepository;
        this.collegeRepository = collegeRepository;
        this.resourceRepository = resourceRepository;
        this.studentRepository = studentRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public void run(String... args) {
        seedProfiles();
        seedPathways();
        seedSchemes();
        seedColleges();
        seedResources();
    }

    private void seedProfiles() {
        studentRepository.findAll().forEach(student -> {
            if (profileRepository.findByStudentId(student.getId()).isEmpty()) {
                StudentProfile p = new StudentProfile();
                p.setStudent(student);
                p.setAge(19);
                p.setCurrentQualification("Undergraduate");
                p.setStream("Computer Science (B.Tech)");
                p.setBoardOrUniversity("JNTUH");
                p.setAcademicScore("8.4 CGPA");
                p.setPreferredSubjects("Data Structures, Java, Databases");
                p.setInterestsAndPassions("Building practical full-stack web apps and solving real-world problems");
                p.setPreferredDomains("Software Engineering, Data Analytics");
                p.setCareerGoalType("PRIVATE_JOB");
                p.setHomeState("Telangana");
                p.setPreferredCity("Hyderabad");
                p.setAnnualBudgetInr(60000);
                p.setWillingToRelocate(true);
                p.setLearningMode("HYBRID");
                profileRepository.save(p);
            }
        });
    }

    private void seedPathways() {
        if (pathwayRepository.count() > 0) return;

        EducationPathway p1 = new EducationPathway();
        p1.setCareerDomain("Engineering & Technology");
        p1.setStartingStage("AFTER_10TH");
        p1.setPathwayType("POLYTECHNIC_DIPLOMA");
        p1.setTitle("3-Year Polytechnic Diploma in Computer Engineering + Lateral Entry B.Tech");
        p1.setDuration("3 Years Diploma (+ 3 Years Lateral B.Tech optional)");
        p1.setEligibilityCriteria("Passed 10th Standard (SSC) with Mathematics");
        p1.setAdmissionProcess("State Polytechnic Entrance Test (e.g., TS POLYCET)");
        p1.setRequiredSubjects("Mathematics, Physics, Chemistry");
        p1.setApproxAnnualTuitionInr(5000);
        p1.setApproxHostelLivingInr(30000);
        p1.setApproxBooksExamInr(4000);
        p1.setIsEstimatedFee(true);
        p1.setFurtherStudyOptions("Direct 2nd-year B.Tech admission via ECET");
        p1.setEmploymentOpportunities("Junior Software Developer, Network Technician, Lab Assistant, PSU Technician");
        p1.setPros("Very low fee in Govt Polytechnics; early job readiness after 3 years; skips Intermediate");
        p1.setCons("Requires ECET exam to enter B.Tech 2nd year");
        p1.setSourceReference("State Board of Technical Education (SBTET Telangana)");
        p1.setLastVerifiedDate("2026-11-01");

        EducationPathway p2 = new EducationPathway();
        p2.setCareerDomain("Engineering & Technology");
        p2.setStartingStage("AFTER_12TH");
        p2.setPathwayType("INTER_DEGREE");
        p2.setTitle("Intermediate (MPC) + 4-Year B.Tech / B.E. in Computer Science");
        p2.setDuration("2 Years Inter + 4 Years B.Tech");
        p2.setEligibilityCriteria("10+2 with Physics, Chemistry, Mathematics (minimum 45%-75% depending on institute)");
        p2.setAdmissionProcess("TG EAPCET / JEE Main / JoSAA Counseling");
        p2.setRequiredSubjects("Mathematics, Physics, Chemistry");
        p2.setApproxAnnualTuitionInr(45000);
        p2.setApproxHostelLivingInr(45000);
        p2.setApproxBooksExamInr(6000);
        p2.setIsEstimatedFee(true);
        p2.setFurtherStudyOptions("M.Tech (GATE), MS abroad, MBA (CAT)");
        p2.setEmploymentOpportunities("Software Engineer, Data Scientist, Cloud Engineer, Product Manager");
        p2.setPros("Highest campus placement reach and eligibility for GATE / global MS programs");
        p2.setCons("Private college fees can be high without rank-based fee reimbursement");
        p2.setSourceReference("AICTE Approval Process Handbook & TGCHE");
        p2.setLastVerifiedDate("2026-11-01");

        EducationPathway p3 = new EducationPathway();
        p3.setCareerDomain("Software & IT");
        p3.setStartingStage("AFTER_12TH");
        p3.setPathwayType("INTER_DEGREE");
        p3.setTitle("3-Year BCA / B.Sc. Computer Science + Online Skill Certifications");
        p3.setDuration("3 Years");
        p3.setEligibilityCriteria("10+2 in any stream (Mathematics/Computer Science preferred)");
        p3.setAdmissionProcess("Merit-based / DOST Degree Online Services Telangana / CUET");
        p3.setRequiredSubjects("Mathematics / Statistics / Computer Applications");
        p3.setApproxAnnualTuitionInr(12000);
        p3.setApproxHostelLivingInr(32000);
        p3.setApproxBooksExamInr(3500);
        p3.setIsEstimatedFee(true);
        p3.setFurtherStudyOptions("MCA (NIMCET / TG ICET), M.Sc. Data Science");
        p3.setEmploymentOpportunities("Web Developer, QA Engineer, Technical Analyst, IT Support Specialist");
        p3.setPros("1 year shorter and significantly more affordable than private B.Tech");
        p3.setCons("Often requires MCA or strong portfolio to match B.Tech starting packages");
        p3.setSourceReference("UGC & DOST Telangana Portal");
        p3.setLastVerifiedDate("2026-11-01");

        EducationPathway p4 = new EducationPathway();
        p4.setCareerDomain("Vocational & Technical Trades");
        p4.setStartingStage("AFTER_10TH");
        p4.setPathwayType("ITI_VOCATIONAL");
        p4.setTitle("ITI Trade Certification (COPA / Electrician / Electronics Mechanic) + Apprenticeship");
        p4.setDuration("1 to 2 Years");
        p4.setEligibilityCriteria("Passed 10th Standard");
        p4.setAdmissionProcess("State ITI Merit Counseling (NCVT / SCVT)");
        p4.setRequiredSubjects("General Science & Mathematics");
        p4.setApproxAnnualTuitionInr(2000);
        p4.setApproxHostelLivingInr(24000);
        p4.setApproxBooksExamInr(2000);
        p4.setIsEstimatedFee(true);
        p4.setFurtherStudyOptions("Lateral entry to 2nd-year Polytechnic Diploma");
        p4.setEmploymentOpportunities("Computer Operator (COPA), Railways / PSU Technician, Paid NAPS Apprenticeship");
        p4.setPros("Near-zero tuition; fastest path to paid apprenticeship and PSU technical exams");
        p4.setCons("Narrower initial role scope unless followed by Diploma/Degree");
        p4.setSourceReference("Directorate General of Training (DGT) & Skill India");
        p4.setLastVerifiedDate("2026-11-01");

        pathwayRepository.saveAll(List.of(p1, p2, p3, p4));
    }

    private void seedSchemes() {
        if (schemeRepository.count() > 0) return;

        GovernmentScheme s1 = new GovernmentScheme();
        s1.setName("National Scholarship Portal (NSP) – Central Sector Scheme of Scholarships (PM-USP)");
        s1.setDepartment("Department of Higher Education, Ministry of Education, Govt. of India");
        s1.setLevel("CENTRAL");
        s1.setApplicableState("ALL");
        s1.setTargetAudience("Students above 80th percentile in Class 12 pursuing regular undergraduate/postgraduate degrees");
        s1.setEligibilityRequirements("Above 80th percentile in Class XII board exam; regular full-time degree course; annual family income within official limit (₹4.5 LPA as per guidelines); not availing other scholarships.");
        s1.setMaxFamilyIncomeInr(450000);
        s1.setFinancialBenefit("₹12,000/year for first 3 years of graduation; ₹20,000/year for 4th & 5th year / PG (Direct Benefit Transfer).");
        s1.setDocumentsRequired("Aadhaar, Class 12 Marksheet, Income Certificate, Bank Passbook (Aadhaar-seeded), Bonafide Student Certificate");
        s1.setApplicationProcedure("Apply online via National Scholarship Portal (scholarships.gov.in) using OTR (One-Time Registration) and verify via institute.");
        s1.setDeadlineInfo("Check scholarships.gov.in annually (typically August – October)");
        s1.setOfficialWebsite("https://scholarships.gov.in");
        s1.setStatus("Active (Verify annual window on portal)");
        s1.setLastVerifiedDate("2026-11-01");

        GovernmentScheme s2 = new GovernmentScheme();
        s2.setName("Telangana ePASS – Post-Matric Scholarship & Reimbursement of Tuition Fee (RTF)");
        s2.setDepartment("Backward Classes / SC / ST / Minority Welfare Departments, Govt. of Telangana");
        s2.setLevel("STATE");
        s2.setApplicableState("Telangana");
        s2.setTargetAudience("Telangana domicile students admitted via convener quota in Intermediate, Diploma, Degree, B.Tech, PG");
        s2.setEligibilityRequirements("Telangana resident; convener quota admission; minimum 75% attendance; family annual income within state-prescribed slabs (₹1.5L–₹2.0L depending on category/area).");
        s2.setMaxFamilyIncomeInr(200000);
        s2.setFinancialBenefit("Full or partial Tuition Fee Reimbursement (RTF) directly to college + Maintenance Allowance (MTF) to student.");
        s2.setDocumentsRequired("Aadhaar, Caste Certificate, MeeSeva Income Certificate, CET Allotment Order, Previous Year Marks Memo, Bank Account");
        s2.setApplicationProcedure("Register online at telanganaepass.cgg.gov.in and submit biometric verification at college.");
        s2.setDeadlineInfo("Check telanganaepass.cgg.gov.in per academic year");
        s2.setOfficialWebsite("https://telanganaepass.cgg.gov.in");
        s2.setStatus("Active (Verify academic year schedule on portal)");
        s2.setLastVerifiedDate("2026-11-01");

        GovernmentScheme s3 = new GovernmentScheme();
        s3.setName("AICTE Pragati Scholarship Scheme for Girl Students");
        s3.setDepartment("All India Council for Technical Education (AICTE), Ministry of Education");
        s3.setLevel("CENTRAL");
        s3.setApplicableState("ALL");
        s3.setTargetAudience("Girl students admitted to 1st year of AICTE-approved Diploma or Degree technical courses");
        s3.setEligibilityRequirements("Girl student admitted to 1st year (or 2nd year lateral entry) of AICTE-approved Degree/Diploma; up to 2 girls per family; annual family income below ₹8,00,000.");
        s3.setMaxFamilyIncomeInr(800000);
        s3.setFinancialBenefit("₹50,000 per annum for every year of study (up to 4 years for Degree, 3 years for Diploma).");
        s3.setDocumentsRequired("Aadhaar, 10th/12th Marksheets, Income Certificate, Admission Letter, Bank Passbook");
        s3.setApplicationProcedure("Apply online through National Scholarship Portal (scholarships.gov.in) under AICTE schemes.");
        s3.setDeadlineInfo("Check scholarships.gov.in / aicte-india.org annually");
        s3.setOfficialWebsite("https://www.aicte-india.org/schemes/students-development-schemes/Pragati");
        s3.setStatus("Active");
        s3.setLastVerifiedDate("2026-11-01");

        GovernmentScheme s4 = new GovernmentScheme();
        s4.setName("AICTE Saksham Scholarship Scheme for Differently-Abled Students");
        s4.setDepartment("All India Council for Technical Education (AICTE)");
        s4.setLevel("CENTRAL");
        s4.setApplicableState("ALL");
        s4.setTargetAudience("Specially-abled students (40% or more disability) in AICTE-approved Degree/Diploma institutions");
        s4.setEligibilityRequirements("40% or more disability certificate; admitted to 1st year (or lateral entry) of AICTE-approved technical course; family income below ₹8,00,000.");
        s4.setMaxFamilyIncomeInr(800000);
        s4.setFinancialBenefit("₹50,000 per annum for every year of study toward tuition, books, and assistive devices.");
        s4.setDocumentsRequired("Disability Certificate, Aadhaar, Income Certificate, Admission Proof, Bank Passbook");
        s4.setApplicationProcedure("Apply online via National Scholarship Portal (scholarships.gov.in).");
        s4.setDeadlineInfo("Check scholarships.gov.in annually");
        s4.setOfficialWebsite("https://www.aicte-india.org/schemes/students-development-schemes/Saksham");
        s4.setStatus("Active");
        s4.setLastVerifiedDate("2026-11-01");

        schemeRepository.saveAll(List.of(s1, s2, s3, s4));
    }

    private void seedColleges() {
        if (collegeRepository.count() > 0) return;

        College c1 = new College();
        c1.setName("JNTUH University College of Engineering, Science and Technology Hyderabad");
        c1.setCity("Hyderabad");
        c1.setDistrict("Medchal-Malkajgiri");
        c1.setState("Telangana");
        c1.setAddress("Kukatpally, Hyderabad, Telangana 500085");
        c1.setInstitutionType("GOVERNMENT");
        c1.setCoursesOffered("B.Tech, M.Tech, Integrated Dual Degree");
        c1.setSpecializations("Computer Science & Engineering, AI & ML, ECE, EEE, Mechanical");
        c1.setAnnualTuitionFeeInr(35000);
        c1.setAnnualHostelFoodFeeInr(28000);
        c1.setOtherAnnualFeeInr(5000);
        c1.setFeeIsEstimated(true);
        c1.setEntranceExam("TG EAPCET");
        c1.setAccreditation("UGC Autonomous, NAAC A+, AICTE Approved");
        c1.setHostelAvailable(true);
        c1.setPlacementInfo("Strong public university placement cell; verify latest NIRF & campus placement report on official site.");
        c1.setOfficialWebsite("https://jntuhceh.ac.in");
        c1.setMapsUrl("https://maps.google.com/?q=JNTUH+College+of+Engineering+Hyderabad");
        c1.setContactInfo("https://jntuhceh.ac.in");
        c1.setSourceReference("JNTUH Official Portal & TGCHE");
        c1.setLastVerifiedDate("2026-11-01");

        College c2 = new College();
        c2.setName("University College of Engineering, Osmania University");
        c2.setCity("Hyderabad");
        c2.setDistrict("Hyderabad");
        c2.setState("Telangana");
        c2.setAddress("Amberpet, Hyderabad, Telangana 500007");
        c2.setInstitutionType("GOVERNMENT");
        c2.setCoursesOffered("B.E., M.E., MCA");
        c2.setSpecializations("Computer Science, Artificial Intelligence, Electronics, Civil, Biomedical");
        c2.setAnnualTuitionFeeInr(32000);
        c2.setAnnualHostelFoodFeeInr(26000);
        c2.setOtherAnnualFeeInr(4500);
        c2.setFeeIsEstimated(true);
        c2.setEntranceExam("TG EAPCET");
        c2.setAccreditation("NAAC A+, Autonomous, AICTE Approved");
        c2.setHostelAvailable(true);
        c2.setPlacementInfo("Consistent IT and core engineering recruiters; check official UCEOU placement brochure.");
        c2.setOfficialWebsite("https://www.uceou.edu");
        c2.setMapsUrl("https://maps.google.com/?q=University+College+of+Engineering+Osmania+University+Hyderabad");
        c2.setContactInfo("https://www.uceou.edu");
        c2.setSourceReference("UCEOU Official Website");
        c2.setLastVerifiedDate("2026-11-01");

        College c3 = new College();
        c3.setName("Kakatiya Institute of Technology & Science (KITSW)");
        c3.setCity("Warangal");
        c3.setDistrict("Hanumakonda");
        c3.setState("Telangana");
        c3.setAddress("Opp. Yerragattu Gutta, Bheemaram, Hasanparthy, Warangal, Telangana 506015");
        c3.setInstitutionType("PRIVATE");
        c3.setCoursesOffered("B.Tech, M.Tech, MBA");
        c3.setSpecializations("CSE, CSE (AI & ML), CSE (Data Science), IT, ECE");
        c3.setAnnualTuitionFeeInr(125000);
        c3.setAnnualHostelFoodFeeInr(65000);
        c3.setOtherAnnualFeeInr(8000);
        c3.setFeeIsEstimated(true);
        c3.setEntranceExam("TG EAPCET (Eligible for Telangana ePASS fee reimbursement for eligible students)");
        c3.setAccreditation("UGC Autonomous, NAAC A, NBA Accredited, AICTE Approved");
        c3.setHostelAvailable(true);
        c3.setPlacementInfo("Established Warangal engineering institute with active campus placements; check official site for branch-wise stats.");
        c3.setOfficialWebsite("https://www.kitsw.ac.in");
        c3.setMapsUrl("https://maps.google.com/?q=Kakatiya+Institute+of+Technology+and+Science+Warangal");
        c3.setContactInfo("https://www.kitsw.ac.in");
        c3.setSourceReference("KITSW & TAFRC Fee Notification");
        c3.setLastVerifiedDate("2026-11-01");

        College c4 = new College();
        c4.setName("Government Polytechnic, Warangal");
        c4.setCity("Warangal");
        c4.setDistrict("Warangal");
        c4.setState("Telangana");
        c4.setAddress("Near Bhadrakali Bund, Warangal, Telangana 506007");
        c4.setInstitutionType("GOVERNMENT");
        c4.setCoursesOffered("3-Year Engineering Diploma");
        c4.setSpecializations("Computer Engineering, Electronics & Communication, Electrical, Mechanical, Civil");
        c4.setAnnualTuitionFeeInr(4200);
        c4.setAnnualHostelFoodFeeInr(20000);
        c4.setOtherAnnualFeeInr(2500);
        c4.setFeeIsEstimated(true);
        c4.setEntranceExam("TS POLYCET");
        c4.setAccreditation("SBTET Telangana & AICTE Approved");
        c4.setHostelAvailable(true);
        c4.setPlacementInfo("Ultra-affordable government polytechnic enabling direct ECET lateral entry to B.Tech or PSU technician roles.");
        c4.setOfficialWebsite("https://polytechnicts.cgg.gov.in");
        c4.setMapsUrl("https://maps.google.com/?q=Government+Polytechnic+Warangal");
        c4.setContactInfo("https://polytechnicts.cgg.gov.in");
        c4.setSourceReference("DTE / SBTET Telangana");
        c4.setLastVerifiedDate("2026-11-01");

        collegeRepository.saveAll(List.of(c1, c2, c3, c4));
    }

    private void seedResources() {
        if (resourceRepository.count() > 0) return;

        LearningResource r1 = new LearningResource();
        r1.setTitle("NPTEL – Programming in Java (IIT Kharagpur)");
        r1.setProvider("NPTEL (Ministry of Education)");
        r1.setDomain("Software Engineering");
        r1.setSkillTag("Java");
        r1.setIsFree(true);
        r1.setCostInr(0);
        r1.setDifficultyLevel("Beginner to Intermediate");
        r1.setEstimatedDuration("12 Weeks");
        r1.setProjectIdea("Build a multi-user Library & Scholarship Eligibility CLI application");
        r1.setResourceUrl("https://nptel.ac.in");
        r1.setLastVerifiedDate("2026-11-01");

        LearningResource r2 = new LearningResource();
        r2.setTitle("SWAYAM – Data Base Management System");
        r2.setProvider("SWAYAM (Govt. of India)");
        r2.setDomain("Backend & Data");
        r2.setSkillTag("SQL & PostgreSQL");
        r2.setIsFree(true);
        r2.setCostInr(0);
        r2.setDifficultyLevel("Beginner to Intermediate");
        r2.setEstimatedDuration("8 Weeks");
        r2.setProjectIdea("Design a normalized PostgreSQL schema for Indian College Admissions & Fees");
        r2.setResourceUrl("https://swayam.gov.in");
        r2.setLastVerifiedDate("2026-11-01");

        LearningResource r3 = new LearningResource();
        r3.setTitle("Skill India Digital Hub – Free AI, Cloud & Web Courses");
        r3.setProvider("Skill India (MSDE, Govt. of India)");
        r3.setDomain("Full-Stack & Digital Skills");
        r3.setSkillTag("Web & Cloud");
        r3.setIsFree(true);
        r3.setCostInr(0);
        r3.setDifficultyLevel("Beginner");
        r3.setEstimatedDuration("4 to 6 Weeks");
        r3.setProjectIdea("Create a responsive student portfolio and career comparison web page");
        r3.setResourceUrl("https://www.skillindiadigital.gov.in");
        r3.setLastVerifiedDate("2026-11-01");

        LearningResource r4 = new LearningResource();
        r4.setTitle("NPTEL – Python for Data Science (IIT Madras)");
        r4.setProvider("NPTEL (Ministry of Education)");
        r4.setDomain("Data Analytics & AI");
        r4.setSkillTag("Python");
        r4.setIsFree(true);
        r4.setCostInr(0);
        r4.setDifficultyLevel("Beginner");
        r4.setEstimatedDuration("4 Weeks");
        r4.setProjectIdea("Analyze Indian state-wise literacy and higher-education fee datasets with Pandas");
        r4.setResourceUrl("https://nptel.ac.in");
        r4.setLastVerifiedDate("2026-11-01");

        resourceRepository.saveAll(List.of(r1, r2, r3, r4));
    }
}
