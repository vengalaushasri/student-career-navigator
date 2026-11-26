package com.careernavigator.backend.controller;

import com.careernavigator.backend.model.Skill;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.model.StudentProfile;
import com.careernavigator.backend.repository.SkillRepository;
import com.careernavigator.backend.repository.StudentProfileRepository;
import com.careernavigator.backend.repository.StudentRepository;
import com.careernavigator.backend.security.OwnershipGuard;
import com.careernavigator.backend.service.GeminiCareerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final GeminiCareerService geminiCareerService;
    private final OwnershipGuard ownershipGuard;

    public StudentController(
            StudentRepository studentRepository,
            SkillRepository skillRepository,
            StudentProfileRepository studentProfileRepository,
            GeminiCareerService geminiCareerService,
            OwnershipGuard ownershipGuard) {
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.geminiCareerService = geminiCareerService;
        this.ownershipGuard = ownershipGuard;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        ownershipGuard.verifyStudentAccess(id);
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Student createStudent(@Valid @RequestBody Student student) {
        return studentRepository.save(student);
    }

    @PostMapping("/{studentId}/skills/{skillId}")
    public ResponseEntity<Student> addSkillToStudent(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {
        ownershipGuard.verifyStudentAccess(studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

        student.getSkills().add(skill);
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @DeleteMapping("/{studentId}/skills/{skillId}")
    public ResponseEntity<Student> removeSkillFromStudent(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {
        ownershipGuard.verifyStudentAccess(studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

        student.getSkills().remove(skill);
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<StudentProfile> getStudentProfile(@PathVariable Long id) {
        ownershipGuard.verifyStudentAccess(id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        StudentProfile profile = studentProfileRepository.findByStudentId(id)
                .orElseGet(() -> {
                    StudentProfile empty = new StudentProfile();
                    empty.setStudent(student);
                    return studentProfileRepository.save(empty);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<StudentProfile> updateStudentProfile(
            @PathVariable Long id,
            @Valid @RequestBody StudentProfile updated) {
        ownershipGuard.verifyStudentAccess(id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        StudentProfile profile = studentProfileRepository.findByStudentId(id)
                .orElseGet(() -> {
                    StudentProfile created = new StudentProfile();
                    created.setStudent(student);
                    return created;
                });

        profile.setAge(updated.getAge());
        profile.setCurrentQualification(updated.getCurrentQualification());
        profile.setBoardOrUniversity(updated.getBoardOrUniversity());
        profile.setAcademicScore(updated.getAcademicScore());
        profile.setStream(updated.getStream());
        profile.setPreferredSubjects(updated.getPreferredSubjects());
        profile.setInterestsAndPassions(updated.getInterestsAndPassions());
        profile.setPreferredDomains(updated.getPreferredDomains());
        profile.setCareerGoalType(updated.getCareerGoalType());
        profile.setHomeState(updated.getHomeState());
        profile.setPreferredCity(updated.getPreferredCity());
        profile.setAnnualBudgetInr(updated.getAnnualBudgetInr());
        profile.setWillingToRelocate(updated.getWillingToRelocate());
        profile.setLearningMode(updated.getLearningMode());
        profile.setSocialCategory(updated.getSocialCategory());
        profile.setAdditionalNotes(updated.getAdditionalNotes());

        return ResponseEntity.ok(studentProfileRepository.save(profile));
    }

    @GetMapping("/{id}/ai-guidance")
    public ResponseEntity<Map<String, Object>> getAiCareerGuidance(@PathVariable Long id) {
        ownershipGuard.verifyStudentAccess(id);
        return ResponseEntity.ok(geminiCareerService.generateCareerGuidance(id));
    }
}
