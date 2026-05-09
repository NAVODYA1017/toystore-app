import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const { cart, updateQuantity, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    if (cart.items.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "60px" }}>
                <h2>Your cart is empty 🛒</h2>
                <button onClick={() => navigate("/")}>Browse Toys</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
            <h2>🛒 Your Cart</h2>
            {cart.items.map((item) => (
                <div key={item.productId} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    borderBottom: "1px solid #eee", padding: "16px 0"
                }}>
                    <img src={item.imageUrl} alt={item.productName}
                         style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                        <strong>{item.productName}</strong>
                        <p style={{ margin: 0, color: "#666" }}>LKR {item.price.toFixed(2)} each</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                        <span style={{ minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <strong>LKR {(item.price * item.quantity).toFixed(2)}</strong>
                    <button onClick={() => removeItem(item.productId)}
                            style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
                        ✕ Remove
                    </button>
                </div>
            ))}
            <div style={{ textAlign: "right", marginTop: 24 }}>
                <h3>Total: LKR {totalPrice.toFixed(2)}</h3>
                <button onClick={() => navigate("/checkout")}
                        style={{
                            padding: "12px 32px", background: "#1a73e8", color: "#fff",
                            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16
                        }}>
                    Proceed to Checkout →
                </button>
            </div>
        </div>
    );
}