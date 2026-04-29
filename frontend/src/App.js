import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './features/user-management/UserList';
import UserForm from './features/user-management/UserForm';
import UserDetail from './features/user-management/UserDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

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
                        <Link to="/users" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Admin</Link>
                        {loggedInUser ? (
                            <Link to="/profile" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '700' }}>👤 {loggedInUser.name}</Link>
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
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/users/new" element={<UserForm />} />
                        <Route path="/users/edit/:id" element={<UserForm />} />
                        <Route path="/users/:id" element={<UserDetail />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;