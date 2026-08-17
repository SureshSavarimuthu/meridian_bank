package com.banking.loan.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class LoanApplicationRequest {
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    @NotBlank(message = "Loan type is required")
    @Size(max = 30)
    private String loanType;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000.00", message = "Minimum loan amount is 1,000")
    @DecimalMax(value = "50000000.00", message = "Maximum loan amount is 5,00,00,000")
    private BigDecimal amount;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "1.00", message = "Minimum interest rate is 1%")
    @DecimalMax(value = "36.00", message = "Maximum interest rate is 36%")
    private BigDecimal interestRate;

    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 360, message = "Maximum tenure is 360 months")
    private Integer tenure;

    private String purpose;

    private String collateralType;

    private String collateralDetails;
}
