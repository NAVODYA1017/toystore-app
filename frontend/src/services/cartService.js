const BASE = "http://localhost:8080/api";

export async function getCart(customerId) {
    const res = await fetch(`${BASE}/cart/${customerId}`);
    return res.json();
}

export async function addItem(customerId, item) {
    const res = await fetch(`${BASE}/cart/${customerId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    return res.json();
}

export async function updateQuantity(customerId, productId, quantity) {
    const res = await fetch(
        `${BASE}/cart/${customerId}/update/${productId}?quantity=${quantity}`,
        { method: "PUT" }
    );
    return res.json();
}

export async function removeItem(customerId, productId) {
    const res = await fetch(`${BASE}/cart/${customerId}/remove/${productId}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function placeOrder(customerId, paymentMethod) {
    const res = await fetch(
        `${BASE}/orders/${customerId}/place?paymentMethod=${paymentMethod}`,
        { method: "POST" }
    );
    return res.json();
}