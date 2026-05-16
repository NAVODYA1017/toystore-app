package com.toystore.backend.model;

//Validation Import - help check data before saving to db
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

// Represents a product review stored in the "reviews" MongoDB collection
@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id; // Auto-generated MongoDB document ID

    @NotBlank(message = "Product ID is required")
    private String productId;   // The product this review belongs to

    @NotBlank(message = "User ID is required")
    private String userId;      // who wrote the review

    @NotBlank(message = "Username is required")
    private String username;    // display name of the reviewer


    private int rating;         // 1 to 5 stars
    private String comment;     // the review text
    private LocalDateTime createdAt;  // when it was posted
}