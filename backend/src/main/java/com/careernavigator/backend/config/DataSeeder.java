package com.careernavigator.backend.config;

import com.careernavigator.backend.model.Career;
import com.careernavigator.backend.model.Skill;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.repository.CareerRepository;
import com.careernavigator.backend.repository.SkillRepository;
import com.careernavigator.backend.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final CareerRepository careerRepository;
    private final StudentRepository studentRepository;

    public DataSeeder(SkillRepository skillRepository,
                      CareerRepository careerRepository,
                      StudentRepository studentRepository) {
        this.skillRepository = skillRepository;
        this.careerRepository = careerRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0 || careerRepository.count() > 0) {
            return;
        }

        // 1. Seed Skills
        Skill java = skillRepository.save(new Skill("Java", "Backend"));
        Skill springBoot = skillRepository.save(new Skill("Spring Boot", "Backend"));
        Skill python = skillRepository.save(new Skill("Python", "Programming"));
        Skill react = skillRepository.save(new Skill("React", "Frontend"));
        Skill javascript = skillRepository.save(new Skill("JavaScript", "Frontend"));
        Skill sql = skillRepository.save(new Skill("SQL", "Database"));
        Skill postgres = skillRepository.save(new Skill("PostgreSQL", "Database"));
        Skill docker = skillRepository.save(new Skill("Docker", "DevOps"));
        Skill aws = skillRepository.save(new Skill("AWS", "Cloud"));
        Skill git = skillRepository.save(new Skill("Git", "Tools"));
        Skill machineLearning = skillRepository.save(new Skill("Machine Learning", "AI/Data"));
        Skill dataAnalysis = skillRepository.save(new Skill("Data Analysis", "AI/Data"));
        Skill figma = skillRepository.save(new Skill("Figma", "Design"));
        Skill htmlCss = skillRepository.save(new Skill("HTML/CSS", "Frontend"));

        // 2. Seed Careers
        careerRepository.saveAll(List.of(
                new Career(
                        "Full-Stack Java Developer",
                        "Build end-to-end web applications using Spring Boot REST APIs and modern React frontends.",
                        "Software Engineering",
                        Set.of(java, springBoot, react, javascript, sql, git)
                ),
                new Career(
                        "Backend Microservices Engineer",
                        "Design scalable, high-throughput backend systems, databases, and cloud deployments.",
                        "Software Engineering",
                        Set.of(java, springBoot, postgres, docker, aws, git)
                ),
                new Career(
                        "Frontend Web Developer",
                        "Craft responsive, accessible user interfaces and interactive single-page web applications.",
                        "Web Development",
                        Set.of(react, javascript, htmlCss, figma, git)
                ),
                new Career(
                        "Data Scientist & ML Engineer",
                        "Analyze large datasets and train predictive machine learning models to solve business problems.",
                        "Data & AI",
                        Set.of(python, machineLearning, dataAnalysis, sql)
                ),
                new Career(
                        "Cloud & DevOps Engineer",
                        "Automate CI/CD pipelines, containerize workloads, and manage resilient cloud infrastructure.",
                        "Cloud & Infrastructure",
                        Set.of(docker, aws, python, git)
                )
        ));

        // 3. Seed Sample Students
        if (studentRepository.count() == 0) {
            studentRepository.saveAll(List.of(
                    new Student("Aarav Sharma", "aarav.sharma@example.com", Set.of(java, springBoot, sql, git)),
                    new Student("Priya Nair", "priya.nair@example.com", Set.of(react, javascript, htmlCss, figma))
            ));
        }

        System.out.println("Seeded initial skills, careers, and sample students.");
    }
}
