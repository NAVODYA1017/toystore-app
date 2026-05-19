import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { createPayment } from "../services/paymentService";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .co-root { min-height: 100vh; background: #faf9f7; font-family: 'DM Sans', sans-serif; }

  .co-hero {
    background: linear-gradient(135deg, #1a0533 0%, #2d1052 50%, #1a0533 100%);
    padding: 2.5rem 2rem 3rem; position: relative; overflow: hidden;
  }
  .co-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .co-hero-inner { max-width: 860px; margin: 0 auto; position: relative; }
  .co-hero h1 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin: 0 0 0.3rem; }
  .co-hero p  { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0; }

  .co-steps {
    max-width: 860px; margin: 1.5rem auto 0;
    padding: 0 1.5rem; display: flex; align-items: center;
  }
  .co-step { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; }
  .co-step-num {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
  }
  .co-step.done   .co-step-num { background: #16a34a; color: #fff; }
  .co-step.active .co-step-num { background: #7c3aed; color: #fff; }
  .co-step.idle   .co-step-num { background: #e5e7eb; color: #9ca3af; }
  .co-step.done   .co-step-label { color: #16a34a; }
  .co-step.active .co-step-label { color: #7c3aed; }
  .co-step.idle   .co-step-label { color: #9ca3af; }
  .co-step-line { flex: 1; height: 2px; background: #e5e7eb; margin: 0 8px; }
  .co-step-line.done { background: #16a34a; }

  .co-body {
    max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem;
    display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; align-items: start;
  }
  @media (max-width: 680px) { .co-body { grid-template-columns: 1fr; } }

  .co-panel { background: #fff; border-radius: 18px; border: 1px solid #ede9fe; padding: 1.5rem; }
  .co-section-title {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: #1a0533;
    margin: 0 0 1.1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f5f3ff;
  }

  .co-field { margin-bottom: 1rem; }
  .co-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 6px; }
  .co-input {
    width: 100%; padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #111827;
    box-sizing: border-box; outline: none; transition: border-color 0.2s;
  }
  .co-input:focus { border-color: #7c3aed; }
  .co-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  .payment-option {
    display: flex; align-items: center; gap: 1rem; padding: 1rem 1.1rem;
    border-radius: 14px; border: 2px solid #e5e7eb; cursor: pointer;
    transition: all 0.2s; margin-bottom: 0.75rem; background: #fff;
  }
  .payment-option.selected { border-color: #7c3aed; background: #faf5ff; }
  .payment-option:hover { border-color: #c4b5fd; }
  .payment-option input[type="radio"] { display: none; }
  .payment-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; background: #f5f3ff; flex-shrink: 0;
  }
  .payment-option.selected .payment-icon { background: #ede9fe; }
  .payment-label { flex: 1; }
  .payment-label strong { display: block; font-size: 0.95rem; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .payment-label span  { font-size: 0.78rem; color: #9ca3af; }
  .payment-check {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: transparent; transition: all 0.2s; flex-shrink: 0;
  }
  .payment-option.selected .payment-check { border-color: #7c3aed; background: #7c3aed; color: #fff; }

  .card-fields {
    background: #faf5ff; border-radius: 14px;
    padding: 1rem; margin-top: 1rem; border: 1px solid #ede9fe;
  }

  .order-item {
    display: flex; gap: 0.75rem; align-items: center;
    padding: 0.6rem 0; border-bottom: 1px solid #f5f3ff;
  }
  .order-item:last-child { border-bottom: none; }
  .order-item-img {
    width: 44px; height: 44px; border-radius: 8px; object-fit: cover;
    background: #f3e8ff; flex-shrink: 0; display: flex;
    align-items: center; justify-content: center; font-size: 1.1rem; overflow: hidden;
  }
  .order-item-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
  .order-item-name {
    flex: 1; font-size: 0.85rem; font-weight: 500; color: #111827;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .order-item-qty   { font-size: 0.78rem; color: #9ca3af; }
  .order-item-price { font-size: 0.88rem; font-weight: 600; color: #7c3aed; }

  .co-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 0.9rem 0; }
  .co-row   { display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem; }
  .co-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.05rem; color: #111827; margin-bottom: 1.25rem; }

  .pay-btn {
    width: 100%; padding: 1rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
    cursor: pointer; box-shadow: 0 4px 18px rgba(124,58,237,0.35);
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .pay-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .pay-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .next-btn {
    width: 100%; padding: 1rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
    cursor: pointer; margin-top: 1rem; transition: all 0.2s;
  }
  .next-btn:hover { transform: translateY(-2px); }

  .back-btn {
    background: none; border: none; color: #7c3aed;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; padding: 0; margin-bottom: 1.5rem;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .back-btn:hover { text-decoration: underline; }

  .secure-note {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 0.78rem; color: #9ca3af; margin-top: 0.75rem;
  }

  .error-msg {
    background: #fee2e2; color: #dc2626; border-radius: 10px;
    padding: 0.6rem 1rem; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; display: inline-block;
    animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 6px;
  }
`;

const PAYMENT_OPTIONS = [
    { value: 'CARD', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex accepted' },
    { value: 'COD',  icon: '💵', label: 'Cash on Delivery',    sub: 'Pay when your order arrives' },
];

export default function CheckoutPage() {
    const { totalPrice, cart, clearCart } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [address, setAddress] = useState({
        fullName: '', phone: '', street: '', city: '', district: '', postalCode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '', expiry: '', cvv: '', cardName: ''
    });

    const [loading, setLoading]     = useState(false);
    const [addrError, setAddrError] = useState('');
    const [payError, setPayError]   = useState('');

    // Read logged-in user from localStorage
    const user         = JSON.parse(localStorage.getItem('user') || localStorage.getItem('loggedInUser') || '{}');
    const customerEmail = user.email || user.customerEmail || '';
    const customerName  = user.name  || user.fullName || address.fullName;

    const shipping   = totalPrice > 5000 ? 0 : 350;
    const grandTotal = totalPrice + shipping;

    // ── Step 1: Validate address ──────────────────────────────
    function handleNextStep() {
        const { fullName, phone, street, city, district } = address;
        if (!fullName || !phone || !street || !city || !district) {
            setAddrError('Please fill in all required fields.');
            return;
        }
        if (!/^\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
            setAddrError('Please enter a valid phone number.');
            return;
        }
        setAddrError('');
        setStep(2);
    }

    // ── Step 2: Place order ───────────────────────────────────
    async function handlePayment() {
        if (!cart.items || cart.items.length === 0) return;
        setPayError('');

        setLoading(true);
        try {
            let lastSavedOrder = null;

            // Loop through all items in the cart to place an order for each one
            for (const item of cart.items) {
                const itemShippingShare = shipping / cart.items.length;
                const itemTotal = (item.price * item.quantity) + itemShippingShare;

                const orderPayload = {
                    customerName:    address.fullName,
                    customerEmail:   customerEmail,
                    phoneNumber:     address.phone,
                    deliveryAddress: `${address.street}, ${address.city}, ${address.district}${address.postalCode ? ', ' + address.postalCode : ''}`,
                    productId:       item?.productId || item?.id || item?._id,
                    productName:     item?.productName || item?.name || 'Product',
                    quantity:        item?.quantity || 1,
                    totalPrice:      itemTotal,
                    paymentMethod:   paymentMethod,
                    // CARD = confirmed immediately, COD = pending until admin confirms
                    status:          paymentMethod === 'CARD' ? 'CONFIRMED' : 'PENDING',
                };

                const response = await createOrder(orderPayload);
                const savedOrder = response.data || response;
                lastSavedOrder = savedOrder;

                // Create payment record
                const paymentPayload = {
                    orderId: savedOrder.id || savedOrder._id || `ORD-${Date.now()}`,
                    customerId: user.id || user._id || 'GUEST',
                    customerName: address.fullName,
                    amount: itemTotal,
                    paymentMethod: paymentMethod === 'CARD' ? 'CREDIT_CARD' : 'CASH_ON_DELIVERY',
                    status: paymentMethod === 'CARD' ? 'COMPLETED' : 'PENDING',
                    transactionId: `TXN-${Math.floor(Math.random() * 100000000)}`,
                    paymentDate: new Date().toISOString()
                };
                
                try {
                    await createPayment(paymentPayload);
                } catch (err) {
                    console.error("Payment record creation failed, but order was saved", err);
                }
            }

            clearCart();
            navigate('/orders/confirm', { state: { order: lastSavedOrder } });
        } catch (err) {
            console.error('Order creation failed:', err);
            setPayError('Failed to place order. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    // ── Order Summary sidebar ─────────────────────────────────
    const OrderSummary = () => (
        <div className="co-panel">
            <div className="co-section-title">Order Summary</div>
            <div>
                {cart.items.map(item => (
                    <div className="order-item" key={item.productId}>
                        <div className="order-item-img">
                            {item.imageUrl
                                ? <img src={item.imageUrl} alt={item.productName} />
                                : '🧸'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="order-item-name">{item.productName || item.name}</div>
                            <div className="order-item-qty">Qty: {item.quantity}</div>
                        </div>
                        <div className="order-item-price">
                            LKR {(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            <hr className="co-divider" />
            <div className="co-row">
                <span>Subtotal</span>
                <span>LKR {totalPrice.toFixed(2)}</span>
            </div>
            <div className="co-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#16a34a' : undefined }}>
                    {shipping === 0 ? 'FREE' : `LKR ${shipping.toFixed(2)}`}
                </span>
            </div>
            {shipping > 0 && (
                <div className="co-row" style={{ fontSize: '0.78rem', color: '#a855f7' }}>
                    <span>Add LKR {(5000 - totalPrice).toFixed(2)} more for free shipping</span>
                </div>
            )}
            <hr className="co-divider" />
            <div className="co-total">
                <span>Total</span>
                <span>LKR {grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="co-root">

                <div className="co-hero">
                    <div className="co-hero-inner">
                        <h1>Checkout</h1>
                        <p>Complete your order securely</p>
                    </div>
                </div>

                <div className="co-steps">
                    <div className={`co-step ${step > 1 ? 'done' : 'active'}`}>
                        <div className="co-step-num">{step > 1 ? '✓' : '1'}</div>
                        <span className="co-step-label">Delivery Address</span>
                    </div>
                    <div className={`co-step-line ${step > 1 ? 'done' : ''}`} />
                    <div className={`co-step ${step === 2 ? 'active' : 'idle'}`}>
                        <div className="co-step-num">2</div>
                        <span className="co-step-label">Payment</span>
                    </div>
                </div>

                <div className="co-body">

                    {/* ── Step 1: Delivery Address ── */}
                    {step === 1 && (
                        <div>
                            <button className="back-btn" onClick={() => navigate('/cart')}>
                                ← Back to Cart
                            </button>
                            <div className="co-panel">
                                <div className="co-section-title">📍 Delivery Address</div>

                                {addrError && <div className="error-msg">⚠️ {addrError}</div>}

                                <div className="co-field">
                                    <label className="co-label">Full Name *</label>
                                    <input className="co-input" placeholder="e.g. Kasun Perera"
                                           value={address.fullName}
                                           onChange={e => setAddress({ ...address, fullName: e.target.value })} />
                                </div>
                                <div className="co-field">
                                    <label className="co-label">Phone Number *</label>
                                    <input className="co-input" placeholder="e.g. 0771234567"
                                           value={address.phone}
                                           onChange={e => setAddress({ ...address, phone: e.target.value })} />
                                </div>
                                <div className="co-field">
                                    <label className="co-label">Street Address *</label>
                                    <input className="co-input" placeholder="e.g. 42 Galle Road"
                                           value={address.street}
                                           onChange={e => setAddress({ ...address, street: e.target.value })} />
                                </div>
                                <div className="co-row-2">
                                    <div className="co-field">
                                        <label className="co-label">City *</label>
                                        <input className="co-input" placeholder="e.g. Colombo"
                                               value={address.city}
                                               onChange={e => setAddress({ ...address, city: e.target.value })} />
                                    </div>
                                    <div className="co-field">
                                        <label className="co-label">District *</label>
                                        <input className="co-input" placeholder="e.g. Colombo"
                                               value={address.district}
                                               onChange={e => setAddress({ ...address, district: e.target.value })} />
                                    </div>
                                </div>
                                <div className="co-field">
                                    <label className="co-label">Postal Code</label>
                                    <input className="co-input" placeholder="e.g. 10300"
                                           value={address.postalCode}
                                           onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
                                </div>

                                <button className="next-btn" onClick={handleNextStep}>
                                    Continue to Payment →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Payment ── */}
                    {step === 2 && (
                        <div>
                            <button className="back-btn" onClick={() => setStep(1)}>
                                ← Back to Address
                            </button>
                            <div className="co-panel">
                                <div className="co-section-title">💳 Payment Method</div>

                                {payError && <div className="error-msg">⚠️ {payError}</div>}

                                {PAYMENT_OPTIONS.map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`payment-option${paymentMethod === opt.value ? ' selected' : ''}`}
                                        onClick={() => setPaymentMethod(opt.value)}
                                    >
                                        <input type="radio" name="payment" value={opt.value} readOnly />
                                        <div className="payment-icon">{opt.icon}</div>
                                        <div className="payment-label">
                                            <strong>{opt.label}</strong>
                                            <span>{opt.sub}</span>
                                        </div>
                                        <div className="payment-check">✓</div>
                                    </label>
                                ))}

                                {paymentMethod === 'CARD' && (
                                    <div className="card-fields">
                                        <div className="co-field">
                                            <label className="co-label">Cardholder Name</label>
                                            <input className="co-input" placeholder="Name on card"
                                                   value={cardDetails.cardName}
                                                   onChange={e => setCardDetails({ ...cardDetails, cardName: e.target.value })} />
                                        </div>
                                        <div className="co-field">
                                            <label className="co-label">Card Number</label>
                                            <input className="co-input" placeholder="1234 5678 9012 3456"
                                                   maxLength={19}
                                                   value={cardDetails.cardNumber}
                                                   onChange={e => {
                                                       const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                                                       const fmt = v.replace(/(.{4})/g, '$1 ').trim();
                                                       setCardDetails({ ...cardDetails, cardNumber: fmt });
                                                   }} />
                                        </div>
                                        <div className="co-row-2">
                                            <div className="co-field">
                                                <label className="co-label">Expiry Date</label>
                                                <input className="co-input" placeholder="MM/YY" maxLength={5}
                                                       value={cardDetails.expiry}
                                                       onChange={e => {
                                                           let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                           if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                                                           setCardDetails({ ...cardDetails, expiry: v });
                                                       }} />
                                            </div>
                                            <div className="co-field">
                                                <label className="co-label">CVV</label>
                                                <input className="co-input" placeholder="123"
                                                       maxLength={3} type="password"
                                                       value={cardDetails.cvv}
                                                       onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Summary — always on right */}
                    <div>
                        <OrderSummary />
                        {step === 2 && (
                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    className="pay-btn"
                                    onClick={handlePayment}
                                    disabled={loading || !cart.items || cart.items.length === 0}
                                >
                                    {loading
                                        ? <><span className="spinner" />Processing…</>
                                        : `Place Order — LKR ${grandTotal.toFixed(2)}`}
                                </button>
                                <div className="secure-note">🔒 Secured & encrypted checkout</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
