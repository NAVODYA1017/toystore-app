import { useState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/cartService";
import { useNavigate } from "react-router-dom";

const CUSTOMER_ID = "customer_001";

export default function CheckoutPage() {
    const { totalPrice, cart }              = useCart();
    const [paymentMethod, setPaymentMethod] = useState("CARD");
    const [loading, setLoading]             = useState(false);
    const navigate = useNavigate();

    async function handlePayment() {
        if (cart.items.length === 0) return;
        setLoading(true);
        try {
            const order = await placeOrder(CUSTOMER_ID, paymentMethod);
            if (order.paymentStatus === "SUCCESS") {
                navigate("/order-confirm", { state: { order } });
            } else {
                alert("Payment failed. Please try again.");
            }
        } catch (e) {
            alert("Something went wrong.");
        }
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
            <h2>Checkout</h2>
            <div style={{ background: "#f8f9fa", padding: 20, borderRadius: 8, marginBottom: 24 }}>
                <p><strong>{cart.items.length} item(s)</strong> in your order</p>
                <h3>Total: LKR {totalPrice.toFixed(2)}</h3>
            </div>
            <h3>Select Payment Method</h3>
            <label style={{ display: "flex", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                <input type="radio" value="CARD"
                       checked={paymentMethod === "CARD"}
                       onChange={() => setPaymentMethod("CARD")} />
                💳 Credit / Debit Card
            </label>
            <label style={{ display: "flex", gap: 10, cursor: "pointer" }}>
                <input type="radio" value="COD"
                       checked={paymentMethod === "COD"}
                       onChange={() => setPaymentMethod("COD")} />
                💵 Cash on Delivery
            </label>
            <button onClick={handlePayment} disabled={loading}
                    style={{
                        marginTop: 32, width: "100%", padding: "14px",
                        background: loading ? "#ccc" : "#34a853",
                        color: "#fff", border: "none", borderRadius: 8,
                        fontSize: 16, cursor: loading ? "not-allowed" : "pointer"
                    }}>
                {loading ? "Processing..." : `Pay LKR ${totalPrice.toFixed(2)}`}
            </button>
        </div>
    );
}