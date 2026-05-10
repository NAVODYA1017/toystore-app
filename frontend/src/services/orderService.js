import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

export const getAllOrders = () => axios.get(API_URL);
export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);
export const createOrder = (order) => axios.post(API_URL, order);
export const updateOrder = (id, order) => axios.put(`${API_URL}/${id}`, order);
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);
