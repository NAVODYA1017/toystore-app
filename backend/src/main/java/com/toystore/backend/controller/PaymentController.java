package com.toystore.backend.controller;

import com.toystore.backend.model.Payment;
import com.toystore.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // POST — create payment
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Payment payment) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(paymentService.createPayment(payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET — all payments (admin)
    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET — by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET — by customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Payment>> getByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCustomer(customerId));
    }

    // GET — by order
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrder(orderId));
    }

    // PUT — update status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(paymentService.updatePaymentStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT — process payment
    @PutMapping("/{id}/process")
    public ResponseEntity<?> process(@PathVariable String id) {
        try {
            return ResponseEntity.ok(paymentService.processPayment(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT — refund
    @PutMapping("/{id}/refund")
    public ResponseEntity<?> refund(@PathVariable String id) {
        try {
            return ResponseEntity.ok(paymentService.refundPayment(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}