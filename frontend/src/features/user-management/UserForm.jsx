import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerUser, getUserById, updateUser } from './userService';

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#555' };

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (isEditing) fetchUser(); }, [id]);

    const fetchUser = async () => {
        try { const data = await getUserById(id); setFormData(data); }
        catch { setError('Failed to load user.'); }
    };

    const handleChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Password strength
    const getPasswordStrength = () => {
        let s = 0;
        if (formData.password.length >= 8) s++;
        if (/[A-Z]/.test(formData.password)) s++;
        if (/[0-9]/.test(formData.password)) s++;
        if (/[!@#$%^&*]/.test(formData.password)) s++;
        return s;
    };

    const getStrengthColor = (level) => {
        const s = getPasswordStrength();
        if (s === 0) return '#ddd';
        if (s === 1) return level <= 1 ? '#d93025' : '#ddd';
        if (s === 2) return level <= 2 ? '#f4a030' : '#ddd';
        if (s === 3) return level <= 3 ? '#1a73e8' : '#ddd';
        return '#137333';
    };

    const getStrengthText = () => {
        const s = getPasswordStrength();
        if (s === 1) return '🔴 Weak';
        if (s === 2) return '🟡 Fair';
        if (s === 3) return '🔵 Good';
        if (s === 4) return '🟢 Strong';
        return '';
    };

    // Frontend validation
    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setError('❌ Invalid email. Use example@gmail.com');
            return false;
        }
        if (!isEditing) {
            if (formData.password.length < 8) {
                setError('❌ Password must be at least 8 characters');
                return false;
            }
            if (!/[A-Z]/.test(formData.password)) {
                setError('❌ Password must contain at least one uppercase letter');
                return false;
            }
            if (!/[0-9]/.test(formData.password)) {
                setError('❌ Password must contain at least one number');
                return false;
            }
            if (!/[!@#$%^&*]/.test(formData.password)) {
                setError('❌ Password must contain at least one special character (!@#$%^&*)');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            if (isEditing) {
                await updateUser(id, formData);
                alert('User updated!');
            } else {
                await registerUser(formData);
                alert('User registered successfully!');
            }
            navigate('/users');
        } catch (err) {
            // ✅ Shows exact backend error message
            const msg = err.response?.data?.error
                || err.response?.data?.message
                || 'Something went wrong. Please try again.';
            setError('❌ ' + msg);
        } finally { setLoading(false); }
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, color: '#1a73e8' }}>
                {isEditing ? '✏️ Edit User' : '➕ Add New User'}
            </h2>

            {error && (
                <p style={{ color: '#d93025', background: '#fce8e6', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Full Name</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="John Doe" />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="example@gmail.com" />
                    {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email) && (
                        <small style={{ color: '#d93025', fontSize: '12px' }}>❌ Invalid email format</small>
                    )}
                </div>

                {/* Password */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>
                        Password {isEditing && <span style={{ color: '#888', fontWeight: 'normal' }}>(leave blank to keep current)</span>}
                    </label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange}
                           required={!isEditing} style={inputStyle}
                           placeholder={isEditing ? 'Leave blank to keep current' : 'Min 8 chars, A-Z, 0-9, !@#$'} />

                    {!isEditing && formData.password && (
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                {[1, 2, 3, 4].map(level => (
                                    <div key={level} style={{ height: '4px', flex: 1, borderRadius: '2px', background: getStrengthColor(level), transition: 'background 0.3s' }} />
                                ))}
                            </div>
                            <small style={{ fontSize: '12px' }}>{getStrengthText()}</small>
                        </div>
                    )}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Phone</label>
                    <input name="phone" type="text" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="0712345678" />
                </div>

                {/* Address */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Address</label>
                    <input name="address" type="text" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="123 Main St, Colombo" />
                </div>

                {/* Role */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" disabled={loading}
                            style={{ flex: 1, background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontSize: '15px' }}>
                        {loading ? 'Saving...' : isEditing ? '💾 Update User' : '✅ Register User'}
                    </button>
                    <button type="button" onClick={() => navigate('/users')}
                            style={{ flex: 1, background: '#f0f2f5', color: '#555', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontSize: '15px' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;