import { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "../services/cartService";

const CartContext = createContext();

function getCustomerId() {
    try {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        return user.id || user.email || 'guest';
    } catch {
        return 'guest';
    }
}

export function CartProvider({ children }) {
    const [cart, setCart]       = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        try {
            const data = await cartService.getCart(getCustomerId());
            if (data && data.items) setCart(data);
        } catch (err) {
            console.warn("Cart fetch failed, using local state:", err);
        }
    }

    async function addToCart(product, quantity = 1) {
        setLoading(true);
        const item = {
            productId:   product._id || product.id,
            productName: product.name,
            price:       product.price,
            quantity:    quantity,
            imageUrl:    product.imageUrl,
        };

        // Update local state immediately
        setCart(prev => {
            const existing = prev.items.find(i => i.productId === item.productId);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i =>
                        i.productId === item.productId
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    )
                };
            }
            return { ...prev, items: [...prev.items, item] };
        });

        // Try to sync with backend in background
        try {
            const updated = await cartService.addItem(getCustomerId(), item);
            if (updated && updated.items) setCart(updated);
        } catch (err) {
            console.warn("Cart API unavailable, using local state:", err);
        } finally {
            setLoading(false);
        }
    }

    async function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            return removeItem(productId);
        }

        // Update local state immediately
        setCart(prev => ({
            ...prev,
            items: prev.items.map(i =>
                i.productId === productId ? { ...i, quantity } : i
            )
        }));

        try {
            const updated = await cartService.updateQuantity(getCustomerId(), productId, quantity);
            if (updated && updated.items) setCart(updated);
        } catch (err) {
            console.warn("updateQuantity API failed:", err);
        }
    }

    async function removeItem(productId) {
        // Update local state immediately
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(i => i.productId !== productId)
        }));

        try {
            const updated = await cartService.removeItem(getCustomerId(), productId);
            if (updated && updated.items) setCart(updated);
        } catch (err) {
            console.warn("removeItem API failed:", err);
        }
    }

    // ✅ Added: clears cart after order is placed
    function clearCart() {
        setCart({ items: [] });
    }

    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, updateQuantity,
            removeItem, clearCart,          // ✅ clearCart exported
            totalItems, totalPrice, loading
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
