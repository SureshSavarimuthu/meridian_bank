package com.banking.account.service;

import com.banking.account.dto.TransferRequest;
import com.banking.account.entity.Account;
import com.banking.account.entity.Transaction;
import com.banking.account.repository.AccountRepository;
import com.banking.account.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public List<Transaction> getAccountTransactions(UUID accountId) {
        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Transaction processTransfer(TransferRequest request) {
        // Use pessimistic locking to prevent race conditions
        Account sourceAccount = accountRepository.findByAccountNumberForUpdate(request.getSourceAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account targetAccount = accountRepository.findByAccountNumberForUpdate(request.getTargetAccountNumber())
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        // Validate balance
        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        if (!"ACTIVE".equals(sourceAccount.getStatus()) || !"ACTIVE".equals(targetAccount.getStatus())) {
            throw new RuntimeException("One of the accounts is not active");
        }

        // Process deduction
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        targetAccount.setBalance(targetAccount.getBalance().add(request.getAmount()));
        
        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        // Record source transaction
        Transaction sourceTx = new Transaction();
        sourceTx.setAccount(sourceAccount);
        sourceTx.setTransactionType("TRANSFER_OUT");
        sourceTx.setAmount(request.getAmount().negate());
        sourceTx.setBalanceAfter(sourceAccount.getBalance());
        sourceTx.setReferenceNumber(request.getTargetAccountNumber());
        transactionRepository.save(sourceTx);

        // Record target transaction
        Transaction targetTx = new Transaction();
        targetTx.setAccount(targetAccount);
        targetTx.setTransactionType("TRANSFER_IN");
        targetTx.setAmount(request.getAmount());
        targetTx.setBalanceAfter(targetAccount.getBalance());
        targetTx.setReferenceNumber(request.getSourceAccountNumber());
        transactionRepository.save(targetTx);

        return sourceTx;
    }
}
