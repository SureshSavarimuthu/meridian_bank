package com.banking.account.controller;

import com.banking.account.dto.TransferRequest;
import com.banking.account.entity.Transaction;
import com.banking.account.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/account/{accountId}")
    @PreAuthorize("hasPermission('TRANSACTION_VIEW') or hasRole('CUSTOMER')")
    public ResponseEntity<List<Transaction>> getAccountTransactions(@PathVariable UUID accountId) {
        return ResponseEntity.ok(transactionService.getAccountTransactions(accountId));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasPermission('TRANSACTION_CREATE') or hasRole('CUSTOMER')")
    public ResponseEntity<Transaction> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(transactionService.processTransfer(request));
    }
}
