import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users';

const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    const { token, role, name, id } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('loggedInUser', JSON.stringify({ id, name, email, role }));
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');
};

export const getAllUsers = async () => {
    const response = await axios.get(BASE_URL, { headers: authHeader() });
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`, { headers: authHeader() });
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, userData, { headers: authHeader() });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, { headers: authHeader() });
    return response.data;
};