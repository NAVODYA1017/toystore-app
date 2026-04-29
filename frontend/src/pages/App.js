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
                <nav style={{ background: '#1a73e8', padding: '16px 32px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>🧸 Toy Store</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
                        {loggedInUser ? (
                            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>👤 {loggedInUser.name}</Link>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
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