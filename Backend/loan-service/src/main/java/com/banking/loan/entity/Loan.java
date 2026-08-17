package com.banking.loan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "loan_number", unique = true, nullable = false, length = 20)
    private String loanNumber;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "loan_type", nullable = false, length = 30)
    private String loanType; // PERSONAL, HOME, AUTO, EDUCATION, BUSINESS

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer tenure; // in months

    @Column(name = "monthly_emi", precision = 15, scale = 2)
    private BigDecimal monthlyEmi;

    @Column(name = "outstanding_amount", precision = 15, scale = 2)
    private BigDecimal outstandingAmount;

    @Column(length = 20)
    private String status = "PENDING"; // PENDING, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED, CLOSED, DEFAULTED

    @Column(name = "applied_date")
    private LocalDateTime appliedDate = LocalDateTime.now();

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "disbursed_date")
    private LocalDateTime disbursedDate;

    @Column(name = "closed_date")
    private LocalDateTime closedDate;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "collateral_type", length = 30)
    private String collateralType;

    @Column(columnDefinition = "TEXT")
    private String collateralDetails;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
