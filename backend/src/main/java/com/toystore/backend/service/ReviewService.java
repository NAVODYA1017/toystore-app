package com.toystore.backend.service;

import com.toystore.backend.model.Review;
import com.toystore.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

// Contains all business logic for managing reviews
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // Save a new review with the current timestamp
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
    // Return every review in the database
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    // Return reviews filtered by product ID
    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }
    // Return reviews filtered by user ID
    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId);
    }
    // Update only the rating and comment of an existing review
    public Review updateReview(String id, Review updatedReview) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        existing.setRating(updatedReview.getRating());
        existing.setComment(updatedReview.getComment());
        return reviewRepository.save(existing);
    }
    // Remove a review from the database by ID
    public void deleteReview(String id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}