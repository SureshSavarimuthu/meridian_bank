package com.banking.auth.security;

import com.banking.auth.entity.User;
import com.banking.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RbacService {

    private final UserRepository userRepository;

    public boolean hasPermission(User user, String permissionName) {
        // Check direct permissions first
        if (user.getDirectPermissions().stream()
                .anyMatch(p -> p.getName().equals(permissionName))) {
            return true;
        }

        // Check role-based permissions
        return user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .anyMatch(p -> p.getName().equals(permissionName));
    }

    public Set<String> getEffectivePermissions(User user) {
        Set<String> permissions = new HashSet<>();

        // Add direct permissions
        user.getDirectPermissions().forEach(p ->
                permissions.add(p.getName()));

        // Add role-based permissions
        user.getRoles().forEach(role ->
                role.getPermissions().forEach(p ->
                        permissions.add(p.getName())));

        return permissions;
    }
    
    public Set<String> getEffectiveRoles(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
    }
}
