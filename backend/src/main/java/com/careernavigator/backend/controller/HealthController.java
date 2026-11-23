package com.careernavigator.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> rootStatus() {
        return Map.of(
                "service", "CareerNavigator API",
                "status", "UP",
                "docs", "Use /api/auth/login or /api/auth/register to authenticate"
        );
    }
}
