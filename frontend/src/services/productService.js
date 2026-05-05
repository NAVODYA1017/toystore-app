import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

export const getAllProducts = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await axios.post(API_BASE_URL, product);
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};