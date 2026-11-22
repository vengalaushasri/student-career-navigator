package com.careernavigator.backend.controller;

import com.careernavigator.backend.model.Career;
import com.careernavigator.backend.model.Skill;
import com.careernavigator.backend.repository.CareerRepository;
import com.careernavigator.backend.repository.SkillRepository;
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
@RequestMapping("/api/careers")
@CrossOrigin(origins = "http://localhost:5173")
public class CareerController {

    private final CareerRepository careerRepository;
    private final SkillRepository skillRepository;

    public CareerController(CareerRepository careerRepository, SkillRepository skillRepository) {
        this.careerRepository = careerRepository;
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }

    @PostMapping
    public Career addCareer(@RequestBody Career career) {
        return careerRepository.save(career);
    }

    @PutMapping("/{id}")
    public Career updateCareer(@PathVariable Long id, @RequestBody Career updated) {
        Career career = findCareer(id);
        career.setTitle(updated.getTitle());
        career.setDescription(updated.getDescription());
        career.setCategory(updated.getCategory());
        return careerRepository.save(career);
    }

    @DeleteMapping("/{id}")
    public void deleteCareer(@PathVariable Long id) {
        careerRepository.deleteById(id);
    }

    @PutMapping("/{careerId}/skills/{skillId}")
    public Career addSkillToCareer(@PathVariable Long careerId, @PathVariable Long skillId) {
        Career career = findCareer(careerId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));
        career.getSkills().add(skill);
        return careerRepository.save(career);
    }

    @DeleteMapping("/{careerId}/skills/{skillId}")
    public Career removeSkillFromCareer(@PathVariable Long careerId, @PathVariable Long skillId) {
        Career career = findCareer(careerId);
        career.getSkills().removeIf(skill -> skill.getId().equals(skillId));
        return careerRepository.save(career);
    }

    private Career findCareer(Long id) {
        return careerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Career not found"));
    }
}