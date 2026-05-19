import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('loggedInUser'));
        setUser(u);
    }, []);

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin',            icon: '📊', label: 'Dashboard' },
        { path: '/admin/products',   icon: '🧸', label: 'Products' },
        { path: '/admin/categories', icon: '🏷️', label: 'Categories' },
        { path: '/admin/orders',     icon: '📦', label: 'Orders' },
        { path: '/admin/payments',   icon: '💳', label: 'Payments' },
        { path: '/admin/users',      icon: '👥', label: 'Users' },
    ];

    // ✅ Fixed: startsWith so nested routes also highlight the parent nav item
    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>

            {/* ── Sidebar ── */}
            <div style={{
                width: 240,
                background: '#1a1a2e',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px', borderBottom: '1px solid #ffffff15' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', letterSpacing: 2 }}>🧸 NEVERLAND</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Admin Panel</div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 0' }}>
                    {navItems.map(item => {
                        const active = isActive(item.path); // ✅ use new helper
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 20px',
                                textDecoration: 'none',
                                color: active ? '#a78bfa' : '#ccc',
                                background: active ? '#ffffff10' : 'transparent',
                                borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent',
                                fontWeight: active ? 700 : 400,
                                fontSize: 15,
                                transition: 'all 0.2s',
                            }}>
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #ffffff15' }}>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Logged in as</div>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>{user?.name}</div>
                    <button onClick={logout} style={{
                        width: '100%',
                        background: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 0',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 14,
                    }}>Logout</button>
                    <Link to="/" style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: 8,
                        color: '#888',
                        fontSize: 13,
                        textDecoration: 'none',
                    }}>← View Store</Link>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={{ marginLeft: 240, flex: 1, background: '#f5f5f5' }}>
                <Outlet />
            </div>
        </div>
    );
}
