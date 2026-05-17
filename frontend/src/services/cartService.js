const BASE = "http://localhost:8080/api";

// ✅ Safe helper — never crashes on empty response
async function safeJson(res) {
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    try { return JSON.parse(text); } catch { return null; }
}

export async function getCart(customerId) {
    const res = await fetch(`${BASE}/cart/${customerId}`);
    return safeJson(res);
}

export async function addItem(customerId, item) {
    const res = await fetch(`${BASE}/cart/${customerId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    return safeJson(res);
}

export async function updateQuantity(customerId, productId, quantity) {
    const res = await fetch(
        `${BASE}/cart/${customerId}/update/${productId}?quantity=${quantity}`,
        { method: "PUT" }
    );
    return safeJson(res);
}

export async function removeItem(customerId, productId) {
    const res = await fetch(`${BASE}/cart/${customerId}/remove/${productId}`, {
        method: "DELETE",
    });
    return safeJson(res);
}

export async function placeOrder(customerId, paymentMethod) {
    const res = await fetch(
        `${BASE}/orders/${customerId}/place?paymentMethod=${paymentMethod}`,
        { method: "POST" }
    );
    return safeJson(res);
}