package com.toystore.backend.repository;

import com.toystore.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Match orders by customerEmail — the only user identifier in Order.java
    @Query("{ 'customerEmail' : ?0 }")
    List<Order> findByCustomerEmail(String customerEmail);
}