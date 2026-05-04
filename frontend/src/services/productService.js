const API_URL = 'http://localhost:8080/api/products';

export const getProducts = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    return response.json();
};

export const deleteProduct = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};