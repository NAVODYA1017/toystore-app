package com.toystore.backend.service;

import com.toystore.backend.model.Payment;
import com.toystore.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Create payment
    public Payment createPayment(Payment payment) {
        payment.setStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return paymentRepository.save(payment);
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get by ID
    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Get by customer
    public List<Payment> getPaymentsByCustomer(String customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }

    // Get by order
    public List<Payment> getPaymentsByOrder(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    // Update payment status
    public Payment updatePaymentStatus(String id, String status) {
        Payment payment = getPaymentById(id);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    // Process payment (simulate)
    public Payment processPayment(String id) {
        Payment payment = getPaymentById(id);
        if ("CASH_ON_DELIVERY".equals(payment.getPaymentMethod())) {
            payment.setStatus("PENDING");
        } else {
            payment.setStatus("COMPLETED");
        }
        return paymentRepository.save(payment);
    }

    // Refund
    public Payment refundPayment(String id) {
        Payment payment = getPaymentById(id);
        payment.setStatus("REFUNDED");
        return paymentRepository.save(payment);
    }

    // Delete
    public void deletePayment(String id) {
        if (!paymentRepository.existsById(id))
            throw new RuntimeException("Payment not found");
        paymentRepository.deleteById(id);
    }
}