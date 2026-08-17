package com.banking.fdrd.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class RdInstallmentResponse {
    private Integer installmentNumber;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private BigDecimal amount;
    private String status;
}
