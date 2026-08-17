package com.banking.loan.service;

import com.banking.loan.dto.LoanApplicationRequest;
import com.banking.loan.dto.LoanDecisionRequest;
import com.banking.loan.dto.LoanResponse;
import com.banking.loan.entity.Loan;
import com.banking.loan.entity.LoanRepayment;
import com.banking.loan.repository.LoanRepaymentRepository;
import com.banking.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanRepaymentRepository loanRepaymentRepository;

    @Transactional
    public LoanResponse applyForLoan(LoanApplicationRequest request) {
        Loan loan = new Loan();
        loan.setLoanNumber(generateLoanNumber());
        loan.setCustomerId(request.getCustomerId());
        loan.setLoanType(request.getLoanType());
        loan.setAmount(request.getAmount());
        loan.setInterestRate(request.getInterestRate());
        loan.setTenure(request.getTenure());
        loan.setPurpose(request.getPurpose());
        loan.setCollateralType(request.getCollateralType());
        loan.setCollateralDetails(request.getCollateralDetails());
        loan.setStatus("PENDING");
        loan.setAppliedDate(LocalDateTime.now());

        // Calculate EMI: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        BigDecimal monthlyEmi = calculateEmi(
                request.getAmount(), request.getInterestRate(), request.getTenure());
        loan.setMonthlyEmi(monthlyEmi);
        loan.setOutstandingAmount(request.getAmount());

        Loan savedLoan = loanRepository.save(loan);
        return mapToResponse(savedLoan, false);
    }

    public List<LoanResponse> getLoansByCustomer(UUID customerId) {
        return loanRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(loan -> mapToResponse(loan, false))
                .toList();
    }

    public LoanResponse getLoanById(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));
        return mapToResponse(loan, true);
    }

    public LoanResponse getLoanByNumber(String loanNumber) {
        Loan loan = loanRepository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found with number: " + loanNumber));
        return mapToResponse(loan, true);
    }

    public List<LoanResponse> getPendingLoans() {
        return loanRepository.findByStatusOrderByAppliedDateAsc("PENDING")
                .stream()
                .map(loan -> mapToResponse(loan, false))
                .toList();
    }

    public List<LoanResponse> getLoansByStatus(String status) {
        return loanRepository.findByStatusOrderByAppliedDateAsc(status)
                .stream()
                .map(loan -> mapToResponse(loan, false))
                .toList();
    }

    @Transactional
    public LoanResponse decideLoan(LoanDecisionRequest request) {
        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + request.getLoanId()));

        if (!"PENDING".equals(loan.getStatus()) && !"UNDER_REVIEW".equals(loan.getStatus())) {
            throw new RuntimeException("Loan cannot be decided in current status: " + loan.getStatus());
        }

        if ("APPROVED".equalsIgnoreCase(request.getDecision())) {
            loan.setStatus("APPROVED");
            loan.setApprovedDate(LocalDateTime.now());
            if (request.getApprovedAmount() != null) {
                loan.setAmount(request.getApprovedAmount());
            }
            if (request.getApprovedInterestRate() != null) {
                loan.setInterestRate(request.getApprovedInterestRate());
            }
            // Recalculate EMI if amounts changed
            BigDecimal monthlyEmi = calculateEmi(
                    loan.getAmount(), loan.getInterestRate(), loan.getTenure());
            loan.setMonthlyEmi(monthlyEmi);
            loan.setOutstandingAmount(loan.getAmount());
        } else if ("REJECTED".equalsIgnoreCase(request.getDecision())) {
            loan.setStatus("REJECTED");
            loan.setRejectionReason(request.getRejectionReason());
        } else {
            throw new RuntimeException("Invalid decision: " + request.getDecision());
        }

        Loan savedLoan = loanRepository.save(loan);
        return mapToResponse(savedLoan, false);
    }

    @Transactional
    public LoanResponse disburseLoan(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));

        if (!"APPROVED".equals(loan.getStatus())) {
            throw new RuntimeException("Only approved loans can be disbursed");
        }

        loan.setStatus("DISBURSED");
        loan.setDisbursedDate(LocalDateTime.now());
        Loan savedLoan = loanRepository.save(loan);

        // Generate repayment schedule
        generateRepaymentSchedule(savedLoan);

        return mapToResponse(savedLoan, true);
    }

    @Transactional
    public LoanResponse closeLoan(UUID loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));

        if ("CLOSED".equals(loan.getStatus())) {
            throw new RuntimeException("Loan is already closed");
        }

        loan.setStatus("CLOSED");
        loan.setClosedDate(LocalDateTime.now());
        loan.setOutstandingAmount(BigDecimal.ZERO);
        Loan savedLoan = loanRepository.save(loan);

        return mapToResponse(savedLoan, false);
    }

    public long getPendingCount() {
        return loanRepository.countByStatus("PENDING");
    }

    public long getApprovedCount() {
        return loanRepository.countByStatus("APPROVED");
    }

    public long getDisbursedCount() {
        return loanRepository.countByStatus("DISBURSED");
    }

    private void generateRepaymentSchedule(Loan loan) {
        List<LoanRepayment> repayments = new ArrayList<>();
        BigDecimal principalPerMonth = loan.getAmount()
                .divide(BigDecimal.valueOf(loan.getTenure()), 2, RoundingMode.HALF_UP);
        BigDecimal monthlyRate = loan.getInterestRate()
                .divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);

        LocalDate startDate = YearMonth.now().atDay(1).plusMonths(1);
        AtomicInteger installment = new AtomicInteger(1);

        BigDecimal remainingPrincipal = loan.getAmount();

        for (int i = 0; i < loan.getTenure(); i++) {
            LoanRepayment repayment = new LoanRepayment();
            repayment.setLoan(loan);
            repayment.setInstallmentNumber(installment.getAndIncrement());
            repayment.setDueDate(startDate.plusMonths(i));

            BigDecimal interestComponent = remainingPrincipal.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComponent = principalPerMonth;
            if (i == loan.getTenure() - 1) {
                principalComponent = remainingPrincipal;
            }
            BigDecimal totalDue = principalComponent.add(interestComponent);

            repayment.setAmountDue(totalDue);
            repayment.setPrincipalComponent(principalComponent);
            repayment.setInterestComponent(interestComponent);
            repayment.setStatus("PENDING");

            repayments.add(repayment);
            remainingPrincipal = remainingPrincipal.subtract(principalComponent);
        }

        loanRepaymentRepository.saveAll(repayments);
    }

    private BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal factor = BigDecimal.ONE.add(monthlyRate).pow(tenureMonths);
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(factor);
        BigDecimal denominator = factor.subtract(BigDecimal.ONE);
        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private String generateLoanNumber() {
        long count = loanRepository.count();
        return "LN" + String.format("%06d", count + 1);
    }

    private LoanResponse mapToResponse(Loan loan, boolean includeSchedule) {
        LoanResponse.LoanResponseBuilder builder = LoanResponse.builder()
                .id(loan.getId())
                .loanNumber(loan.getLoanNumber())
                .customerId(loan.getCustomerId())
                .loanType(loan.getLoanType())
                .amount(loan.getAmount())
                .interestRate(loan.getInterestRate())
                .tenure(loan.getTenure())
                .monthlyEmi(loan.getMonthlyEmi())
                .outstandingAmount(loan.getOutstandingAmount())
                .status(loan.getStatus())
                .appliedDate(loan.getAppliedDate())
                .approvedDate(loan.getApprovedDate())
                .disbursedDate(loan.getDisbursedDate())
                .purpose(loan.getPurpose())
                .collateralType(loan.getCollateralType())
                .rejectionReason(loan.getRejectionReason())
                .approvedBy(loan.getApprovedBy());

        if (includeSchedule) {
            List<LoanRepayment> repayments = loanRepaymentRepository
                    .findByLoanIdOrderByInstallmentNumberAsc(loan.getId());
            builder.repaymentSchedule(repayments.stream()
                    .map(r -> LoanResponse.RepaymentSchedule.builder()
                            .id(r.getId())
                            .installmentNumber(r.getInstallmentNumber())
                            .dueDate(r.getDueDate())
                            .amountDue(r.getAmountDue())
                            .amountPaid(r.getAmountPaid())
                            .principalComponent(r.getPrincipalComponent())
                            .interestComponent(r.getInterestComponent())
                            .penaltyAmount(r.getPenaltyAmount())
                            .status(r.getStatus())
                            .build())
                    .toList());
        }

        return builder.build();
    }
}
