package com.careernavigator.backend.dto;

import com.careernavigator.backend.model.Career;
import com.careernavigator.backend.model.Skill;

import java.util.List;

public record CareerMatch(
        Career career,
        List<Skill> matchedSkills,
        List<Skill> missingSkills,
        int matchPercent
) {
}