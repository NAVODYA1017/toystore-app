import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ClientLayout() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('loggedInUser'));
        setUser(u);
    }, [location.pathname]);

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Segoe UI, sans-serif' }}>

            {/* ── Navbar ── */}
            <nav style={{
                background: '#fff',
                padding: '0 32px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 28 }}>🧸</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#4a2d8f', letterSpacing: 2 }}>NEVERLAND</span>
                </Link>

                {/* Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link to="/"     style={navLink}>Home</Link>
                    <Link to="/shop" style={navLink}>Shop</Link>

                    {/* Cart */}
                    <Link to="/cart" style={{ ...navLink, position: 'relative' }}>
                        <span style={{
                            background: '#f5f0ff',
                            padding: '6px 16px',
                            borderRadius: 20,
                            color: '#4a2d8f',
                            fontWeight: 700,
                        }}>
                            🛒 Cart
                            {totalItems > 0 && (
                                <span style={{
                                    background: '#e53e3e',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    marginLeft: 6,
                                }}>{totalItems}</span>
                            )}
                        </span>
                    </Link>

                    {/* User */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Link to="/orders"  style={navLink}>My Orders</Link>
                            <Link to="/profile" style={navLink}>👤 {user.name}</Link>

                            {/* ✅ Show Admin Panel link only for admin users */}
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" style={{
                                    background: '#1a1a2e',
                                    color: '#a78bfa',
                                    padding: '6px 16px',
                                    borderRadius: 20,
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: 13,
                                }}>⚙️ Admin Panel</Link>
                            )}

                            <button onClick={logout} style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 20,
                                padding: '6px 16px',
                                cursor: 'pointer',
                                color: '#666',
                                fontSize: 14,
                            }}>Logout</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Link to="/login" style={navLink}>Login</Link>
                            <Link to="/register" style={{
                                background: '#4a2d8f',
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: 20,
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: 14,
                            }}>Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Page Content ── */}
            <main>
                <Outlet />
            </main>

            {/* ── Footer ── */}
            <footer style={{
                background: '#2d2d2d',
                color: '#aaa',
                textAlign: 'center',
                padding: '32px 0',
                marginTop: 64,
                fontSize: 14,
            }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🧸</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>NEVERLAND</div>
                <div>© 2025 Neverland Toy Store. All rights reserved.</div>
            </footer>
        </div>
    );
}

const navLink = {
    color: '#333',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 15,
};