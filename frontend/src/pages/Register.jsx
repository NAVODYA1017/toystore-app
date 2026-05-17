import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/user-management/userService';


function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async () => {
        setError('');
        if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return; }
        try {
            setLoading(true);
            await registerUser(form); // ✅ no role sent — backend sets ROLE_CLIENT automatically
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500); // ✅ go to login after register
        } catch (err) {
            setError('Email already exists or registration failed');
        } finally {
            setLoading(false);
        }
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
                        ⚠️ {error}
                    </div>
                )}

                {/* ✅ Success message */}
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