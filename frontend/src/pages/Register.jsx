import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/user-management/userService';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required');
            return;
        }
        try {
            setLoading(true);
            const newUser = await registerUser({ ...form, role: 'CUSTOMER' });
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));
            navigate('/profile');
        } catch (err) {
            setError('Email already exists or registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '24px' }}>🧸 Register</h2>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {['name', 'email', 'password', 'phone', 'address'].map((field) => (
                <div key={field} style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{field}</label>
                    <input
                        type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        placeholder={`Enter your ${field}`}
                        style={inputStyle}
                    />
                </div>
            ))}

            <button
                onClick={handleRegister}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px' }}>
                Already have an account? <Link to="/login" style={{ color: '#1a73e8' }}>Login here</Link>
            </p>
        </div>
    );
}

export default Register;