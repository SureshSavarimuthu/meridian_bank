package com.banking.loan.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class LoanDecisionRequest {
    @NotNull(message = "Loan ID is required")
    private UUID loanId;

    @NotNull(message = "Decision is required")
    private String decision; // APPROVED, REJECTED

    private String rejectionReason;

    private BigDecimal approvedAmount; // If different from applied amount

    private BigDecimal approvedInterestRate;
}
