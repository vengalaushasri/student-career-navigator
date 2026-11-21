
package com.careernavigator.backend.repository;

import com.careernavigator.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
