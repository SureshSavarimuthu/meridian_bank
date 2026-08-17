package com.banking.fdrd.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class FdCreateRequest {
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    @NotBlank(message = "Linked account number is required")
    private String linkedAccountNumber;

    @NotBlank(message = "FD type is required")
    private String fdType;

    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "1000", message = "Minimum deposit is ₹1,000")
    private BigDecimal principal;

    @NotNull(message = "Tenure is required")
    @Min(value = 7, message = "Minimum tenure is 7 days")
    private Integer tenureDays;

    private String payoutFrequency;
    private Boolean autoRenew;
    private String nomineeName;
    private String nomineeRelationship;
}
