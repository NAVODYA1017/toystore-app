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
    private String productName;
    private int quantity;
    private double totalPrice;
    private String status;
    private LocalDateTime createdAt;
}