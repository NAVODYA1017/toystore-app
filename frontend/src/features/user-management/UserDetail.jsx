import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, deleteUser } from './userService';

const RANKS = [
    { name: 'Bronze',   min: 1,  max: 4,  icon: '🥉', color: '#cd7f32', bg: '#fdf3e7', border: '#e8c07a' },
    { name: 'Silver',   min: 5,  max: 9,  icon: '🥈', color: '#7a8a9a', bg: '#f0f4f8', border: '#a8bac9' },
    { name: 'Gold',     min: 10, max: 14, icon: '🥇', color: '#c8960c', bg: '#fffbea', border: '#f0d060' },
    { name: 'Platinum', min: 15, max: 19, icon: '💎', color: '#0097a7', bg: '#e0f7fa', border: '#4dd0e1' },
    { name: 'Diamond',  min: 20, max: 999,icon: '💠', color: '#7c3aed', bg: '#f3e8ff', border: '#c4b5fd' },
];

function getRank(totalItems) {
    return RANKS.find(r => totalItems >= r.min && totalItems <= r.max) || null;
}

function getNextRank(rank) {
    if (!rank) return RANKS[0];
    const idx = RANKS.indexOf(rank);
    return RANKS[idx + 1] || null;
}

const STATUS_COLOR = {
    PENDING:   { bg: '#fef3c7', text: '#d97706' },
    CONFIRMED: { bg: '#dbeafe', text: '#2563eb' },
    SHIPPED:   { bg: '#ede9fe', text: '#7c3aed' },
    DELIVERED: { bg: '#d1fae5', text: '#16a34a' },
    CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
};

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser]     = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState('');

    useEffect(() => { loadAll(); }, [id]);

    async function loadAll() {
        setLoading(true);
        try {
            const data = await getUserById(id);
            setUser(data);
            // fetch orders for this user by email
            const token = localStorage.getItem('token');
            const res = await fetch(
                `http://localhost:8080/api/orders/my?email=${encodeURIComponent(data.email)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const orderData = await res.json();
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch {
            setError('Failed to load user details.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete user "${user?.name}"? This cannot be undone.`)) return;
        try {
            await deleteUser(id);
            navigate('/admin/users');
        } catch {
            alert('Failed to delete user.');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, fontSize: 18, color: '#7c3aed' }}>
            ⏳ Loading user profile...
        </div>
    );

    if (error) return (
        <div style={{ color: '#dc2626', textAlign: 'center', padding: 48, fontSize: 16 }}>
            ❌ {error}
        </div>
    );

    // ── Stats ──────────────────────────────────────────────────────────────────
    const totalItems   = orders.reduce((s, o) => s + (o.quantity || 0), 0);
    const totalSpent   = orders.reduce((s, o) => s + (o.totalPrice || o.totalAmount || 0), 0);
    const delivered    = orders.filter(o => o.status === 'DELIVERED').length;
    const pending      = orders.filter(o => o.status === 'PENDING').length;

    const rank     = getRank(totalItems);
    const nextRank = getNextRank(rank);
    const progress = rank
        ? Math.min(100, ((totalItems - rank.min) / (rank.max - rank.min + 1)) * 100)
        : Math.min(100, (totalItems / (RANKS[0].min || 1)) * 100);

    return (
        <div style={{ padding: '32px', fontFamily: 'Segoe UI, sans-serif', maxWidth: 900, margin: '0 auto' }}>

            {/* ── Back button ── */}
            <button onClick={() => navigate('/admin/users')} style={{
                background: 'none', border: 'none', color: '#7c3aed',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, padding: 0,
            }}>
                ← Back to Users
            </button>

            {/* ── Profile Card ── */}
            <div style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(124,58,237,0.1)',
                marginBottom: 24, border: '1px solid #ede9fe',
            }}>
                {/* Header banner with avatar overlapping bottom */}
                <div style={{
                    background: 'linear-gradient(135deg, #4a2d8f, #7c3aed, #a78bfa)',
                    padding: '28px 32px 64px',
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Avatar */}
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: rank ? rank.bg : '#f3e8ff',
                            border: '4px solid rgba(255,255,255,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 34, flexShrink: 0,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        }}>
                            {rank ? rank.icon : '👤'}
                        </div>
                        <div>
                            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#fff' }}>
                                {user.name}
                            </h1>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10 }}>📧 {user.email}</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)', color: '#fff',
                                    padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    {user.role?.replace('ROLE_', '')}
                                </span>
                                {rank && (
                                    <span style={{
                                        background: rank.bg, color: rank.color,
                                        padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                        border: `1px solid ${rank.border}`,
                                    }}>
                                        {rank.icon} {rank.name} Buyer
                                    </span>
                                )}
                                {!rank && (
                                    <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                        🆕 New Customer
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content below the banner */}
                <div style={{ padding: '24px 32px 32px', marginTop: -32, position: 'relative', zIndex: 1 }}>
                    {/* White bridge to cover the overlap cleanly */}
                    <div style={{ height: 32 }} />

                    {/* ── Stats row ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
                        {[
                            { label: 'Total Orders',   value: orders.length,               icon: '📦', color: '#7c3aed' },
                            { label: 'Items Bought',   value: totalItems,                   icon: '🛍️', color: '#0891b2' },
                            { label: 'Delivered',      value: delivered,                    icon: '✅', color: '#16a34a' },
                            { label: 'Pending',        value: pending,                      icon: '⏳', color: '#d97706' },
                            { label: 'Total Spent',    value: `LKR ${totalSpent.toFixed(2)}`, icon: '💰', color: '#dc2626' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: '#faf8ff', borderRadius: 14,
                                padding: '16px', textAlign: 'center',
                                border: '1px solid #ede9fe',
                            }}>
                                <div style={{ fontSize: 22 }}>{s.icon}</div>
                                <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Rank Progress ── */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>
                                🏆 Buyer Rank Progress
                            </span>
                            <span style={{ fontSize: 12, color: '#888' }}>
                                {totalItems} items bought
                            </span>
                        </div>
                        {/* All rank tiers */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                            {RANKS.map(r => {
                                const unlocked = totalItems >= r.min;
                                const isCurrent = rank?.name === r.name;
                                return (
                                    <div key={r.name} style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '6px 14px', borderRadius: 20,
                                        background: isCurrent ? r.bg : unlocked ? '#f9fafb' : '#f5f5f5',
                                        border: `2px solid ${isCurrent ? r.border : unlocked ? '#e5e7eb' : '#f0f0f0'}`,
                                        opacity: unlocked ? 1 : 0.4,
                                        fontSize: 12, fontWeight: isCurrent ? 700 : 500,
                                        color: isCurrent ? r.color : '#666',
                                    }}>
                                        <span>{r.icon}</span>
                                        <span>{r.name}</span>
                                        {unlocked && !isCurrent && <span style={{ color: '#16a34a' }}>✓</span>}
                                        {isCurrent && <span style={{ background: r.color, color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 8 }}>YOU</span>}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Progress bar */}
                        {nextRank && (
                            <>
                                <div style={{ background: '#f0f0f0', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${progress}%`, height: '100%',
                                        background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                                        borderRadius: 10, transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                                    {totalItems} / {nextRank.min} items to reach {nextRank.icon} {nextRank.name}
                                </div>
                            </>
                        )}
                        {!nextRank && totalItems >= 20 && (
                            <div style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 700, fontSize: 14, marginTop: 8 }}>
                                💠 Max Rank Achieved!
                            </div>
                        )}
                    </div>

                    {/* ── Contact Details ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                        {[
                            { label: '📱 Phone',   value: user.phone   || '—' },
                            { label: '🏠 Address', value: user.address || '—' },
                        ].map(f => (
                            <div key={f.label} style={{ background: '#faf8ff', borderRadius: 12, padding: '14px 16px', border: '1px solid #ede9fe' }}>
                                <div style={{ fontSize: 11, color: '#888', fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                                <div style={{ fontSize: 14, color: '#1a1a2e', fontWeight: 600 }}>{f.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Action buttons ── */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate(`/admin/users/edit/${id}`)} style={{
                            flex: 1, background: 'linear-gradient(90deg, #4a2d8f, #7c3aed)',
                            color: '#fff', border: 'none', borderRadius: 10,
                            padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}>
                            ✏️ Edit User
                        </button>
                        <button onClick={handleDelete} style={{
                            flex: 1, background: '#fee2e2', color: '#dc2626',
                            border: '1px solid #fca5a5', borderRadius: 10,
                            padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}>
                            🗑️ Delete User
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Order History ── */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #ede9fe' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>
                    📦 Order History ({orders.length})
                </h2>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 48, color: '#aaa' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                        <div>No orders placed yet.</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {orders.map((order, i) => {
                            const sc = STATUS_COLOR[order.status] || { bg: '#f5f5f5', text: '#666' };
                            return (
                                <div key={order.id || i} style={{
                                    border: '1px solid #f0f0f0', borderRadius: 12,
                                    padding: '14px 16px', display: 'flex',
                                    justifyContent: 'space-between', alignItems: 'center',
                                    background: '#faf8ff',
                                }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                                            Order #{String(order.id || '').slice(-8).toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#888' }}>
                                            {order.productName || 'Product'} — Qty: {order.quantity || 1}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: '#4a2d8f', marginBottom: 6 }}>
                                            LKR {Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                                        </div>
                                        <span style={{
                                            background: sc.bg, color: sc.text,
                                            padding: '3px 12px', borderRadius: 20,
                                            fontSize: 11, fontWeight: 700,
                                        }}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;