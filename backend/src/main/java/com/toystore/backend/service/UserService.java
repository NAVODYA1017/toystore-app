package com.toystore.backend.service;

import com.toystore.backend.model.Role;
import com.toystore.backend.model.User;
import com.toystore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;    // ✅ BCrypt encoder

    // Register
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists");

        user.setPassword(passwordEncoder.encode(user.getPassword())); // ✅ hash password
        if (user.getRole() == null) user.setRole(Role.ROLE_CLIENT);   // ✅ default role

        return userRepository.save(user);
    }

    // Get All
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get by ID
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update
    public User updateUser(String id, User updated) {
        User existing = getUserById(id);
        if (updated.getName() != null)     existing.setName(updated.getName());
        if (updated.getPhone() != null)    existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null)  existing.setAddress(updated.getAddress());
        if (updated.getPassword() != null)
            existing.setPassword(passwordEncoder.encode(updated.getPassword())); // ✅ hash on update too
        return userRepository.save(existing);
    }

    // Delete
    public void deleteUser(String id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("User not found");
        userRepository.deleteById(id);
    }
    // Add this inside UserService.java
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}