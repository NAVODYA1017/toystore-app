import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from './userService';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch {
            alert('Failed to delete.');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>⏳ Loading users...</p>;
    if (error)   return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#1a73e8' }}>👥 All Users</h2>
                <button
                    onClick={() => navigate('/users/new')}
                    style={{ background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}>
                    + Add User
                </button>
            </div>

            {users.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>No users found. Add one!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#f0f2f5' }}>
                        {['Name', 'Email', 'Phone', 'Role', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '600' }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, i) => (
                        <tr key={user.id} style={{ borderTop: '1px solid #eee', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                            <td style={{ padding: '12px 16px' }}>{user.name}</td>
                            <td style={{ padding: '12px 16px' }}>{user.email}</td>
                            <td style={{ padding: '12px 16px' }}>{user.phone || '—'}</td>
                            <td style={{ padding: '12px 16px' }}>
                  <span style={{
                      background: user.role === 'ROLE_ADMIN' ? '#fce8e6' : '#e6f4ea',
                      color: user.role === 'ROLE_ADMIN' ? '#d93025' : '#137333',
                      padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                  }}>{user.role}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <button onClick={() => navigate(`/users/${user.id}`)}
                                        style={{ background: '#e8f0fe', color: '#1a73e8', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', marginRight: '8px' }}>
                                    View
                                </button>
                                <button onClick={() => navigate(`/users/edit/${user.id}`)}
                                        style={{ background: '#e6f4ea', color: '#137333', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', marginRight: '8px' }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(user.id)}
                                        style={{ background: '#fce8e6', color: '#d93025', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;