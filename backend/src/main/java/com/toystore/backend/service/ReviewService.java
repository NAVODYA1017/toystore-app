package com.toystore.backend.service;

import com.toystore.backend.model.Review;
import com.toystore.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // CREATE - add a new review
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // READ - get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // READ - get reviews for one product
    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    // READ - get reviews by one user
    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    // UPDATE - edit a review
    public Review updateReview(String id, Review updatedReview) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        existing.setRating(updatedReview.getRating());
        existing.setComment(updatedReview.getComment());
        return reviewRepository.save(existing);
    }

    // DELETE - remove a review
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}