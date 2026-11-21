package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.Career;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRepository extends JpaRepository<Career, Long> {
}