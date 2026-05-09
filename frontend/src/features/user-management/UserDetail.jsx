import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, deleteUser } from './userService';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { fetchUser(); }, [id]);

    const fetchUser = async () => {
        try { const data = await getUserById(id); setUser(data); }
        catch { setError('Failed to load user.'); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this user?')) return;
        try { await deleteUser(id); navigate('/users'); }
        catch { alert('Failed to delete.'); }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!user) return <p>⏳ Loading...</p>;

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, color: '#1a73e8' }}>👤 User Detail</h2>

            {[
                { label: 'Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || '—' },
                { label: 'Address', value: user.address || '—' },
                { label: 'Role', value: user.role },
            ].map(row => (
                <div key={row.label} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                    <span style={{ width: '120px', fontWeight: '600', color: '#555' }}>{row.label}</span>
                    <span style={{ color: '#333' }}>{row.value}</span>
                </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => navigate(`/users/edit/${id}`)}
                        style={{ flex: 1, background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                    ✏️ Edit
                </button>
                <button onClick={handleDelete}
                        style={{ flex: 1, background: '#d93025', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                    🗑️ Delete
                </button>
                <button onClick={() => navigate('/users')}
                        style={{ flex: 1, background: '#f0f2f5', color: '#555', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default UserDetail;