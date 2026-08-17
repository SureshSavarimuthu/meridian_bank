package com.banking.fdrd.repository;

import com.banking.fdrd.entity.RecurringDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecurringDepositRepository extends JpaRepository<RecurringDeposit, UUID> {
    List<RecurringDeposit> findByCustomerIdOrderByOpenedDateDesc(UUID customerId);
    Optional<RecurringDeposit> findByRdNumber(String rdNumber);
    List<RecurringDeposit> findByStatusOrderByOpenedDateAsc(String status);
    long countByStatus(String status);
}
