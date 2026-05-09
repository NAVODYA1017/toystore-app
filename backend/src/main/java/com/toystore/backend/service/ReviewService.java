package com.toystore.backend.service;

import com.toystore.backend.model.Review;
import com.toystore.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // CREATE
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    // READ - get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // READ - get reviews by product
    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    // READ - get single review
    public Optional<Review> getReviewById(String id) {
        return reviewRepository.findById(id);
    }

    // UPDATE
    public Review updateReview(String id, int newRating,
                               String newComment) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));
        review.setRating(newRating);
        review.setComment(newComment);
        return reviewRepository.save(review);
    }

    // DELETE
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}