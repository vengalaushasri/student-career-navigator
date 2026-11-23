package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.EducationPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationPathwayRepository extends JpaRepository<EducationPathway, Long> {
    List<EducationPathway> findByStartingStageIgnoreCase(String startingStage);
}
