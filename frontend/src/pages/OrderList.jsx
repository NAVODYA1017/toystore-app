import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders, deleteOrder } from '../services/orderService';
import { getAllProducts } from '../services/productService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .ol-root { min-height: 100vh; background: #faf9f7; font-family: 'DM Sans', sans-serif; }

  .ol-hero {
    background: linear-gradient(135deg, #1a0533 0%, #2d1052 50%, #1a0533 100%);
    padding: 2.5rem 2rem 3rem; position: relative; overflow: hidden;
  }
  .ol-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .ol-hero-inner { max-width: 860px; margin: 0 auto; position: relative; }
  .ol-hero h1 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin: 0 0 0.3rem; }
  .ol-hero p  { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0; }

  .ol-body { max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem; }

  .ol-card {
    background: #fff; border-radius: 18px; border: 1px solid #ede9fe;
    margin-bottom: 1rem; overflow: hidden;
    box-shadow: 0 2px 12px rgba(124,58,237,0.06); transition: box-shadow 0.2s;
  }
  .ol-card:hover { box-shadow: 0 6px 24px rgba(124,58,237,0.12); }

  .ol-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.4rem; border-bottom: 1px solid #f5f3ff; flex-wrap: wrap; gap: 0.5rem;
  }

  .ol-order-id { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 800; color: #7c3aed; }

  .ol-status { padding: 4px 14px; border-radius: 100px; font-size: 0.78rem; font-weight: 700; }
  .ol-PENDING   { background: #fef3c7; color: #d97706; }
  .ol-CONFIRMED { background: #dbeafe; color: #2563eb; }
  .ol-SHIPPED   { background: #ede9fe; color: #7c3aed; }
  .ol-DELIVERED { background: #dcfce7; color: #15803d; }
  .ol-CANCELLED { background: #fee2e2; color: #dc2626; }

  .ol-card-body { padding: 1.1rem 1.4rem; }

  .ol-meta { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
  .ol-meta-label { font-size: 0.72rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
  .ol-meta-value { font-size: 0.9rem; color: #111827; font-weight: 600; }

  .ol-product-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.8rem; background: #faf8ff; border-radius: 10px;
    border: 1px solid #ede9fe; margin-top: 0.5rem;
  }
  .ol-product-name { font-weight: 600; color: #1a0533; }
  .ol-product-qty  { font-size: 0.85rem; color: #9ca3af; margin-top: 2px; }
  .ol-product-price { font-family: 'Syne', sans-serif; font-weight: 800; color: #7c3aed; }

  .ol-card-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.9rem 1.4rem; background: #faf8ff; border-top: 1px solid #f5f3ff;
  }
  .ol-total { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: #1a0533; }

  .ol-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; gap: 1rem; text-align: center; padding: 2rem; }
  .ol-empty-icon { font-size: 4.5rem; animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .ol-empty h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #1a0533; margin: 0; }
  .ol-empty p  { color: #9ca3af; margin: 0; font-size: 0.9rem; }
  .ol-shop-btn {
    margin-top: 0.5rem; padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
    cursor: pointer; box-shadow: 0 4px 18px rgba(124,58,237,0.3); transition: all 0.2s;
  }
  .ol-shop-btn:hover { transform: translateY(-2px); }
`;

const STATUS_LABEL = {
    PENDING:   '🕐 Pending',
    CONFIRMED: '✅ Confirmed',
    SHIPPED:   '🚚 Shipped',
    DELIVERED: '📦 Delivered',
    CANCELLED: '❌ Cancelled',
};

function OrderList() {
    const [orders, setOrders]   = useState([]);
    const [productMap, setProductMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const navigate = useNavigate();

    useEffect(() => { loadOrders(); loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const data = await getAllProducts();
            const map = {};
            data.forEach(p => { map[p.name] = p._id || p.id; });
            setProductMap(map);
        } catch (e) { console.error("Could not load products for map", e); }
    };

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserOrders();
            const data = response.data || [];
            // Sort newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(data);
        } catch (err) {
            setError('Could not load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            await deleteOrder(id);
            setOrders(prev => prev.filter(o => o.id !== id));
        } catch {
            alert('Failed to delete. Please try again.');
        }
    };

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-LK', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <style>{styles}</style>
            <div className="ol-root animate-fade-in">
                <div className="ol-hero">
                    <div className="ol-hero-inner">
                        <h1>📋 My Orders</h1>
                        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
                    </div>
                </div>

                <div className="ol-body">
                    {loading && (
                        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
                            Loading your orders…
                        </div>
                    )}

                    {error && !loading && (
                        <div style={{ textAlign: 'center', padding: 32, color: '#dc2626' }}>
                            {error}
                            <br />
                            <button onClick={loadOrders} style={{
                                marginTop: 12, padding: '8px 20px', borderRadius: 8,
                                border: '1px solid #dc2626', background: '#fff',
                                color: '#dc2626', cursor: 'pointer'
                            }}>Retry</button>
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <div className="ol-empty">
                            <div className="ol-empty-icon">🛒</div>
                            <h2>No orders yet!</h2>
                            <p>Looks like you haven't placed any orders.</p>
                            <button className="ol-shop-btn" onClick={() => navigate('/shop')}>
                                Browse Toys →
                            </button>
                        </div>
                    )}

                    {!loading && !error && orders.map(order => {
                        const status = (order.status || 'PENDING').toUpperCase();

                        return (
                            <div className="ol-card" key={order.id}>

                                {/* Header */}
                                <div className="ol-card-header">
                                    <span className="ol-order-id">
                                        #{String(order.id || '').slice(-8).toUpperCase()}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className={`ol-status ol-${status}`}>
                                            {STATUS_LABEL[status] || status}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '1rem', padding: '2px 6px', borderRadius: 6 }}
                                            onMouseOver={e => e.target.style.color = '#ef4444'}
                                            onMouseOut={e  => e.target.style.color = '#d1d5db'}
                                            title="Delete order"
                                        >✕</button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="ol-card-body">
                                    <div className="ol-meta">
                                        <div>
                                            <div className="ol-meta-label">Date</div>
                                            <div className="ol-meta-value">{formatDate(order.createdAt)}</div>
                                        </div>
                                        <div>
                                            <div className="ol-meta-label">Customer</div>
                                            <div className="ol-meta-value">{order.customerName || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="ol-meta-label">Phone</div>
                                            <div className="ol-meta-value">{order.phoneNumber || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="ol-meta-label">Payment</div>
                                            <div className="ol-meta-value">
                                                {order.paymentMethod === 'CARD' ? '💳 Card' : '💵 Cash on Delivery'}
                                            </div>
                                        </div>
                                        {order.deliveryAddress && (
                                            <div>
                                                <div className="ol-meta-label">Deliver to</div>
                                                <div className="ol-meta-value">📍 {order.deliveryAddress}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product */}
                                    {order.productName && (
                                        <div className="ol-product-row">
                                            <div>
                                                <div className="ol-product-name">🧸 {order.productName}</div>
                                                <div className="ol-product-qty">Qty: {order.quantity}</div>
                                            </div>
                                            <div className="ol-product-price">
                                                LKR {Number(order.totalPrice || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="ol-card-footer">
                                    <div className="ol-total">
                                        Total: LKR {Number(order.totalPrice || 0).toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                                        {order.customerEmail}
                                    </div>
                                </div>

                                {/* Review section — only for DELIVERED orders */}
                                {status === 'DELIVERED' && (
                                    <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid #f5f3ff', background: '#fff' }}>
                                        <button
                                            onClick={() => {
                                                const pId = order.productId || productMap[order.productName];
                                                if (pId) {
                                                    navigate(`/review/${pId}`);
                                                } else {
                                                    alert("Sorry, we couldn't find the product ID to review.");
                                                }
                                            }}
                                            style={{
                                                width: '100%', padding: '0.9rem',
                                                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                                color: '#fff', border: 'none', borderRadius: '12px',
                                                fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', fontWeight: 800,
                                                cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                            onMouseOut={e => e.target.style.transform = 'none'}
                                        >
                                            ⭐ Leave a Review & Rating
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default OrderList;