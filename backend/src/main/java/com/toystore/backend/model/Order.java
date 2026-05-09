package com.toystore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String customerName;
    private String customerEmail;
    private String phoneNumber;
    private String deliveryAddress;
    private String productName;
    private int quantity;
    private double totalPrice;
    private String paymentMethod;  // CASH, CARD, ONLINE
    private String status;         // PENDING, SHIPPED, DELIVERED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}