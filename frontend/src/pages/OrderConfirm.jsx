import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirm() {
    const { state } = useLocation();
    const navigate  = useNavigate();
    const order     = state?.order;

    return (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <h2>Order Placed Successfully!</h2>
            {order && (
                <>
                    <p>Order ID: <strong>{order.id}</strong></p>
                    <p>Total Paid: <strong>LKR {order.totalAmount.toFixed(2)}</strong></p>
                    <p>Payment: <strong>{order.paymentMethod}</strong></p>
                </>
            )}
            <button onClick={() => navigate("/")}
                    style={{
                        marginTop: 24, padding: "12px 32px",
                        background: "#1a73e8", color: "#fff",
                        border: "none", borderRadius: 8, cursor: "pointer"
                    }}>
                Continue Shopping 🧸
            </button>
        </div>
    );
}