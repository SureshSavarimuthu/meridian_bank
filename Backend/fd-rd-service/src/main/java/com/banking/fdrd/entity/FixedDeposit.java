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
@Table(name = "fixed_deposits")
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class FixedDeposit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "fd_number", unique = true, nullable = false, length = 20)
    private String fdNumber;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "account_number", nullable = false, length = 20)
    private String linkedAccountNumber;

    @Column(nullable = false, length = 30)
    private String fdType; // CUMULATIVE, NON_CUMULATIVE, FLEXI, TAX_SAVER

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;

    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer tenureDays;

    @Column(name = "payout_frequency", length = 20)
    private String payoutFrequency = "AT_MATURITY"; // MONTHLY, QUARTERLY, ANNUAL, AT_MATURITY

    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    @Column(name = "maturity_amount", precision = 15, scale = 2)
    private BigDecimal maturityAmount;

    @Column(name = "interest_earned", precision = 15, scale = 2)
    private BigDecimal interestEarned;

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, MATURED, WITHDRAWN, CLOSED

    @Column(name = "auto_renew")
    private Boolean autoRenew = true;

    @Column(name = "nominee_name", length = 100)
    private String nomineeName;

    @Column(name = "nominee_relationship", length = 30)
    private String nomineeRelationship;

    @Column(name = "opened_date")
    private LocalDateTime openedDate = LocalDateTime.now();

    @Column(name = "closed_date")
    private LocalDateTime closedDate;
}
