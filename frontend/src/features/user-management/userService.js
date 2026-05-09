import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users';

// ✅ Helper — adds JWT token to every request
const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Register
export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
};

// Login — now saves token and role
export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    const { token, role, name } = response.data;

    // ✅ Save token and role to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('loggedInUser', JSON.stringify({ name, email, role }));

    return response.data;
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');
};

// Get all users (Admin only)
export const getAllUsers = async () => {
    const response = await axios.get(BASE_URL, { headers: authHeader() });
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`, { headers: authHeader() });
    return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, userData, { headers: authHeader() });
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, { headers: authHeader() });
    return response.data;
};