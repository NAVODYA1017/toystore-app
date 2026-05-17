import axios from 'axios';

const BASE = 'http://localhost:8080/api/reviews';

const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getAllReviews = () =>
    axios.get(BASE).then(r => r.data);

export const getReviewsByProduct = (productId) =>
    axios.get(`${BASE}/product/${productId}`).then(r => r.data);

export const addReview = (review) =>
    axios.post(BASE, review, authHeader()).then(r => r.data);

export const deleteReview = (id) =>
    axios.delete(`${BASE}/${id}`, authHeader()).then(r => r.data);
