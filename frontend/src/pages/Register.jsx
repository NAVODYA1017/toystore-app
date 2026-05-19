import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/user-management/userService';
import ToyRain from '../components/ToyRain';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Frontend validation
    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required');
            return false;
        }
        if (!emailRegex.test(form.email)) {
            setError('❌ Invalid email. Use example@gmail.com');
            return false;
        }
        if (form.password.length < 8) {
            setError('❌ Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(form.password)) {
            setError('❌ Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[0-9]/.test(form.password)) {
            setError('❌ Password must contain at least one number');
            return false;
        }
        if (!/[!@#$%^&*]/.test(form.password)) {
            setError('❌ Password must contain at least one special character (!@#$%^&*)');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setError('');
        if (!validate()) return;
        try {
            setLoading(true);
            await registerUser(form);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            // ✅ Shows exact backend error message
            const msg = err.response?.data?.error
                || err.response?.data?.message
                || 'Registration failed. Please try again.';
            setError('❌ ' + msg);
        } finally {
            setLoading(false);
        }
    };

    // Password strength
    const getStrength = () => {
        let s = 0;
        if (form.password.length >= 8) s++;
        if (/[A-Z]/.test(form.password)) s++;
        if (/[0-9]/.test(form.password)) s++;
        if (/[!@#$%^&*]/.test(form.password)) s++;
        return s;
    };

    const getStrengthColor = (level) => {
        const s = getStrength();
        if (s === 0) return '#ddd';
        if (s === 1) return level <= 1 ? '#d93025' : '#ddd';
        if (s === 2) return level <= 2 ? '#f4a030' : '#ddd';
        if (s === 3) return level <= 3 ? '#1a73e8' : '#ddd';
        return '#137333';
    };

    const getStrengthText = () => {
        const s = getStrength();
        if (s === 1) return '🔴 Weak';
        if (s === 2) return '🟡 Fair';
        if (s === 3) return '🔵 Good';
        if (s === 4) return '🟢 Strong';
        return '';
    };

    const fields = [
        { name: 'name',     label: '👤 Full Name', type: 'text',     border: '#f7a8c4' },
        { name: 'email',    label: '📧 Email',     type: 'email',    border: '#f7d9a8' },
        { name: 'password', label: '🔒 Password',  type: 'password', border: '#a8f0c0' },
        { name: 'phone',    label: '📱 Phone',     type: 'text',     border: '#a8d8f7' },
        { name: 'address',  label: '🏠 Address',   type: 'text',     border: '#d0a8f7' },
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
                width: '100%', maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(160,120,255,0.25)',
                border: '1.5px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '52px' }}>🌸</div>
                    <h2 style={{ margin: '8px 0 4px', fontSize: '28px', color: '#4a2d8f', fontWeight: '700' }}>
                        Create Account
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Join the Toy Store family!</p>
                </div>

                {error && (
                    <div style={{ background: '#ffe5e5', color: '#c0000a', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{ background: '#e5ffe5', color: '#1a7a1a', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                        ✅ {success}
                    </div>
                )}

                {fields.map(field => (
                    <div key={field.name} style={{ marginBottom: '14px' }}>
                        <label style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>{field.label}</label>
                        <input
                            type={field.type} name={field.name}
                            value={form[field.name]} onChange={handleChange}
                            placeholder={`Enter your ${field.name}`}
                            style={{
                                width: '100%', padding: '12px 16px', marginTop: '6px',
                                borderRadius: '12px', border: `2px solid ${field.border}`,
                                background: 'white', fontSize: '15px', color: '#222',
                                boxSizing: 'border-box', outline: 'none',
                            }}
                        />
                        {/* ✅ Password strength bar */}
                        {field.name === 'password' && form.password && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    {[1, 2, 3, 4].map(level => (
                                        <div key={level} style={{
                                            height: '4px', flex: 1, borderRadius: '2px',
                                            background: getStrengthColor(level),
                                            transition: 'background 0.3s'
                                        }} />
                                    ))}
                                </div>
                                <small style={{ fontSize: '12px' }}>{getStrengthText()}</small>
                            </div>
                        )}
                    </div>
                ))}

                <button onClick={handleRegister} disabled={loading} style={{
                    width: '100%', padding: '14px', marginTop: '16px',
                    background: 'linear-gradient(90deg, #f7a8c4, #f7d9a8, #a8f0c0, #a8d8f7, #d0a8f7)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(155,121,232,0.4)',
                }}>
                    {loading ? '✨ Creating account...' : '🌈 Register'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
                        Login here 🌈
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;