package org.ibtissam.monprojetjee.controllers;

import org.ibtissam.monprojetjee.Repositories.UserRepository;
import org.ibtissam.monprojetjee.exception.ResourceNotFoundException;
import org.ibtissam.monprojetjee.models.User;
import org.ibtissam.monprojetjee.dto.AuthRequest;
import org.ibtissam.monprojetjee.dto.AuthResponse;
import org.ibtissam.monprojetjee.dto.SignupRequest;
import org.ibtissam.monprojetjee.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        AuthResponse authResponse = authService.signup(signupRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        // Vérifiez que l'utilisateur est bien récupéré
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authRequest.getEmail()));

        // Debug
        System.out.println("User trouvé : " + user.getEmail());

        return ResponseEntity.ok(authService.login(authRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/google")
    public void googleAuth(HttpServletResponse response) {
        String redirectUrl = authService.getGoogleAuthorizationUrl();
        response.setHeader("Location", redirectUrl);
        response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
    }

    @GetMapping("/google/callback")
    public void googleCallback(@RequestParam("code") String code, HttpServletResponse response) {
        AuthResponse authResponse = authService.processGoogleCallback(code);

        String redirectUrl = String.format("%s?token=%s",
                authService.getFrontendBaseUrl(),
                authResponse.getToken());

        response.setHeader("Location", redirectUrl);
        response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) {
        User user = authService.getCurrentUser(request);
        return ResponseEntity.ok(user);
    }
}
