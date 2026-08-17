package com.banking.fdrd.service;

import com.banking.fdrd.dto.*;
import com.banking.fdrd.entity.FixedDeposit;
import com.banking.fdrd.entity.RdInstallment;
import com.banking.fdrd.entity.RecurringDeposit;
import com.banking.fdrd.repository.FixedDepositRepository;
import com.banking.fdrd.repository.RdInstallmentRepository;
import com.banking.fdrd.repository.RecurringDepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FdRdService {

    private final FixedDepositRepository fdRepository;
    private final RecurringDepositRepository rdRepository;
    private final RdInstallmentRepository installmentRepository;

    // ==================== FD OPERATIONS ====================

    @Transactional
    public FdResponse createFd(FdCreateRequest request) {
        FixedDeposit fd = new FixedDeposit();
        fd.setFdNumber(generateFdNumber());
        fd.setCustomerId(request.getCustomerId());
        fd.setLinkedAccountNumber(request.getLinkedAccountNumber());
        fd.setFdType(request.getFdType());
        fd.setPrincipal(request.getPrincipal());
        fd.setTenureDays(request.getTenureDays());
        fd.setInterestRate(calculateFdRate(request.getTenureDays()));
        fd.setPayoutFrequency(request.getPayoutFrequency() != null ? request.getPayoutFrequency() : "AT_MATURITY");
        fd.setAutoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : true);
        fd.setNomineeName(request.getNomineeName());
        fd.setNomineeRelationship(request.getNomineeRelationship());
        fd.setStatus("ACTIVE");
        fd.setOpenedDate(LocalDateTime.now());
        fd.setMaturityDate(LocalDate.now().plusDays(request.getTenureDays()));

        BigDecimal maturityAmt = calculateFdMaturityAmount(
                request.getPrincipal(), fd.getInterestRate(), request.getTenureDays());
        fd.setMaturityAmount(maturityAmt);
        fd.setInterestEarned(maturityAmt.subtract(request.getPrincipal()));

        FixedDeposit saved = fdRepository.save(fd);
        return mapFdToResponse(saved);
    }

    public List<FdResponse> getFdsByCustomer(UUID customerId) {
        return fdRepository.findByCustomerIdOrderByOpenedDateDesc(customerId)
                .stream().map(this::mapFdToResponse).toList();
    }

    public FdResponse getFdById(UUID fdId) {
        FixedDeposit fd = fdRepository.findById(fdId)
                .orElseThrow(() -> new RuntimeException("FD not found: " + fdId));
        return mapFdToResponse(fd);
    }

    public FdResponse getFdByNumber(String fdNumber) {
        FixedDeposit fd = fdRepository.findByFdNumber(fdNumber)
                .orElseThrow(() -> new RuntimeException("FD not found: " + fdNumber));
        return mapFdToResponse(fd);
    }

    public List<FdResponse> getFdsByStatus(String status) {
        return fdRepository.findByStatusOrderByOpenedDateAsc(status)
                .stream().map(this::mapFdToResponse).toList();
    }

    @Transactional
    public FdResponse withdrawFd(UUID fdId) {
        FixedDeposit fd = fdRepository.findById(fdId)
                .orElseThrow(() -> new RuntimeException("FD not found: " + fdId));

        if (!"ACTIVE".equals(fd.getStatus())) {
            throw new RuntimeException("Only active FDs can be withdrawn. Current status: " + fd.getStatus());
        }

        fd.setStatus("WITHDRAWN");
        fd.setClosedDate(LocalDateTime.now());

        FixedDeposit saved = fdRepository.save(fd);
        return mapFdToResponse(saved);
    }

    @Transactional
    public FdResponse renewFd(UUID fdId) {
        FixedDeposit fd = fdRepository.findById(fdId)
                .orElseThrow(() -> new RuntimeException("FD not found: " + fdId));

        if (!"ACTIVE".equals(fd.getStatus()) && !"MATURED".equals(fd.getStatus())) {
            throw new RuntimeException("Only active or matured FDs can be renewed. Current status: " + fd.getStatus());
        }

        fd.setStatus("CLOSED");
        fd.setClosedDate(LocalDateTime.now());
        fdRepository.save(fd);

        FdCreateRequest newRequest = new FdCreateRequest();
        newRequest.setCustomerId(fd.getCustomerId());
        newRequest.setLinkedAccountNumber(fd.getLinkedAccountNumber());
        newRequest.setFdType(fd.getFdType());
        newRequest.setPrincipal(fd.getMaturityAmount());
        newRequest.setTenureDays(fd.getTenureDays());
        newRequest.setPayoutFrequency(fd.getPayoutFrequency());
        newRequest.setAutoRenew(fd.getAutoRenew());
        newRequest.setNomineeName(fd.getNomineeName());
        newRequest.setNomineeRelationship(fd.getNomineeRelationship());

        return createFd(newRequest);
    }

    // ==================== RD OPERATIONS ====================

    @Transactional
    public RdResponse createRd(RdCreateRequest request) {
        RecurringDeposit rd = new RecurringDeposit();
        rd.setRdNumber(generateRdNumber());
        rd.setCustomerId(request.getCustomerId());
        rd.setLinkedAccountNumber(request.getLinkedAccountNumber());
        rd.setMonthlyAmount(request.getMonthlyAmount());
        rd.setTenureMonths(request.getTenureMonths());
        rd.setInterestRate(calculateRdRate(request.getTenureMonths()));
        rd.setDebitDate(request.getDebitDate() != null ? request.getDebitDate() : 15);
        rd.setPaymentMode(request.getPaymentMode() != null ? request.getPaymentMode() : "AUTO_DEBIT");
        rd.setNomineeName(request.getNomineeName());
        rd.setNomineeRelationship(request.getNomineeRelationship());
        rd.setStatus("ACTIVE");
        rd.setOpenedDate(LocalDateTime.now());
        rd.setMaturityDate(LocalDate.now().plusMonths(request.getTenureMonths()));

        BigDecimal maturityAmt = calculateRdMaturityAmount(
                request.getMonthlyAmount(), rd.getInterestRate(), request.getTenureMonths());
        rd.setMaturityAmount(maturityAmt);
        rd.setInterestEarned(maturityAmt.subtract(
                request.getMonthlyAmount().multiply(BigDecimal.valueOf(request.getTenureMonths()))));

        RecurringDeposit saved = rdRepository.save(rd);
        generateInstallmentSchedule(saved);
        return mapRdToResponse(saved);
    }

    public List<RdResponse> getRdsByCustomer(UUID customerId) {
        return rdRepository.findByCustomerIdOrderByOpenedDateDesc(customerId)
                .stream().map(this::mapRdToResponse).toList();
    }

    public RdResponse getRdById(UUID rdId) {
        RecurringDeposit rd = rdRepository.findById(rdId)
                .orElseThrow(() -> new RuntimeException("RD not found: " + rdId));
        return mapRdToResponse(rd);
    }

    public RdResponse getRdByNumber(String rdNumber) {
        RecurringDeposit rd = rdRepository.findByRdNumber(rdNumber)
                .orElseThrow(() -> new RuntimeException("RD not found: " + rdNumber));
        return mapRdToResponse(rd);
    }

    public List<RdResponse> getRdsByStatus(String status) {
        return rdRepository.findByStatusOrderByOpenedDateAsc(status)
                .stream().map(this::mapRdToResponse).toList();
    }

    @Transactional
    public RdResponse payInstallment(UUID rdId) {
        RecurringDeposit rd = rdRepository.findById(rdId)
                .orElseThrow(() -> new RuntimeException("RD not found: " + rdId));

        if (!"ACTIVE".equals(rd.getStatus())) {
            throw new RuntimeException("Only active RDs can have installments paid. Status: " + rd.getStatus());
        }

        List<RdInstallment> installments = installmentRepository
                .findByRecurringDepositIdOrderByInstallmentNumberAsc(rdId);

        RdInstallment nextPending = installments.stream()
                .filter(i -> "PENDING".equals(i.getStatus()) || "OVERDUE".equals(i.getStatus()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No pending installments"));

        nextPending.setStatus("PAID");
        nextPending.setPaidDate(LocalDate.now());
        installmentRepository.save(nextPending);

        rd.setInstallmentsPaid(rd.getInstallmentsPaid() + 1);
        rd.setTotalDeposited(rd.getTotalDeposited().add(nextPending.getAmount()));

        RecurringDeposit saved = rdRepository.save(rd);
        return mapRdToResponse(saved);
    }

    @Transactional
    public RdResponse closeRd(UUID rdId) {
        RecurringDeposit rd = rdRepository.findById(rdId)
                .orElseThrow(() -> new RuntimeException("RD not found: " + rdId));

        if ("CLOSED".equals(rd.getStatus())) {
            throw new RuntimeException("RD is already closed");
        }

        rd.setStatus("CLOSED");
        rd.setClosedDate(LocalDateTime.now());
        RecurringDeposit saved = rdRepository.save(rd);
        return mapRdToResponse(saved);
    }

    // ==================== STATS ====================

    public long getActiveFdCount() {
        return fdRepository.countByStatus("ACTIVE");
    }

    public long getMaturedFdCount() {
        return fdRepository.countByStatus("MATURED");
    }

    public long getActiveRdCount() {
        return rdRepository.countByStatus("ACTIVE");
    }

    // ==================== RATE CALCULATION ====================

    private BigDecimal calculateFdRate(int tenureDays) {
        if (tenureDays <= 14) return new BigDecimal("3.00");
        if (tenureDays <= 30) return new BigDecimal("3.50");
        if (tenureDays <= 90) return new BigDecimal("4.50");
        if (tenureDays <= 180) return new BigDecimal("5.50");
        if (tenureDays <= 365) return new BigDecimal("6.50");
        if (tenureDays <= 730) return new BigDecimal("7.00");
        if (tenureDays <= 1095) return new BigDecimal("7.25");
        return new BigDecimal("7.50");
    }

    private BigDecimal calculateRdRate(int tenureMonths) {
        if (tenureMonths <= 6) return new BigDecimal("5.50");
        if (tenureMonths <= 12) return new BigDecimal("6.75");
        if (tenureMonths <= 24) return new BigDecimal("7.00");
        if (tenureMonths <= 60) return new BigDecimal("7.25");
        return new BigDecimal("7.50");
    }

    // ==================== MATURITY CALCULATION ====================

    private BigDecimal calculateFdMaturityAmount(BigDecimal principal, BigDecimal annualRate, int tenureDays) {
        double rate = annualRate.doubleValue() / 100;
        double years = tenureDays / 365.25;
        double amount = principal.doubleValue() * Math.pow(1 + rate / 4, 4 * years);
        return BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateRdMaturityAmount(BigDecimal monthlyAmount, BigDecimal annualRate, int tenureMonths) {
        double rate = annualRate.doubleValue() / 100 / 12;
        double maturityAmount = 0;
        for (int i = 1; i <= tenureMonths; i++) {
            double remainingMonths = tenureMonths - i + 1;
            maturityAmount += monthlyAmount.doubleValue() * Math.pow(1 + rate, remainingMonths);
        }
        return BigDecimal.valueOf(maturityAmount).setScale(2, RoundingMode.HALF_UP);
    }

    // ==================== INSTALLMENT SCHEDULE ====================

    private void generateInstallmentSchedule(RecurringDeposit rd) {
        LocalDate startDate = YearMonth.now().atDay(rd.getDebitDate());
        if (startDate.isBefore(LocalDate.now())) {
            startDate = YearMonth.now().plusMonths(1).atDay(rd.getDebitDate());
        }

        for (int i = 1; i <= rd.getTenureMonths(); i++) {
            RdInstallment installment = new RdInstallment();
            installment.setRecurringDeposit(rd);
            installment.setInstallmentNumber(i);
            installment.setDueDate(startDate.plusMonths(i - 1));
            installment.setAmount(rd.getMonthlyAmount());
            installment.setStatus("SCHEDULED");
            installmentRepository.save(installment);
        }
    }

    // ==================== NUMBER GENERATION ====================

    private String generateFdNumber() {
        long count = fdRepository.count();
        return "FD" + String.format("%06d", count + 1);
    }

    private String generateRdNumber() {
        long count = rdRepository.count();
        return "RD" + String.format("%06d", count + 1);
    }

    // ==================== RESPONSE MAPPING ====================

    private FdResponse mapFdToResponse(FixedDeposit fd) {
        return FdResponse.builder()
                .id(fd.getId())
                .fdNumber(fd.getFdNumber())
                .customerId(fd.getCustomerId())
                .linkedAccountNumber(fd.getLinkedAccountNumber())
                .fdType(fd.getFdType())
                .principal(fd.getPrincipal())
                .interestRate(fd.getInterestRate())
                .tenureDays(fd.getTenureDays())
                .payoutFrequency(fd.getPayoutFrequency())
                .maturityDate(fd.getMaturityDate())
                .maturityAmount(fd.getMaturityAmount())
                .interestEarned(fd.getInterestEarned())
                .status(fd.getStatus())
                .autoRenew(fd.getAutoRenew())
                .nomineeName(fd.getNomineeName())
                .openedDate(fd.getOpenedDate())
                .closedDate(fd.getClosedDate())
                .build();
    }

    private RdResponse mapRdToResponse(RecurringDeposit rd) {
        List<RdInstallmentResponse> installments = installmentRepository
                .findByRecurringDepositIdOrderByInstallmentNumberAsc(rd.getId())
                .stream()
                .map(i -> RdInstallmentResponse.builder()
                        .installmentNumber(i.getInstallmentNumber())
                        .dueDate(i.getDueDate())
                        .paidDate(i.getPaidDate())
                        .amount(i.getAmount())
                        .status(i.getStatus())
                        .build())
                .toList();

        return RdResponse.builder()
                .id(rd.getId())
                .rdNumber(rd.getRdNumber())
                .customerId(rd.getCustomerId())
                .linkedAccountNumber(rd.getLinkedAccountNumber())
                .monthlyAmount(rd.getMonthlyAmount())
                .interestRate(rd.getInterestRate())
                .tenureMonths(rd.getTenureMonths())
                .debitDate(rd.getDebitDate())
                .paymentMode(rd.getPaymentMode())
                .totalDeposited(rd.getTotalDeposited())
                .maturityDate(rd.getMaturityDate())
                .maturityAmount(rd.getMaturityAmount())
                .interestEarned(rd.getInterestEarned())
                .status(rd.getStatus())
                .installmentsPaid(rd.getInstallmentsPaid())
                .nomineeName(rd.getNomineeName())
                .openedDate(rd.getOpenedDate())
                .closedDate(rd.getClosedDate())
                .installments(installments)
                .build();
    }
}
