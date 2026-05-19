const BASE = "http://localhost:8080/api";

// ✅ Helper to get authorization headers with JWT
const getHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem('token');
    return {
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// ✅ Safe helper — never crashes on empty response
async function safeJson(res) {
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    try { return JSON.parse(text); } catch { return null; }
}

export async function getCart(customerId) {
    const res = await fetch(`${BASE}/cart/${customerId}`, {
        headers: getHeaders()
    });
    return safeJson(res);
}

export async function addItem(customerId, item) {
    const res = await fetch(`${BASE}/cart/${customerId}/add`, {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(item),
    });
    return safeJson(res);
}

export async function updateQuantity(customerId, productId, quantity) {
    const res = await fetch(
        `${BASE}/cart/${customerId}/update/${productId}?quantity=${quantity}`,
        {
            method: "PUT",
            headers: getHeaders()
        }
    );
    return safeJson(res);
}

export async function removeItem(customerId, productId) {
    const res = await fetch(`${BASE}/cart/${customerId}/remove/${productId}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    return safeJson(res);
}

export async function placeOrder(customerId, paymentMethod) {
    const res = await fetch(
        `${BASE}/orders/${customerId}/place?paymentMethod=${paymentMethod}`,
        {
            method: "POST",
            headers: getHeaders()
        }
    );
    return safeJson(res);
}
