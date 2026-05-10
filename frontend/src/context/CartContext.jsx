import { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "../services/cartService";

const CartContext = createContext();
const CUSTOMER_ID = "customer_001";

export function CartProvider({ children }) {
    const [cart, setCart]       = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        const data = await cartService.getCart(CUSTOMER_ID);
        setCart(data);
    }

    async function addToCart(product, quantity = 1) {
        setLoading(true);
        const item = {
            productId:   product._id,
            productName: product.name,
            price:       product.price,
            quantity:    quantity,
            imageUrl:    product.imageUrl,
        };
        const updated = await cartService.addItem(CUSTOMER_ID, item);
        setCart(updated);
        setLoading(false);
    }

    async function updateQuantity(productId, quantity) {
        const updated = await cartService.updateQuantity(CUSTOMER_ID, productId, quantity);
        setCart(updated);
    }

    async function removeItem(productId) {
        const updated = await cartService.removeItem(CUSTOMER_ID, productId);
        setCart(updated);
    }

    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, updateQuantity,
            removeItem, totalItems, totalPrice, loading
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}