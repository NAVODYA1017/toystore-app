import React, { useEffect, useState } from 'react';
import { updateOrderStatus } from '../../services/orderService';

export default function AdminOrders() {
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // order id being updated

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setOrders(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            // Update locally so UI reflects change immediately
            setOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch (err) {
            const msg = err?.response?.data?.message
                || err?.response?.data
                || err?.message
                || 'Unknown error';
            alert(`Failed to update status: ${msg}`);
        } finally {
            setUpdating(null);
        }
    };

    const statusColor = {
        PENDING:   { bg: '#fef3c7', text: '#d97706' },
        CONFIRMED: { bg: '#dbeafe', text: '#2563eb' },
        SHIPPED:   { bg: '#ede9fe', text: '#7c3aed' },
        DELIVERED: { bg: '#dcfce7', text: '#16a34a' },
        CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
    };

    const allStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    // Derive customer display name from order — backend may send
    // customerName, userName, user.name, or fall back to userId/customerId
    const getCustomer = (order) =>
        order.customerName
        || order.userName
        || order.user?.name
        || order.user?.email
        || order.userId
        || order.customerId
        || 'N/A';

    return (
        <div style={{ padding: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, color: '#1a1a2e' }}>
                Orders
            </h1>
            <p style={{ color: '#888', marginBottom: 32 }}>
                Manage all customer orders
            </p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
                    Loading orders…
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
                    No orders yet.
                </div>
            ) : (
                <div style={{
                    background: '#fff', borderRadius: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f8f4ff' }}>
                            {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                                <th key={h} style={{
                                    padding: '14px 16px', textAlign: 'left',
                                    fontSize: 13, color: '#4a2d8f', fontWeight: 700
                                }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, i) => {
                            const status = order.status || 'PENDING';
                            const colors = statusColor[status] || { bg: '#f3f4f6', text: '#6b7280' };
                            const isUpdating = updating === order.id;

                            return (
                                <tr
                                    key={order.id || i}
                                    style={{ borderTop: '1px solid #f0f0f0' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >
                                    {/* Order ID */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>
                                        #{(order.id || '').toString().slice(-8).toUpperCase()}
                                    </td>

                                    {/* Customer — who placed the order */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                                            {getCustomer(order)}
                                        </div>
                                        {order.deliveryAddress?.city && (
                                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                                                📍 {order.deliveryAddress.city}
                                            </div>
                                        )}
                                    </td>

                                    {/* Amount */}
                                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#4a2d8f' }}>
                                        LKR {Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                                    </td>

                                    {/* Payment method */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>
                                        {order.paymentMethod === 'CARD' ? '💳 Card' : '💵 COD'}
                                    </td>

                                    {/* Status badge */}
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                background: colors.bg,
                                                color: colors.text,
                                                padding: '4px 12px',
                                                borderRadius: 20,
                                                fontSize: 12,
                                                fontWeight: 700,
                                            }}>
                                                {status}
                                            </span>
                                    </td>

                                    {/* Date */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>
                                        {order.orderDate || order.createdAt
                                            ? new Date(order.orderDate || order.createdAt).toLocaleDateString('en-LK', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })
                                            : 'N/A'}
                                    </td>

                                    {/* Action — status dropdown */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <select
                                            value={status}
                                            disabled={isUpdating}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: 8,
                                                border: '1px solid #e5e7eb',
                                                fontSize: 13,
                                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                                background: isUpdating ? '#f9fafb' : '#fff',
                                                color: colors.text,
                                                fontWeight: 600,
                                                outline: 'none',
                                            }}
                                        >
                                            {allStatuses.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {isUpdating && (
                                            <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>
                                                    Saving…
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}