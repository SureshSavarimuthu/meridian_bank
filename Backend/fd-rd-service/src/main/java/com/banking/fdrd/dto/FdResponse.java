package com.banking.fdrd.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class FdResponse {
    private UUID id;
    private String fdNumber;
    private UUID customerId;
    private String linkedAccountNumber;
    private String fdType;
    private BigDecimal principal;
    private BigDecimal interestRate;
    private Integer tenureDays;
    private String payoutFrequency;
    private LocalDate maturityDate;
    private BigDecimal maturityAmount;
    private BigDecimal interestEarned;
    private String status;
    private Boolean autoRenew;
    private String nomineeName;
    private LocalDateTime openedDate;
    private LocalDateTime closedDate;
}
