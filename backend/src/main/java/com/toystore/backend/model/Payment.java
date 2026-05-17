package com.toystore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String orderId;
    private String customerId;
    private String customerName;
    private double amount;

    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, CASH_ON_DELIVERY, PAYPAL
    private String status;        // PENDING, COMPLETED, FAILED, REFUNDED

    private String transactionId;
    private LocalDateTime paymentDate;
}