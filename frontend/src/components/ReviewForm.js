import React, { useState, useEffect } from 'react';

function ReviewForm({ onSave, editReview }) {
    const [formData, setFormData] = useState({
        productId: '',
        userId: '',
        username: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (editReview) {
            setFormData(editReview);
        }
    }, [editReview]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editReview
            ? `http://localhost:8080/api/reviews/${editReview.id}`
            : 'http://localhost:8080/api/reviews';
        const method = editReview ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        setFormData({ productId: '', userId: '', username: '', rating: 5, comment: '' });
        onSave();
    };

    return (
        <div className="form-container">
            <h2>{editReview ? '✏️ Edit Review' : '➕ Add Review'}</h2>
            <form onSubmit={handleSubmit}>
                <input name="productId" placeholder="Product ID" value={formData.productId} onChange={handleChange} required />
                <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} required />
                <input name="username" placeholder="Your Name" value={formData.username} onChange={handleChange} required />
                <select name="rating" value={formData.rating} onChange={handleChange}>
                    <option value={1}>⭐ 1</option>
                    <option value={2}>⭐⭐ 2</option>
                    <option value={3}>⭐⭐⭐ 3</option>
                    <option value={4}>⭐⭐⭐⭐ 4</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5</option>
                </select>
                <textarea name="comment" placeholder="Write your review..." value={formData.comment} onChange={handleChange} required />
                <button type="submit">{editReview ? 'Update Review' : 'Submit Review'}</button>
            </form>
        </div>
    );
}

export default ReviewForm;