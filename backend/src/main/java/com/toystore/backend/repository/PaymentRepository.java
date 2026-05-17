package com.toystore.backend.repository;

import com.toystore.backend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByCustomerId(String customerId);
    List<Payment> findByOrderId(String orderId);
    List<Payment> findByStatus(String status);
}