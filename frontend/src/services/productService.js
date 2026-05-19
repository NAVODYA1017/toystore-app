import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

let productsCache = null;
let productsCacheTime = 0;
const CACHE_DURATION = 15000; // 15 seconds

export const clearProductsCache = () => {
    productsCache = null;
    productsCacheTime = 0;
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getAllProducts = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && productsCache && (now - productsCacheTime < CACHE_DURATION)) {
        return productsCache;
    }
    const response = await axios.get(API_BASE_URL);
    productsCache = response.data;
    productsCacheTime = now;
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProduct = async (product) => {
    clearProductsCache();
    const response = await axios.post(API_BASE_URL, product, getAuthHeader());
    return response.data;
};

export const updateProduct = async (id, product) => {
    clearProductsCache();
    const response = await axios.put(`${API_BASE_URL}/${id}`, product, getAuthHeader());
    return response.data;
};

export const deleteProduct = async (id) => {
    clearProductsCache();
    await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader());
};
