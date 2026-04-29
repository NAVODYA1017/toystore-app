import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../features/user-management/userService';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
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

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '24px' }}>🧸 Login</h2>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 'bold' }}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ fontWeight: 'bold' }}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
            </div>

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#1a73e8' }}>Register here</Link>
            </p>
        </div>
    );
}

export default Login;
