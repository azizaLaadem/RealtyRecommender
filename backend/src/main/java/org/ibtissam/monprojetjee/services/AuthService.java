package org.ibtissam.monprojetjee.services;

import jakarta.servlet.http.HttpServletRequest;
import org.ibtissam.monprojetjee.models.User;
import org.ibtissam.monprojetjee.Repositories.UserRepository;
import org.ibtissam.monprojetjee.dto.AuthRequest;
import org.ibtissam.monprojetjee.dto.AuthResponse;
import org.ibtissam.monprojetjee.dto.SignupRequest;
import org.ibtissam.monprojetjee.security.JwtTokenProvider;
import org.ibtissam.monprojetjee.exception.BadRequestException;
import org.ibtissam.monprojetjee.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;



@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.google.client.id}")
    private String googleClientId;

    @Value("${app.google.client.secret}")
    private String googleClientSecret;

    @Value("${app.google.redirect.uri}")
    private String googleRedirectUri;

    @Value("${app.frontend.baseUrl}")
    private String frontendBaseUrl;

    public AuthResponse signup(SignupRequest signupRequest) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        // Créer un nouvel utilisateur
        User user = new User();
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setProvider("local");

        User savedUser = userRepository.save(user);

        // Générer JWT token
        String token = tokenProvider.generateToken(savedUser.getId());

        return new AuthResponse(token, savedUser);
    }



    public void logout(HttpServletRequest request) {
        // Pas besoin de faire quoi que ce soit côté serveur pour JWT
        // Le client doit supprimer le token du localStorage
    }

    public String getGoogleAuthorizationUrl() {
        return String.format(
                "https://accounts.google.com/o/oauth2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=email%%20profile",
                googleClientId,
                googleRedirectUri
        );
    }

    public AuthResponse processGoogleCallback(String code) {
        // Récupérer le token d'accès depuis Google
        String tokenUrl = "https://oauth2.googleapis.com/token";
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", googleClientId);
        params.put("client_secret", googleClientSecret);
        params.put("redirect_uri", googleRedirectUri);
        params.put("grant_type", "authorization_code");

        Map<String, String> tokenResponse = restTemplate.postForObject(tokenUrl, params, Map.class);
        String accessToken = tokenResponse.get("access_token");

        // Récupérer les informations de l'utilisateur depuis Google
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        Map<String, Object> userInfo = restTemplate.getForObject(
                userInfoUrl + "?access_token=" + accessToken,
                Map.class
        );

        String email = (String) userInfo.get("email");
        String firstName = (String) userInfo.get("given_name");
        String lastName = (String) userInfo.get("family_name");
        String googleId = (String) userInfo.get("sub");

        // Vérifier si l'utilisateur existe déjà
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Créer un nouvel utilisateur
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setGoogleId(googleId);
            user.setProvider("google");
            user = userRepository.save(user);
        } else if (user.getGoogleId() == null) {
            // Lier le compte Google à un compte existant
            user.setGoogleId(googleId);
            user.setProvider("google");
            user = userRepository.save(user);
        }

        // Générer JWT token
        String token = tokenProvider.generateToken(user.getId());

        return new AuthResponse(token, user);
    }

    public User getCurrentUser(HttpServletRequest request) {
        String token = tokenProvider.getTokenFromRequest(request);
        if (token != null && tokenProvider.validateToken(token)) {
            Long userId = tokenProvider.getUserIdFromToken(token);
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        }

        return null;
    }

    public String getFrontendBaseUrl() {
        return frontendBaseUrl;
    }
    public AuthResponse login(AuthRequest authRequest) {
        // Authentification
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(), // Utilisation du getter
                        authRequest.getPassword() // Utilisation du getter
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Récupération de l'utilisateur
        User user = userRepository.findByEmail(authRequest.getEmail()) // Utilisation du getter
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authRequest.getEmail()));

        // Génération du token JWT
        String token = tokenProvider.generateToken(user.getId());

        return new AuthResponse(token, user);
    }
}