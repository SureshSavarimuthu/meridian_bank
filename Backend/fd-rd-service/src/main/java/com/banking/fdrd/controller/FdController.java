package com.banking.fdrd.controller;

import com.banking.fdrd.dto.FdCreateRequest;
import com.banking.fdrd.dto.FdResponse;
import com.banking.fdrd.service.FdRdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/fd")
@RequiredArgsConstructor
public class FdController {

    private final FdRdService fdRdService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FdResponse> createFd(@Valid @RequestBody FdCreateRequest request) {
        return ResponseEntity.ok(fdRdService.createFd(request));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<FdResponse>> getFdsByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(fdRdService.getFdsByCustomer(customerId));
    }

    @GetMapping("/{fdId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<FdResponse> getFdById(@PathVariable UUID fdId) {
        return ResponseEntity.ok(fdRdService.getFdById(fdId));
    }

    @GetMapping("/number/{fdNumber}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<FdResponse> getFdByNumber(@PathVariable String fdNumber) {
        return ResponseEntity.ok(fdRdService.getFdByNumber(fdNumber));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<FdResponse>> getFdsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(fdRdService.getFdsByStatus(status));
    }

    @PostMapping("/{fdId}/withdraw")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER')")
    public ResponseEntity<FdResponse> withdrawFd(@PathVariable UUID fdId) {
        return ResponseEntity.ok(fdRdService.withdrawFd(fdId));
    }

    @PostMapping("/{fdId}/renew")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER')")
    public ResponseEntity<FdResponse> renewFd(@PathVariable UUID fdId) {
        return ResponseEntity.ok(fdRdService.renewFd(fdId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Long>> getFdStats() {
        return ResponseEntity.ok(Map.of(
                "active", fdRdService.getActiveFdCount(),
                "matured", fdRdService.getMaturedFdCount()
        ));
    }
}
