package com.toystore.backend.controller;

import com.toystore.backend.model.Review;
import com.toystore.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // CREATE - add new review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    // READ - get all reviews
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // READ - get reviews by product
    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(
            @PathVariable String productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    // READ - get single review
    @GetMapping("/{id}")
    public Optional<Review> getById(@PathVariable String id) {
        return reviewService.getReviewById(id);
    }

    // UPDATE - edit a review
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable String id,
                               @RequestParam int rating,
                               @RequestParam String comment) {
        return reviewService.updateReview(id, rating, comment);
    }

    // DELETE - remove a review
    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return "Review deleted successfully!";
    }
}