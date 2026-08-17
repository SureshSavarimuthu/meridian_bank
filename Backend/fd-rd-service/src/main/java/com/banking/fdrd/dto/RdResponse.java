package com.banking.fdrd.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RdResponse {
    private UUID id;
    private String rdNumber;
    private UUID customerId;
    private String linkedAccountNumber;
    private BigDecimal monthlyAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private Integer debitDate;
    private String paymentMode;
    private BigDecimal totalDeposited;
    private LocalDate maturityDate;
    private BigDecimal maturityAmount;
    private BigDecimal interestEarned;
    private String status;
    private Integer installmentsPaid;
    private String nomineeName;
    private LocalDateTime openedDate;
    private LocalDateTime closedDate;
    private List<RdInstallmentResponse> installments;
}
