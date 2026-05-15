package com.toystore.backend.controller;

import com.toystore.backend.model.Review;
import com.toystore.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Handles all HTTP requests related to product reviews
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")// Allow requests from frontend : ADD this "http://localhost:5173"
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Create a new review
    // POST /api/reviews
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    // Get all reviews in the system
    // /api/reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Get all reviews for a specific product
    // /api/reviews/product/{productId}
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // Get all reviews written by a specific user
    // /api/reviews/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    // Update an existing review by ID
    // PUT /api/reviews/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id, @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.updateReview(id, review));
    }

    // Delete a review by ID
    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully");
    }
}