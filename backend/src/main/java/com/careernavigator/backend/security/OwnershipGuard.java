package com.careernavigator.backend.security;

import com.careernavigator.backend.model.AppUser;
import com.careernavigator.backend.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class OwnershipGuard {

    private final AppUserRepository userRepository;

    public OwnershipGuard(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void verifyStudentAccess(Long targetStudentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return;
        }

        String email = auth.getName();
        AppUser currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (currentUser.getStudentId() == null || !currentUser.getStudentId().equals(targetStudentId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to another student's data");
        }
    }
}
