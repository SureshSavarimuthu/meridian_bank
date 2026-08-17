package com.banking.fdrd.controller;

import com.banking.fdrd.dto.RdCreateRequest;
import com.banking.fdrd.dto.RdResponse;
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
@RequestMapping("/api/rd")
@RequiredArgsConstructor
public class RdController {

    private final FdRdService fdRdService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<RdResponse> createRd(@Valid @RequestBody RdCreateRequest request) {
        return ResponseEntity.ok(fdRdService.createRd(request));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<RdResponse>> getRdsByCustomer(@PathVariable UUID customerId) {
        return ResponseEntity.ok(fdRdService.getRdsByCustomer(customerId));
    }

    @GetMapping("/{rdId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<RdResponse> getRdById(@PathVariable UUID rdId) {
        return ResponseEntity.ok(fdRdService.getRdById(rdId));
    }

    @GetMapping("/number/{rdNumber}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<RdResponse> getRdByNumber(@PathVariable String rdNumber) {
        return ResponseEntity.ok(fdRdService.getRdByNumber(rdNumber));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<RdResponse>> getRdsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(fdRdService.getRdsByStatus(status));
    }

    @PostMapping("/{rdId}/pay")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<RdResponse> payInstallment(@PathVariable UUID rdId) {
        return ResponseEntity.ok(fdRdService.payInstallment(rdId));
    }

    @PostMapping("/{rdId}/close")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'BRANCH_MANAGER')")
    public ResponseEntity<RdResponse> closeRd(@PathVariable UUID rdId) {
        return ResponseEntity.ok(fdRdService.closeRd(rdId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Long>> getRdStats() {
        return ResponseEntity.ok(Map.of(
                "active", fdRdService.getActiveRdCount()
        ));
    }
}
