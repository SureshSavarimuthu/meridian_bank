package com.banking.loan.repository;

import com.banking.loan.entity.LoanRepayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoanRepaymentRepository extends JpaRepository<LoanRepayment, UUID> {
    List<LoanRepayment> findByLoanIdOrderByInstallmentNumberAsc(UUID loanId);
    List<LoanRepayment> findByLoanIdAndStatus(UUID loanId, String status);
    long countByLoanIdAndStatus(UUID loanId, String status);
}
