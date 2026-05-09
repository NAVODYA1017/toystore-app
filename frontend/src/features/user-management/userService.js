import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users';

// Register
export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
};

// Login
export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
};

// Get all users
export const getAllUsers = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, userData);
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};