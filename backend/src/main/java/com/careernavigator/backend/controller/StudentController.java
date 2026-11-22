package com.careernavigator.backend.controller;

import com.careernavigator.backend.model.Skill;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.repository.SkillRepository;
import com.careernavigator.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentController(StudentRepository studentRepository, SkillRepository skillRepository) {
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable Long id) {
        return findStudent(id);
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    @PutMapping("/{studentId}/skills/{skillId}")
    public Student addSkillToStudent(@PathVariable Long studentId, @PathVariable Long skillId) {
        Student student = findStudent(studentId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));
        student.getSkills().add(skill);
        return studentRepository.save(student);
    }

    @DeleteMapping("/{studentId}/skills/{skillId}")
    public Student removeSkillFromStudent(@PathVariable Long studentId, @PathVariable Long skillId) {
        Student student = findStudent(studentId);
        student.getSkills().removeIf(skill -> skill.getId().equals(skillId));
        return studentRepository.save(student);
    }

    private Student findStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }
}