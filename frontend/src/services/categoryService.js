// src/services/categoryService.js

const BASE_URL = "http://localhost:8080/api/categories";

let categoriesCache = null;
let categoriesCacheTime = 0;
const CACHE_DURATION = 15000; // 15 seconds

export const clearCategoriesCache = () => {
    categoriesCache = null;
    categoriesCacheTime = 0;
};

// Get all categories
export const getAllCategories = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && categoriesCache && (now - categoriesCacheTime < CACHE_DURATION)) {
        return categoriesCache;
    }
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    categoriesCache = data;
    categoriesCacheTime = now;
    return data;
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
    clearCategoriesCache();
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
    clearCategoriesCache();
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
    clearCategoriesCache();
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
