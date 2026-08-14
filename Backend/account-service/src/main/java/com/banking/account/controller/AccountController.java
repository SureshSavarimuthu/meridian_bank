package com.banking.account.controller;

import com.banking.account.entity.Account;
import com.banking.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasPermission('ACCOUNT_VIEW') or hasRole('CUSTOMER')")
    public ResponseEntity<List<Account>> getCustomerAccounts(@PathVariable UUID customerId) {
        return ResponseEntity.ok(accountService.getCustomerAccounts(customerId));
    }

    @GetMapping("/{accountId}")
    @PreAuthorize("hasPermission('ACCOUNT_VIEW') or hasRole('CUSTOMER')")
    public ResponseEntity<Account> getAccount(@PathVariable UUID accountId) {
        return ResponseEntity.ok(accountService.getAccountById(accountId));
    }

    @PostMapping
    @PreAuthorize("hasPermission('ACCOUNT_CREATE') or hasRole('BRANCH_MANAGER')")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return ResponseEntity.ok(accountService.createAccount(account));
    }
}
