package com.banking.auth.controller;

import com.banking.auth.dto.*;
import com.banking.auth.entity.Role;
import com.banking.auth.entity.User;
import com.banking.auth.repository.RoleRepository;
import com.banking.auth.repository.UserRepository;
import com.banking.auth.security.CustomUserDetails;
import com.banking.auth.security.JwtService;
import com.banking.auth.security.RbacService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RbacService rbacService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        CustomUserDetails userDetails = new CustomUserDetails(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId().toString());
        extraClaims.put("roles", rbacService.getEffectiveRoles(user));
        extraClaims.put("permissions", rbacService.getEffectivePermissions(user));

        String jwtToken = jwtService.generateToken(extraClaims, userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Login successful");
        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", jwtToken);
        data.put("refreshToken", refreshToken);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400000);
        data.put("requiresTwoFactor", false);
        data.put("user", AuthResponse.UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(new ArrayList<>(rbacService.getEffectiveRoles(user)))
                .permissions(new ArrayList<>(rbacService.getEffectivePermissions(user)))
                .build());
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Username already exists"
            ));
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Email already registered"
            ));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setStatus("ACTIVE");

        String roleName = request.getRole() != null ? request.getRole() : "CUSTOMER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.getRoles().add(role);

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", savedUser.getId().toString());
        extraClaims.put("roles", rbacService.getEffectiveRoles(savedUser));
        extraClaims.put("permissions", rbacService.getEffectivePermissions(savedUser));

        String jwtToken = jwtService.generateToken(extraClaims, userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Registration successful");
        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", jwtToken);
        data.put("refreshToken", refreshToken);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400000);
        data.put("requiresTwoFactor", false);
        data.put("user", AuthResponse.UserDto.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(new ArrayList<>(rbacService.getEffectiveRoles(savedUser)))
                .permissions(new ArrayList<>(rbacService.getEffectivePermissions(savedUser)))
                .build());
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            String username = jwtService.extractUsername(request.getRefreshToken());
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            CustomUserDetails userDetails = new CustomUserDetails(user);

            if (jwtService.isTokenValid(request.getRefreshToken(), userDetails)) {
                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("userId", user.getId().toString());
                extraClaims.put("roles", rbacService.getEffectiveRoles(user));
                extraClaims.put("permissions", rbacService.getEffectivePermissions(user));

                String newToken = jwtService.generateToken(extraClaims, userDetails);
                String newRefreshToken = jwtService.generateRefreshToken(userDetails);

                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "message", "Token refreshed",
                        "data", Map.of(
                                "accessToken", newToken,
                                "refreshToken", newRefreshToken,
                                "tokenType", "Bearer",
                                "expiresIn", 86400000
                        )
                ));
            }
        } catch (Exception e) {
            // Token invalid
        }

        return ResponseEntity.status(401).body(Map.of(
                "status", "ERROR",
                "message", "Invalid refresh token"
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Valid @RequestBody PasswordChangeRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String jwt = authHeader.substring(7);
            String username = jwtService.extractUsername(jwt);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "ERROR",
                        "message", "Current password is incorrect"
                ));
            }

            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Password changed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Failed to change password"
            ));
        }
    }
}
