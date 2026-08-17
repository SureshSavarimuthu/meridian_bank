package com.banking.loan.repository;

import com.banking.loan.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LoanRepository extends JpaRepository<Loan, UUID> {
    Optional<Loan> findByLoanNumber(String loanNumber);
    List<Loan> findByCustomerId(UUID customerId);
    List<Loan> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    List<Loan> findByStatus(String status);
    List<Loan> findByStatusOrderByAppliedDateAsc(String status);
    long countByStatus(String status);
}
