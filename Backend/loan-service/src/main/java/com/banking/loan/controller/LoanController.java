package com.banking.loan.controller;

import com.banking.loan.dto.LoanApplicationRequest;
import com.banking.loan.dto.LoanDecisionRequest;
import com.banking.loan.dto.LoanResponse;
import com.banking.loan.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<LoanResponse> applyForLoan(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.ok(loanService.applyForLoan(request));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'LOAN_OFFICER', 'BRANCH_MANAGER')")
    public ResponseEntity<List<LoanResponse>> getLoansByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(loanService.getLoansByCustomer(customerId));
    }

    @GetMapping("/{loanId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable UUID loanId) {
        return ResponseEntity.ok(loanService.getLoanById(loanId));
    }

    @GetMapping("/number/{loanNumber}")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<LoanResponse> getLoanByNumber(@PathVariable String loanNumber) {
        return ResponseEntity.ok(loanService.getLoanByNumber(loanNumber));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<List<LoanResponse>> getPendingLoans() {
        return ResponseEntity.ok(loanService.getPendingLoans());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<List<LoanResponse>> getLoansByStatus(@PathVariable String status) {
        return ResponseEntity.ok(loanService.getLoansByStatus(status));
    }

    @PostMapping("/decide")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<LoanResponse> decideLoan(@Valid @RequestBody LoanDecisionRequest request) {
        return ResponseEntity.ok(loanService.decideLoan(request));
    }

    @PostMapping("/{loanId}/disburse")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<LoanResponse> disburseLoan(@PathVariable UUID loanId) {
        return ResponseEntity.ok(loanService.disburseLoan(loanId));
    }

    @PostMapping("/{loanId}/close")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<LoanResponse> closeLoan(@PathVariable UUID loanId) {
        return ResponseEntity.ok(loanService.closeLoan(loanId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER')")
    public ResponseEntity<Map<String, Long>> getLoanStats() {
        return ResponseEntity.ok(Map.of(
                "pending", loanService.getPendingCount(),
                "approved", loanService.getApprovedCount(),
                "disbursed", loanService.getDisbursedCount()
        ));
    }
}
