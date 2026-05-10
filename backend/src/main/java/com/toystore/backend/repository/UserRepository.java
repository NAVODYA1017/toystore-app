package com.toystore.backend.repository;

import com.toystore.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);   // ✅ kept your existing one
    boolean existsByEmail(String email);         // ✅ kept your existing one
}