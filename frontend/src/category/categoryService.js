import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/categories';

export const getAllCategories = () => axios.get(BASE_URL);
export const getCategoryById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createCategory = (category) => axios.post(BASE_URL, category);
export const updateCategory = (id, category) => axios.put(`${BASE_URL}/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${BASE_URL}/${id}`);