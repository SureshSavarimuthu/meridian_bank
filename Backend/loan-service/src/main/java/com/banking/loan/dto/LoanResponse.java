package com.banking.loan.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class LoanResponse {
    private UUID id;
    private String loanNumber;
    private UUID customerId;
    private String loanType;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer tenure;
    private BigDecimal monthlyEmi;
    private BigDecimal outstandingAmount;
    private String status;
    private LocalDateTime appliedDate;
    private LocalDateTime approvedDate;
    private LocalDateTime disbursedDate;
    private String purpose;
    private String collateralType;
    private String rejectionReason;
    private UUID approvedBy;
    private List<RepaymentSchedule> repaymentSchedule;

    @Data
    @Builder
    public static class RepaymentSchedule {
        private UUID id;
        private Integer installmentNumber;
        private java.time.LocalDate dueDate;
        private BigDecimal amountDue;
        private BigDecimal amountPaid;
        private BigDecimal principalComponent;
        private BigDecimal interestComponent;
        private BigDecimal penaltyAmount;
        private String status;
    }
}
