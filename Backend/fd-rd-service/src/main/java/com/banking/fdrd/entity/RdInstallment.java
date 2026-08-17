package com.banking.fdrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rd_installments")
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RdInstallment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rd_id", nullable = false)
    private RecurringDeposit recurringDeposit;

    @Column(name = "installment_number", nullable = false)
    private Integer installmentNumber;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "principal_component", precision = 15, scale = 2)
    private BigDecimal principalComponent;

    @Column(name = "interest_component", precision = 15, scale = 2)
    private BigDecimal interestComponent;

    @Column(length = 20)
    private String status = "SCHEDULED"; // SCHEDULED, PENDING, PAID, OVERDUE

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
