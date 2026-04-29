import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../features/user-management/userService';
import ToyRain from '../components/ToyRain';

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

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updated = await updateUser(user.id, form);
            localStorage.setItem('loggedInUser', JSON.stringify(updated));
            setUser(updated);
            setMessage('success');
        } catch {
            setMessage('error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    if (!user) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>✨ Loading...</div>;

    const fields = [
        { name: 'name',     label: '👤 Full Name', type: 'text',     border: '#f7a8c4' },
        { name: 'phone',    label: '📱 Phone',     type: 'text',     border: '#f7d9a8' },
        { name: 'address',  label: '🏠 Address',   type: 'text',     border: '#a8f0c0' },
        { name: 'password', label: '🔒 Password',  type: 'password', border: '#d0a8f7' },
    ];

    return (
        <div style={{
            minHeight: '100vh', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffd6e7, #ffecb3, #d4f1c0, #c5e8f7, #dcc5f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <ToyRain />
            <div style={{
                position: 'relative', zIndex: 1,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px', padding: '48px 40px',
                width: '100%', maxWidth: '480px',
                boxShadow: '0 8px 32px rgba(160,120,255,0.25)',
                border: '1.5px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f7a8c4, #a8d8f7, #b5f0c0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '36px', margin: '0 auto 14px'
                    }}>👤</div>
                    <h2 style={{ margin: '0 0 6px', fontSize: '26px', color: '#4a2d8f', fontWeight: '700' }}>
                        {user.name}
                    </h2>
                    <span style={{
                        background: 'linear-gradient(90deg, #e879a0, #9b79e8)',
                        color: 'white', padding: '4px 16px',
                        borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                    }}>{user.role}</span>
                    <p style={{ color: '#555', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>📧 {user.email}</p>
                </div>

                {message === 'success' && (
                    <div style={{ background: '#e8fff0', color: '#1a7a3a', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: '700' }}>
                        ✅ Profile updated successfully!
                    </div>
                )}
                {message === 'error' && (
                    <div style={{ background: '#ffe5e5', color: '#c0000a', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: '700' }}>
                        ❌ Update failed. Please try again.
                    </div>
                )}

                {fields.map(field => (
                    <div key={field.name} style={{ marginBottom: '14px' }}>
                        <label style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>{field.label}</label>
                        <input
                            type={field.type} name={field.name}
                            value={form[field.name] || ''} onChange={handleChange}
                            style={{
                                width: '100%', padding: '12px 16px', marginTop: '6px',
                                borderRadius: '12px', border: `2px solid ${field.border}`,
                                background: 'white', fontSize: '15px', color: '#222',
                                boxSizing: 'border-box', outline: 'none',
                            }}
                        />
                    </div>
                ))}

                <button onClick={handleUpdate} disabled={loading} style={{
                    width: '100%', padding: '14px', marginTop: '8px',
                    background: 'linear-gradient(90deg, #e879a0, #9b79e8, #5baee8)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(155,121,232,0.4)', marginBottom: '12px'
                }}>
                    {loading ? '✨ Saving...' : '💾 Save Changes'}
                </button>

                <button onClick={handleLogout} style={{
                    width: '100%', padding: '14px',
                    background: 'white', color: '#c0000a',
                    border: '2px solid #ffaaaa', borderRadius: '14px',
                    fontSize: '16px', fontWeight: '700', cursor: 'pointer'
                }}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;