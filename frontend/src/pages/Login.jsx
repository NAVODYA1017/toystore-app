import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../features/user-management/userService';
import ToyRain from '../components/ToyRain';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) { setError('Please enter email and password'); return; }
        try {
            setLoading(true);
            const user = await loginUser(email, password);
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            navigate('/profile');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', marginTop: '8px',
        borderRadius: '12px', border: '2px solid #c9b8f0',
        background: 'white', fontSize: '15px', color: '#222',
        boxSizing: 'border-box', outline: 'none',
    };

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
                width: '100%', maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(160,120,255,0.25)',
                border: '1.5px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '52px' }}>🧸</div>
                    <h2 style={{ margin: '8px 0 4px', fontSize: '28px', color: '#4a2d8f', fontWeight: '700' }}>
                        Welcome Back!
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Login to your Toy Store account</p>
                </div>

                {error && (
                    <div style={{ background: '#ffe5e5', color: '#c0000a', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                        ⚠️ {error}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>📧 Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
                </div>

                <div style={{ marginBottom: '28px' }}>
                    <label style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>🔒 Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={inputStyle} />
                </div>

                <button onClick={handleLogin} disabled={loading} style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(90deg, #e879a0, #9b79e8, #5baee8)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(155,121,232,0.45)',
                }}>
                    {loading ? '✨ Logging in...' : '🌈 Login'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
                        Register here 🌸
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;