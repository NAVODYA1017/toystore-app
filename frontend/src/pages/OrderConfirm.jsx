import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

  .oc-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .oc-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid #ede9fe;
    padding: 2.5rem 2rem;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 8px 40px rgba(124,58,237,0.1);
    animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }

  .oc-check {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.2rem;
    margin: 0 auto 1.5rem;
    box-shadow: 0 6px 24px rgba(22,163,74,0.3);
    animation: scaleIn 0.4s 0.2s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }
  @keyframes scaleIn {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  .oc-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
    color: #1a0533;
    margin-bottom: 0.5rem;
  }
  .oc-sub {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1.8rem;
  }

  .oc-details {
    background: #faf5ff;
    border-radius: 16px;
    border: 1px solid #ede9fe;
    padding: 1.2rem 1.4rem;
    margin-bottom: 1.8rem;
    text-align: left;
  }
  .oc-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3e8ff;
    font-size: 0.88rem;
  }
  .oc-detail-row:last-child { border-bottom: none; }
  .oc-detail-label { color: #9ca3af; font-weight: 500; }
  .oc-detail-value { font-weight: 700; color: #1a0533; }
  .oc-detail-value.purple { color: #7c3aed; }
  .oc-detail-value.green  { color: #16a34a; }

  .oc-actions { display: flex; gap: 0.75rem; flex-direction: column; }

  .oc-btn-primary {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(124,58,237,0.3);
    transition: all 0.2s;
  }
  .oc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }

  .oc-btn-secondary {
    width: 100%;
    padding: 0.9rem;
    background: transparent;
    color: #7c3aed;
    border: 1.5px solid #ede9fe;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .oc-btn-secondary:hover { background: #faf5ff; }

  .oc-confetti {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    animation: bounce 1.5s ease-in-out infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;

export default function OrderConfirm() {
    const { state } = useLocation();
    const navigate  = useNavigate();
    const order = state?.order;

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const formatDate = (dt) => {
        if (!dt) return new Date().toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' });
        return new Date(dt).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <>
            <style>{styles}</style>
            <div className="oc-root">
                <div className="oc-card">
                    <div className="oc-confetti">🎉</div>
                    <div className="oc-check">✓</div>
                    <h1 className="oc-title">Order Placed!</h1>
                    <p className="oc-sub">
                        Thank you for your purchase! Your order has been confirmed and will be on its way soon.
                    </p>

                    {order && (
                        <div className="oc-details">
                            {order.id && (
                                <div className="oc-detail-row">
                                    <span className="oc-detail-label">Order ID</span>
                                    <span className="oc-detail-value purple">#{order.id}</span>
                                </div>
                            )}
                            <div className="oc-detail-row">
                                <span className="oc-detail-label">Date</span>
                                <span className="oc-detail-value">{formatDate(order.createdAt || order.orderDate)}</span>
                            </div>
                            {(order.totalPrice || order.totalAmount) && (
                                <div className="oc-detail-row">
                                    <span className="oc-detail-label">Total Paid</span>
                                    <span className="oc-detail-value">LKR {Number(order.totalPrice || order.totalAmount).toFixed(2)}</span>
                                </div>
                            )}
                            {order.paymentMethod && (
                                <div className="oc-detail-row">
                                    <span className="oc-detail-label">Payment</span>
                                    <span className="oc-detail-value">
                                        {order.paymentMethod === 'CARD' ? '💳 Card' : '💵 Cash on Delivery'}
                                    </span>
                                </div>
                            )}
                            <div className="oc-detail-row">
                                <span className="oc-detail-label">Status</span>
                                <span className="oc-detail-value green">✓ Confirmed</span>
                            </div>
                        </div>
                    )}

                    <div className="oc-actions">
                        <button className="oc-btn-primary" onClick={() => navigate('/orders')}>
                            View My Orders
                        </button>
                        <button className="oc-btn-secondary" onClick={() => navigate('/shop')}>
                            Continue Shopping →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}