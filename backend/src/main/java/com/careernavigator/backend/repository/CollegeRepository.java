package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.College;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollegeRepository extends JpaRepository<College, Long> {
}
