package com.banking.auth.security;

import com.banking.auth.entity.Permission;
import com.banking.auth.entity.Role;
import com.banking.auth.entity.User;
import com.banking.auth.repository.PermissionRepository;
import com.banking.auth.repository.RoleRepository;
import com.banking.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Permissions
        Permission pLoanApprove = createPermission("LOAN_APPROVE", "LOAN", "APPROVE");
        Permission pAccountView = createPermission("ACCOUNT_VIEW", "ACCOUNT", "READ");
        Permission pFullConfig = createPermission("SYSTEM_CONFIG", "SYSTEM", "ALL");

        // 2. Create Roles
        Role rCustomer = createRole("CUSTOMER", 0);
        Role rLoanOfficer = createRole("LOAN_OFFICER", 1);
        rLoanOfficer.getPermissions().add(pLoanApprove);
        roleRepository.save(rLoanOfficer);
        
        Role rBranchManager = createRole("BRANCH_MANAGER", 2);
        rBranchManager.getPermissions().addAll(Set.of(pLoanApprove, pAccountView));
        roleRepository.save(rBranchManager);
        
        Role rAdmin = createRole("SYSTEM_ADMIN", 10);
        rAdmin.getPermissions().add(pFullConfig);
        roleRepository.save(rAdmin);

        // 3. Create Users
        createUser("john.doe", "Secure@123", "john@test.com", "EMP001", rCustomer);
        createUser("loan.officer", "Secure@123", "officer@test.com", "EMP002", rLoanOfficer);
        createUser("branch.manager", "Secure@123", "manager@test.com", "EMP003", rBranchManager);
        createUser("admin.user", "Secure@123", "admin@test.com", "EMP004", rAdmin);
    }

    private Permission createPermission(String name, String module, String action) {
        Permission p = new Permission();
        p.setName(name);
        p.setModule(module);
        p.setAction(action);
        return permissionRepository.save(p);
    }

    private Role createRole(String name, int level) {
        Role r = new Role();
        r.setName(name);
        r.setHierarchyLevel(level);
        return roleRepository.save(r);
    }

    private void createUser(String username, String password, String email, String empId, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setEmail(email);
        u.setEmployeeId(empId);
        u.getRoles().add(role);
        userRepository.save(u);
    }
}
