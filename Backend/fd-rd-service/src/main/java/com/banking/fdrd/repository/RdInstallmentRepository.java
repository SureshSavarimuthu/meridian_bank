package com.banking.fdrd.repository;

import com.banking.fdrd.entity.RdInstallment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RdInstallmentRepository extends JpaRepository<RdInstallment, UUID> {
    List<RdInstallment> findByRecurringDepositIdOrderByInstallmentNumberAsc(UUID rdId);
}
