import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .cart-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
  }

  .cart-hero {
    background: linear-gradient(135deg, #1a0533 0%, #2d1052 50%, #1a0533 100%);
    padding: 2.5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .cart-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .cart-hero-inner {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }
  .cart-hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.3rem;
    letter-spacing: -0.5px;
  }
  .cart-hero p {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    margin: 0;
  }

  .cart-body {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 720px) {
    .cart-body { grid-template-columns: 1fr; }
  }

  .cart-items-panel {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #ede9fe;
    overflow: hidden;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid #f5f3ff;
    transition: background 0.15s;
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item:hover { background: #faf8ff; }

  .cart-item-img {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
    background: #f3e8ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    overflow: hidden;
  }
  .cart-item-img img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 12px;
  }

  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  .cart-item-price {
    font-size: 0.82rem;
    color: #9ca3af;
  }

  .qty-control {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f5f3ff;
    border-radius: 100px;
    padding: 4px;
  }
  .qty-btn {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: none;
    background: #fff;
    color: #7c3aed;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(124,58,237,0.15);
    transition: all 0.15s;
  }
  .qty-btn:hover { background: #7c3aed; color: #fff; }
  .qty-num {
    min-width: 22px;
    text-align: center;
    font-weight: 700;
    font-size: 0.88rem;
    color: #111827;
  }

  .cart-item-subtotal {
    font-weight: 700;
    font-size: 0.95rem;
    color: #7c3aed;
    min-width: 64px;
    text-align: right;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #d1d5db;
    cursor: pointer;
    font-size: 1rem;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.15s;
    line-height: 1;
  }
  .remove-btn:hover { color: #ef4444; background: #fee2e2; }

  .summary-panel {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #ede9fe;
    padding: 1.5rem;
    position: sticky;
    top: 1.5rem;
  }
  .summary-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 1.2rem;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    color: #6b7280;
    margin-bottom: 0.6rem;
  }
  .summary-divider {
    border: none;
    border-top: 1px dashed #e5e7eb;
    margin: 1rem 0;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 1.05rem;
    color: #111827;
    margin-bottom: 1.4rem;
  }

  .checkout-btn {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(124,58,237,0.35);
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }

  .continue-btn {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: transparent;
    color: #7c3aed;
    border: 1.5px solid #ede9fe;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .continue-btn:hover { background: #faf5ff; }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 55vh;
    gap: 1rem;
    text-align: center;
    padding: 2rem;
  }
  .empty-icon {
    font-size: 4.5rem;
    animation: bounce 2s ease-in-out infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .empty-cart h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a0533;
    margin: 0;
  }
  .empty-cart p { color: #9ca3af; margin: 0; font-size: 0.9rem; }
  .browse-btn {
    margin-top: 0.5rem;
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(124,58,237,0.3);
    transition: all 0.2s;
  }
  .browse-btn:hover { transform: translateY(-2px); }
`;

export default function CartPage() {
    const { cart, updateQuantity, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
    const shipping = totalPrice > 5000 ? 0 : 350;

    return (
        <>
            <style>{styles}</style>
            <div className="cart-root">
                <div className="cart-hero">
                    <div className="cart-hero-inner">
                        <h1>🛒 Your Cart</h1>
                        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} ready for checkout</p>
                    </div>
                </div>

                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-icon">🧸</div>
                        <h2>Your cart is empty!</h2>
                        <p>Looks like you haven't added any toys yet.</p>
                        <button className="browse-btn" onClick={() => navigate('/shop')}>
                            Browse Toys →
                        </button>
                    </div>
                ) : (
                    <div className="cart-body">
                        {/* Items */}
                        <div className="cart-items-panel">
                            {cart.items.map(item => (
                                <div className="cart-item" key={item.productId}>
                                    <div className="cart-item-img">
                                        {item.imageUrl
                                            ? <img src={item.imageUrl} alt={item.productName} />
                                            : '🧸'}
                                    </div>
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{item.productName}</div>
                                        <div className="cart-item-price">LKR {item.price.toFixed(2)} each</div>
                                    </div>
                                    <div className="qty-control">
                                        <button className="qty-btn"
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                            −
                                        </button>
                                        <span className="qty-num">{item.quantity}</span>
                                        <button className="qty-btn"
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        LKR {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button className="remove-btn"
                                            onClick={() => removeItem(item.productId)}
                                            title="Remove item">✕</button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="summary-panel">
                            <div className="summary-title">Order Summary</div>
                            <div className="summary-row">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>LKR {totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span style={{ color: shipping === 0 ? '#16a34a' : undefined }}>
                                    {shipping === 0 ? 'FREE' : `LKR ${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <div className="summary-row" style={{ fontSize: '0.78rem', color: '#a855f7' }}>
                                    <span>Add LKR {(5000 - totalPrice).toFixed(2)} more for free shipping</span>
                                </div>
                            )}
                            <hr className="summary-divider" />
                            <div className="summary-total">
                                <span>Total</span>
                                <span>LKR {(totalPrice + shipping).toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout →
                            </button>
                            <button className="continue-btn" onClick={() => navigate('/shop')}>
                                ← Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
