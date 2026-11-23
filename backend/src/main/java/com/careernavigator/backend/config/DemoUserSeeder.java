package com.careernavigator.backend.config;

import com.careernavigator.backend.model.AppUser;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.repository.AppUserRepository;
import com.careernavigator.backend.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class DemoUserSeeder implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoUserSeeder(AppUserRepository userRepository,
                          StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Student defaultStudent = studentRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setName("Demo Student");
                    s.setEmail("student@demo.com");
                    return studentRepository.save(s);
                });

        if (!userRepository.existsByEmail("student@demo.com")) {
            userRepository.save(new AppUser(
                    "Demo Student",
                    "student@demo.com",
                    passwordEncoder.encode("demo123"),
                    "STUDENT",
                    defaultStudent.getId()
            ));
        }

        if (!userRepository.existsByEmail("admin@demo.com")) {
            userRepository.save(new AppUser(
                    "Career Counselor (Admin)",
                    "admin@demo.com",
                    passwordEncoder.encode("admin123"),
                    "ADMIN",
                    defaultStudent.getId()
            ));
        }
    }
}
