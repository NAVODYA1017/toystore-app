import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../features/user-management/userService';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [totalItemsBought, setTotalItemsBought] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('loggedInUser');
        if (!stored) { navigate('/login'); return; }
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name, phone: parsed.phone || '', address: parsed.address || '', password: '' });

        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setAvatar(savedAvatar);

        // Load only this user's orders using their email
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/orders/my?email=${encodeURIComponent(parsed.email)}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                const userOrders = Array.isArray(data) ? data : [];
                setOrders(userOrders);
                // Backend Order model has a direct 'quantity' field (not a nested items array)
                const total = userOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
                setTotalItemsBought(total);
            })
            .catch(() => setOrders([]));
    }, [navigate]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            const updated = await updateUser(user.id, payload);
            const merged = { ...user, ...updated };
            localStorage.setItem('loggedInUser', JSON.stringify(merged));
            setUser(merged);
            setMessage('success');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAvatar(ev.target.result);
            localStorage.setItem('userAvatar', ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Rank system
    const ranks = [
        { name: 'Bronze',   min: 1,  max: 4,  icon: '🥉', color: '#cd7f32', bg: '#fdf3e7' },
        { name: 'Silver',   min: 5,  max: 9,  icon: '🥈', color: '#a8a9ad', bg: '#f5f5f5' },
        { name: 'Gold',     min: 10, max: 14, icon: '🥇', color: '#ffd700', bg: '#fffbea' },
        { name: 'Platinum', min: 15, max: 19, icon: '💎', color: '#00bcd4', bg: '#e0f7fa' },
        { name: 'Diamond',  min: 20, max: 999,icon: '💠', color: '#7c3aed', bg: '#f3e8ff' },
    ];

    const currentRank = ranks.find(r => totalItemsBought >= r.min && totalItemsBought <= r.max) || null;
    const nextRank = currentRank ? ranks[ranks.indexOf(currentRank) + 1] : ranks[0];
    const progress = currentRank
        ? Math.min(100, ((totalItemsBought - currentRank.min) / (currentRank.max - currentRank.min + 1)) * 100)
        : Math.min(100, (totalItemsBought / ranks[0].min) * 100);

    const orderStatusColor = {
        PENDING:   { bg: '#fef3c7', text: '#d97706' },
        CONFIRMED: { bg: '#dbeafe', text: '#2563eb' },
        SHIPPED:   { bg: '#ede9fe', text: '#7c3aed' },
        DELIVERED: { bg: '#d1fae5', text: '#16a34a' },
        CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
    };

    const pendingOrders   = orders.filter(o => o.status === 'PENDING');
    const shippedOrders   = orders.filter(o => o.status === 'SHIPPED');
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');

    const tabs = [
        { id: 'overview',  label: '🏠 Overview' },
        { id: 'orders',    label: '📦 My Orders' },
        { id: 'settings',  label: '⚙️ Settings' },
        { id: 'privacy',   label: '🔒 Privacy' },
    ];

    if (!user) return <div style={{ textAlign: 'center', marginTop: 100, fontSize: 24 }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            background: '#faf9f7',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: 40
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #4a2d8f, #7c3aed, #a78bfa)',
                height: 200,
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: -60,
                    left: 48,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 24,
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: 120, height: 120,
                            borderRadius: '50%',
                            border: '4px solid #fff',
                            background: '#e9d5ff',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                        }}>
                            {avatar
                                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : '👤'
                            }
                        </div>
                        <label style={{
                            position: 'absolute',
                            bottom: 4, right: 4,
                            background: '#4a2d8f',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 28, height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: 14,
                            border: '2px solid #fff',
                        }}>
                            📷
                            <input type="file" accept="image/*" onChange={handleAvatarChange}
                                   style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>
            </div>

            {/* ── User Info Bar ── */}
            <div style={{ background: '#fff', padding: '72px 48px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', margin: '0 0 4px' }}>{user.name}</h1>
                        <p style={{ color: '#888', fontSize: 14, margin: '0 0 8px' }}>📧 {user.email}</p>
                        {currentRank && (
                            <span style={{
                                background: currentRank.bg,
                                color: currentRank.color,
                                padding: '4px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 700,
                                border: `1px solid ${currentRank.color}40`,
                            }}>
                                {currentRank.icon} {currentRank.name} Buyer
                            </span>
                        )}
                    </div>
                    <button onClick={handleLogout} style={{
                        background: '#fee2e2', color: '#dc2626',
                        border: 'none', borderRadius: 10,
                        padding: '10px 24px', cursor: 'pointer',
                        fontWeight: 700, fontSize: 14,
                    }}>🚪 Logout</button>
                </div>

                {/* Order quick stats */}
                <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
                    {[
                        { label: 'Pending',   value: pendingOrders.length,   icon: '⏳' },
                        { label: 'Shipped',   value: shippedOrders.length,   icon: '🚚' },
                        { label: 'Delivered', value: deliveredOrders.length, icon: '✅' },
                        { label: 'Total Items Bought', value: totalItemsBought, icon: '🛍️' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, color: '#4a2d8f' }}>{s.icon} {s.value}</div>
                            <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 24px', display: 'flex', gap: 24 }}>

                {/* Sidebar */}
                <div style={{ width: 220, flexShrink: 0 }}>
                    {/* Tabs */}
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '14px 20px',
                                border: 'none',
                                borderLeft: activeTab === tab.id ? '3px solid #4a2d8f' : '3px solid transparent',
                                background: activeTab === tab.id ? '#f8f4ff' : '#fff',
                                color: activeTab === tab.id ? '#4a2d8f' : '#555',
                                fontWeight: activeTab === tab.id ? 700 : 400,
                                fontSize: 14,
                                cursor: 'pointer',
                            }}>{tab.label}</button>
                        ))}
                    </div>

                    {/* Rank Card */}
                    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>🏆 Buyer Rank</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {ranks.map(rank => {
                                const isUnlocked = totalItemsBought >= rank.min;
                                const isCurrent  = currentRank?.name === rank.name;
                                return (
                                    <div key={rank.name} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 12px',
                                        borderRadius: 10,
                                        background: isCurrent ? rank.bg : isUnlocked ? '#f9f9f9' : '#fafafa',
                                        border: isCurrent ? `2px solid ${rank.color}` : '1px solid #f0f0f0',
                                        opacity: isUnlocked ? 1 : 0.4,
                                    }}>
                                        <span style={{ fontSize: 20 }}>{rank.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: rank.color }}>{rank.name}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>{rank.min}+ items</div>
                                        </div>
                                        {isCurrent && <span style={{ fontSize: 10, background: rank.color, color: '#fff', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>YOU</span>}
                                        {isUnlocked && !isCurrent && <span style={{ fontSize: 14 }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress to next rank */}
                        {nextRank && (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                                    Progress to {nextRank.icon} {nextRank.name}
                                </div>
                                <div style={{ background: '#f0f0f0', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #4a2d8f, #a78bfa)',
                                        borderRadius: 10,
                                        transition: 'width 0.5s',
                                    }} />
                                </div>
                                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                                    {totalItemsBought} / {nextRank.min} items
                                </div>
                            </div>
                        )}
                        {!nextRank && totalItemsBought >= 20 && (
                            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: '#7c3aed', fontWeight: 700 }}>
                                💠 Max Rank Achieved!
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Panel */}
                <div style={{ flex: 1 }}>

                    {/* ── Overview Tab ── */}
                    {activeTab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Order Status Cards */}
                            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#1a1a2e' }}>📦 Order Status</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                                    {[
                                        { label: 'Pending',   count: pendingOrders.length,   icon: '⏳', color: '#d97706', bg: '#fef3c7' },
                                        { label: 'Shipped',   count: shippedOrders.length,   icon: '🚚', color: '#7c3aed', bg: '#ede9fe' },
                                        { label: 'Delivered', count: deliveredOrders.length, icon: '✅', color: '#16a34a', bg: '#d1fae5' },
                                        { label: 'Cancelled', count: orders.filter(o => o.status === 'CANCELLED').length, icon: '❌', color: '#dc2626', bg: '#fee2e2' },
                                    ].map(s => (
                                        <div key={s.label} onClick={() => setActiveTab('orders')} style={{
                                            background: s.bg,
                                            borderRadius: 12,
                                            padding: '20px 16px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                        }}>
                                            <div style={{ fontSize: 28 }}>{s.icon}</div>
                                            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.count}</div>
                                            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Badges */}
                            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: '#1a1a2e' }}>🎖️ Badges</h2>
                                <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Buy more to unlock badges!</p>

                                {/* Circle Progress */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                                    <div style={{ position: 'relative', width: 140, height: 140 }}>
                                        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                                            <circle cx="70" cy="70" r="60" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                                            <circle cx="70" cy="70" r="60" fill="none"
                                                    stroke="url(#grad)" strokeWidth="12"
                                                    strokeDasharray={`${2 * Math.PI * 60}`}
                                                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min(totalItemsBought, 20) / 20)}`}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                            />
                                            <defs>
                                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#4a2d8f" />
                                                    <stop offset="100%" stopColor="#a78bfa" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: 28, fontWeight: 900, color: '#4a2d8f' }}>{totalItemsBought}</div>
                                            <div style={{ fontSize: 11, color: '#888' }}>items bought</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {ranks.map(rank => {
                                        const unlocked = totalItemsBought >= rank.min;
                                        return (
                                            <div key={rank.name} style={{
                                                textAlign: 'center',
                                                padding: '16px 20px',
                                                borderRadius: 16,
                                                background: unlocked ? rank.bg : '#f5f5f5',
                                                border: unlocked ? `2px solid ${rank.color}50` : '2px solid #eee',
                                                opacity: unlocked ? 1 : 0.4,
                                                minWidth: 80,
                                                transition: 'all 0.3s',
                                            }}>
                                                <div style={{ fontSize: 32, marginBottom: 6, filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                                                    {rank.icon}
                                                </div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? rank.color : '#aaa' }}>
                                                    {rank.name}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                                                    {rank.min}+ items
                                                </div>
                                                {unlocked && (
                                                    <div style={{ fontSize: 10, background: rank.color, color: '#fff', padding: '2px 8px', borderRadius: 10, marginTop: 6, fontWeight: 700 }}>
                                                        UNLOCKED ✓
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Orders Tab ── */}
                    {activeTab === 'orders' && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#1a1a2e' }}>📦 My Orders</h2>
                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                                    No orders yet. Start shopping!
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {orders.map((order, i) => (
                                        <div key={order.id || i} style={{
                                            border: '1px solid #f0f0f0',
                                            borderRadius: 12,
                                            padding: 16,
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>
                                                        Order #{(order.id || '').slice(-8).toUpperCase()}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: '#888' }}>
                                                        {order.createdAt || order.orderDate ? new Date(order.createdAt || order.orderDate).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    background: orderStatusColor[order.status]?.bg || '#f0f0f0',
                                                    color: orderStatusColor[order.status]?.text || '#666',
                                                    padding: '4px 14px',
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                }}>{order.status || 'PENDING'}</span>
                                            </div>
                                            <div style={{ fontSize: 18, fontWeight: 900, color: '#4a2d8f' }}>
                                                LKR {Number(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Settings Tab ── */}
                    {activeTab === 'settings' && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#1a1a2e' }}>⚙️ Account Settings</h2>

                            {message === 'success' && (
                                <div style={{ background: '#d1fae5', color: '#16a34a', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontWeight: 700 }}>
                                    ✅ Profile updated successfully!
                                </div>
                            )}
                            {message === 'error' && (
                                <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontWeight: 700 }}>
                                    ❌ Update failed. Please try again.
                                </div>
                            )}

                            {[
                                { name: 'name',    label: 'Full Name', type: 'text' },
                                { name: 'phone',   label: 'Phone Number', type: 'text' },
                                { name: 'address', label: 'Delivery Address', type: 'text' },
                            ].map(f => (
                                <div key={f.name} style={{ marginBottom: 16 }}>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                    <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange}
                                           style={{
                                               width: '100%', padding: '12px 16px',
                                               borderRadius: 10, border: '1.5px solid #e2e8f0',
                                               fontSize: 15, boxSizing: 'border-box', outline: 'none',
                                           }} />
                                </div>
                            ))}
                            <button onClick={handleUpdate} disabled={loading} style={{
                                background: '#4a2d8f', color: '#fff',
                                border: 'none', borderRadius: 10,
                                padding: '12px 32px', fontSize: 15,
                                fontWeight: 700, cursor: 'pointer',
                            }}>
                                {loading ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* ── Privacy Tab ── */}
                    {activeTab === 'privacy' && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#1a1a2e' }}>🔒 Privacy & Security</h2>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>
                                    New Password
                                </label>
                                <input type="password" name="password" value={form.password || ''} onChange={handleChange}
                                       placeholder="Enter new password"
                                       style={{
                                           width: '100%', padding: '12px 16px',
                                           borderRadius: 10, border: '1.5px solid #e2e8f0',
                                           fontSize: 15, boxSizing: 'border-box', outline: 'none',
                                       }} />
                            </div>

                            <button onClick={handleUpdate} disabled={loading} style={{
                                background: '#4a2d8f', color: '#fff',
                                border: 'none', borderRadius: 10,
                                padding: '12px 32px', fontSize: 15,
                                fontWeight: 700, cursor: 'pointer',
                                marginBottom: 32,
                            }}>
                                {loading ? 'Updating...' : '🔐 Update Password'}
                            </button>

                            <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '24px 0' }} />

                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', marginBottom: 12 }}>Danger Zone</h3>
                            <button onClick={handleLogout} style={{
                                background: '#fee2e2', color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: 10, padding: '12px 24px',
                                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}>
                                🚪 Logout from all devices
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Profile;