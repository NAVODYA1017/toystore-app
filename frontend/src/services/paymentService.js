import axios from 'axios';

const API = 'http://localhost:8080/api/payments';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const createPayment = async (payment) => {
    const res = await axios.post(API, payment, getAuthHeader());
    return res.data;
};

export const getPaymentsByCustomer = async (customerId) => {
    const res = await axios.get(`${API}/customer/${customerId}`, getAuthHeader());
    return res.data;
};

export const getPaymentsByOrder = async (orderId) => {
    const res = await axios.get(`${API}/order/${orderId}`, getAuthHeader());
    return res.data;
};

export const getAllPayments = async () => {
    const res = await axios.get(API, getAuthHeader());
    return res.data;
};

export const updatePaymentStatus = async (id, status) => {
    const res = await axios.put(`${API}/${id}/status`, { status }, getAuthHeader());
    return res.data;
};

export const processPayment = async (id) => {
    const res = await axios.put(`${API}/${id}/process`, {}, getAuthHeader());
    return res.data;
};

export const refundPayment = async (id) => {
    const res = await axios.put(`${API}/${id}/refund`, {}, getAuthHeader());
    return res.data;
};

export const deletePayment = async (id) => {
    await axios.delete(`${API}/${id}`, getAuthHeader());
};
