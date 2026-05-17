import React, { useState, useEffect } from 'react';

function ReviewList({ onEdit }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/reviews')
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Error fetching reviews:', err));
    }, []);

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8080/api/reviews/${id}`, { method: 'DELETE' });
        setReviews(reviews.filter(r => r.id !== id));
    };

    const renderStars = (rating) => '⭐'.repeat(rating);

    return (
        <div className="list-container">
            <h2>📋 All Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <h3>{renderStars(review.rating)} {review.username}</h3>
                        <p><strong>Product:</strong> {review.productId}</p>
                        <p>{review.comment}</p>
                        <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                        <div className="actions">
                            <button onClick={() => onEdit(review)}>✏️ Edit</button>
                            <button onClick={() => handleDelete(review.id)}>🗑️ Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ReviewList;