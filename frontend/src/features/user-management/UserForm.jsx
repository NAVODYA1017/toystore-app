import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerUser, getUserById, updateUser } from './userService';

const input = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginTop: '6px', boxSizing: 'border-box' };
const label = { fontSize: '13px', fontWeight: '600', color: '#555' };

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (isEditing) fetchUser(); }, [id]);

    const fetchUser = async () => {
        try { const data = await getUserById(id); setFormData(data); }
        catch { setError('Failed to load user.'); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) { await updateUser(id, formData); alert('User updated!'); }
            else { await registerUser(formData); alert('User registered!'); }
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, color: '#1a73e8' }}>{isEditing ? '✏️ Edit User' : '➕ Add New User'}</h2>
            {error && <p style={{ color: 'red', background: '#fce8e6', padding: '10px', borderRadius: '8px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Full Name', name: 'name', type: 'text', required: true },
                    { label: 'Email', name: 'email', type: 'email', required: true },
                    { label: 'Password', name: 'password', type: 'password', required: false },
                    { label: 'Phone', name: 'phone', type: 'text', required: false },
                    { label: 'Address', name: 'address', type: 'text', required: false },
                ].map(field => (
                    <div key={field.name} style={{ marginBottom: '16px' }}>
                        <label style={label}>{field.label}</label>
                        <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} required={field.required} style={input} />
                    </div>
                ))}

                <div style={{ marginBottom: '24px' }}>
                    <label style={label}>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={input}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" disabled={loading}
                            style={{ flex: 1, background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontSize: '15px' }}>
                        {loading ? 'Saving...' : isEditing ? 'Update User' : 'Register User'}
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