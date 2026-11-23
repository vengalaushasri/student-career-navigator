package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.RoadmapStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoadmapStepRepository extends JpaRepository<RoadmapStep, Long> {
    List<RoadmapStep> findByStudentIdOrderByStepOrderAsc(Long studentId);
    void deleteByStudentId(Long studentId);
}
