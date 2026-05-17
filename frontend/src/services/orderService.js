import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllOrders = () =>
    axios.get(API_URL, authHeaders());

// GET /api/orders/my?email=user@example.com
// Reads the logged-in user's email from localStorage
export const getUserOrders = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const email = user.email || user.customerEmail || '';
    return axios.get(`${API_URL}/my`, {
        ...authHeaders(),
        params: { email }
    });
};

export const getOrderById = (id) =>
    axios.get(`${API_URL}/${id}`, authHeaders());

export const createOrder = (order) =>
    axios.post(API_URL, order, authHeaders());

export const updateOrder = (id, order) =>
    axios.put(`${API_URL}/${id}`, order, authHeaders());

export const deleteOrder = (id) =>
    axios.delete(`${API_URL}/${id}`, authHeaders());

// Admin: update order status — uses PUT since backend CORS doesn't allow PATCH
// Fetches the full order first, then saves it back with the new status
export const updateOrderStatus = async (id, status) => {
    const res = await axios.get(`${API_URL}/${id}`, authHeaders());
    const fullOrder = res.data;
    fullOrder.status = status;
    return axios.put(`${API_URL}/${id}`, fullOrder, authHeaders());
};