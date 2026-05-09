package com.toystore.backend.controller;

import com.toystore.backend.model.User;
import com.toystore.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try { return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(user)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        try { return ResponseEntity.ok(userService.loginUser(creds.get("email"), creds.get("password"))); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage())); }
    }

    // GET /api/users
    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try { return ResponseEntity.ok(userService.getUserById(id)); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage())); }
    }

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody User user) {
        try { return ResponseEntity.ok(userService.updateUser(id, user)); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage())); }
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { userService.deleteUser(id); return ResponseEntity.ok(Map.of("message", "Deleted successfully")); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage())); }
    }
}