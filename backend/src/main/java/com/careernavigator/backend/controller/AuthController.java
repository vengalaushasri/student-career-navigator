package com.careernavigator.backend.controller;

import com.careernavigator.backend.model.AppUser;
import com.careernavigator.backend.model.Student;
import com.careernavigator.backend.repository.AppUserRepository;
import com.careernavigator.backend.repository.StudentRepository;
import com.careernavigator.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AppUserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AppUserRepository userRepository,
                          StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String fullName = body.getOrDefault("fullName", "").trim();
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        String role = body.getOrDefault("role", "STUDENT").trim().toUpperCase();

        if (fullName.isEmpty() || email.isEmpty() || password.length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password (min 4 chars) are required"));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email is already registered"));
        }
        if (!role.equals("ADMIN")) {
            role = "STUDENT";
        }

        // Link or auto-create a Student record so the student dashboard works seamlessly
        Student linkedStudent = studentRepository.findAll().stream()
                .filter(s -> s.getEmail() != null && s.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setName(fullName);
                    s.setEmail(email);
                    return studentRepository.save(s);
                });

        AppUser user = new AppUser(
                fullName,
                email,
                passwordEncoder.encode(password),
                role,
                linkedStudent.getId()
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getStudentId());
        return ResponseEntity.ok(buildAuthResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
        }

        AppUser user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getStudentId());
        return ResponseEntity.ok(buildAuthResponse(token, user));
    }

    private Map<String, Object> buildAuthResponse(String token, AppUser user) {
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("fullName", user.getFullName());
        res.put("email", user.getEmail());
        res.put("role", user.getRole());
        res.put("studentId", user.getStudentId());
        return res;
    }
}
