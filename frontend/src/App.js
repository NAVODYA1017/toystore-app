import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './features/user-management/UserList';
import UserForm from './features/user-management/UserForm';
import UserDetail from './features/user-management/UserDetail';

function App() {
    return (
        <Router>
            <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
                <nav style={{ background: '#1a73e8', padding: '16px 32px', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    🧸 Toy Store — User Management
                </nav>
                <div style={{ padding: '32px' }}>
                    <Routes>
                        <Route path="/" element={<UserList />} />
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