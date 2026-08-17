package com.banking.fdrd.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class RdCreateRequest {
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    @NotBlank(message = "Linked account number is required")
    private String linkedAccountNumber;

    @NotNull(message = "Monthly installment is required")
    @DecimalMin(value = "500", message = "Minimum monthly installment is ₹500")
    private BigDecimal monthlyAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 120, message = "Maximum tenure is 120 months")
    private Integer tenureMonths;

    private Integer debitDate;
    private String paymentMode;
    private String nomineeName;
    private String nomineeRelationship;
}
