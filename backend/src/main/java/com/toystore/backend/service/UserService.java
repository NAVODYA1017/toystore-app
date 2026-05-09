package com.toystore.backend.service;

import com.toystore.backend.model.User;
import com.toystore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists");
        if (user.getRole() == null) user.setRole("CUSTOMER");
        return userRepository.save(user);
    }

    // Login
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(password))
            throw new RuntimeException("Invalid password");
        return user;
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
        if (updated.getPassword() != null) existing.setPassword(updated.getPassword());
        return userRepository.save(existing);
    }

    // Delete
    public void deleteUser(String id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("User not found");
        userRepository.deleteById(id);
    }
}
