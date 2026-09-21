package com.banking.auth.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Email(message = "Invalid email format")
    private String email;

    private String employeeId;

    private String status;

    private String role;
}
