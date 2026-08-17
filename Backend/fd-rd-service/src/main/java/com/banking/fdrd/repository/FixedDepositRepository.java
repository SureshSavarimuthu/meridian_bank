package com.banking.fdrd.repository;

import com.banking.fdrd.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, UUID> {
    List<FixedDeposit> findByCustomerIdOrderByOpenedDateDesc(UUID customerId);
    Optional<FixedDeposit> findByFdNumber(String fdNumber);
    List<FixedDeposit> findByStatusOrderByOpenedDateAsc(String status);
    long countByStatus(String status);
}
