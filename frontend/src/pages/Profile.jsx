import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../features/user-management/userService';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('loggedInUser');
        if (!stored) { navigate('/login'); return; }
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name, phone: parsed.phone, address: parsed.address, password: parsed.password });
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updated = await updateUser(user.id, form);
            localStorage.setItem('loggedInUser', JSON.stringify(updated));
            setUser(updated);
            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            setMessage('❌ Update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    if (!user) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    const inputStyle = { width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1a73e8' }}>👤 My Profile</h2>
            <p style={{ textAlign: 'center', color: '#666' }}>Role: {user.role} | Email: {user.email}</p>

            {message && <p style={{ textAlign: 'center', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

            {['name', 'phone', 'address', 'password'].map((field) => (
                <div key={field} style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{field}</label>
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={form[field] || ''}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            ))}

            <button
                onClick={handleUpdate}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '12px' }}
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
                onClick={handleLogout}
                style={{ width: '100%', padding: '12px', background: '#e53935', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
                Logout
            </button>
        </div>
    );
}

export default Profile;