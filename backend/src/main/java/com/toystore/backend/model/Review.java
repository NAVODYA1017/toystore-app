package com.toystore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String productId;   // which product this review is for
    private String userId;      // who wrote the review
    private String username;    // display name of the reviewer
    private int rating;         // 1 to 5 stars
    private String comment;     // the review text
    private LocalDateTime createdAt;  // when it was posted
}