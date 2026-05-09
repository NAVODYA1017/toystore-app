import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import UserList from './features/user-management/UserList';
import UserForm from './features/user-management/UserForm';
import UserDetail from './features/user-management/UserDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { logoutUser } from './features/user-management/userService';

// ✅ Protects routes — redirects to login if not logged in
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// ✅ Admin only route — redirects to login if not admin
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return <Navigate to="/login" />;
    if (role !== 'ROLE_ADMIN') return <Navigate to="/login" />;
    return children;
};

function App() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        logoutUser();
        window.location.href = '/login';
    };

    return (
        <Router>
            <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
                <nav style={{
                    background: 'linear-gradient(90deg, #ffd6e7, #ffecb3, #d4f1c0, #c5e8f7, #dcc5f7)',
                    padding: '16px 32px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 2px 12px rgba(155,121,232,0.2)'
                }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#4a2d8f' }}>🧸 Toy Store</span>
                    <div style={{ display: 'flex', gap: '20px' }}>

                        {/* ✅ Only show Admin link to admins */}
                        {role === 'ROLE_ADMIN' && (
                            <Link to="/users" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Admin Panel</Link>
                        )}

                        {loggedInUser ? (
                            <>
                                <Link to="/profile" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '700' }}>👤 {loggedInUser.name}</Link>
                                <button onClick={handleLogout} style={{
                                    background: 'none', border: 'none',
                                    color: '#c0368a', fontWeight: '700',
                                    cursor: 'pointer', fontSize: '14px'
                                }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: '#c0368a', textDecoration: 'none', fontWeight: '700' }}>Login</Link>
                                <Link to="/register" style={{ color: '#2563c0', textDecoration: 'none', fontWeight: '700' }}>Register</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div style={{ padding: '32px' }}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected — logged in users only */}
                        <Route path="/profile" element={
                            <ProtectedRoute><Profile /></ProtectedRoute>
                        } />

                        {/* Admin only routes */}
                        <Route path="/users" element={
                            <AdminRoute><UserList /></AdminRoute>
                        } />
                        <Route path="/users/new" element={
                            <AdminRoute><UserForm /></AdminRoute>
                        } />
                        <Route path="/users/edit/:id" element={
                            <AdminRoute><UserForm /></AdminRoute>
                        } />
                        <Route path="/users/:id" element={
                            <AdminRoute><UserDetail /></AdminRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;