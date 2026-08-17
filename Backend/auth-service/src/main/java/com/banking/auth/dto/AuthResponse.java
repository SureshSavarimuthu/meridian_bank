package com.banking.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private UUID id;
        private String username;
        private String email;
        private List<String> roles;
        private List<String> permissions;
    }
}
