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
@Table(name = "recurring_deposits")
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RecurringDeposit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "rd_number", unique = true, nullable = false, length = 20)
    private String rdNumber;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "account_number", nullable = false, length = 20)
    private String linkedAccountNumber;

    @Column(name = "monthly_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyAmount;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer tenureMonths;

    @Column(name = "debit_date")
    private Integer debitDate;

    @Column(name = "payment_mode", length = 20)
    private String paymentMode = "AUTO_DEBIT"; // AUTO_DEBIT, MANUAL

    @Column(name = "total_deposited", precision = 15, scale = 2)
    private BigDecimal totalDeposited = BigDecimal.ZERO;

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "maturity_amount", precision = 15, scale = 2)
    private BigDecimal maturityAmount;

    @Column(name = "interest_earned", precision = 15, scale = 2)
    private BigDecimal interestEarned;

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, MATURED, CLOSED, DEFAULTED

    @Column(name = "nominee_name", length = 100)
    private String nomineeName;

    @Column(name = "nominee_relationship", length = 30)
    private String nomineeRelationship;

    @Column(name = "installments_paid")
    private Integer installmentsPaid = 0;

    @Column(name = "opened_date")
    private LocalDateTime openedDate = LocalDateTime.now();

    @Column(name = "closed_date")
    private LocalDateTime closedDate;
}
