package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
}
