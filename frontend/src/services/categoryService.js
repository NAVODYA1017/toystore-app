// src/services/categoryService.js

const BASE_URL = "http://localhost:8080/api/categories";

// Get all categories
export const getAllCategories = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
};

// Get single category by ID
export const getCategoryById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Category not found");
    return response.json();
};

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

// Create new category
export const createCategory = async (categoryData) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create category");
    }
    return response.json();
};

// Update existing category
export const updateCategory = async (id, categoryData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update category");
    }
    return response.json();
};

// Delete category
export const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete category");
    }
    return response.text();
};
