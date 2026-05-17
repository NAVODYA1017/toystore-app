import React, { useEffect, useState } from 'react';
import { getAllPayments, updatePaymentStatus, refundPayment, deletePayment } from '../../services/paymentService';
import { motion } from 'framer-motion';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => { loadPayments(); }, []);

    async function loadPayments() {
        try {
            const data = await getAllPayments();
            setPayments(data);
        } catch (e) {}
        setLoading(false);
    }

    async function handleRefund(id) {
        if (!window.confirm('Refund this payment?')) return;
        await refundPayment(id);
        loadPayments();
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this payment?')) return;
        await deletePayment(id);
        loadPayments();
    }

    async function handleStatusChange(id, status) {
        await updatePaymentStatus(id, status);
        loadPayments();
    }

    const statusColor = {
        PENDING:   { bg: '#fef3c7', text: '#d97706' },
        COMPLETED: { bg: '#d1fae5', text: '#16a34a' },
        FAILED:    { bg: '#fee2e2', text: '#dc2626' },
        REFUNDED:  { bg: '#e0e7ff', text: '#4338ca' },
    };

    const filtered = filter === 'ALL' ? payments : payments.filter(p => p.status === filter);

    const totalRevenue = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            style={{ padding: 32 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#1a1a2e' }}>Payment Records</h1>
                    <p style={{ color: '#888', margin: '4px 0 0 0' }}>Manage all customer transactions and refunds</p>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Transactions', value: payments.length,                                    color: '#4a2d8f', icon: '💳' },
                    { label: 'Completed',          value: payments.filter(p => p.status === 'COMPLETED').length, color: '#16a34a', icon: '✅' },
                    { label: 'Pending / Failed',   value: payments.filter(p => p.status === 'PENDING' || p.status === 'FAILED').length,   color: '#d97706', icon: '⏳' },
                    { label: 'Total Revenue',      value: `$${totalRevenue.toFixed(2)}`,                       color: '#2563eb', icon: '💰' },
                ].map(s => (
                    <motion.div 
                        key={s.label}
                        whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: '20px 24px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: 32 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 13, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['ALL', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                        background: filter === f ? '#4a2d8f' : '#fff',
                        color: filter === f ? '#fff' : '#666',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    }}>{f}</button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading payments...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>No payments found.</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f8f4ff' }}>
                            {['Transaction ID', 'Customer', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, color: '#4a2d8f', fontWeight: 700 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((p, i) => (
                            <tr key={p.id || i} style={{ borderTop: '1px solid #f0f0f0' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                                <td style={{ padding: '14px 16px', fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
                                    {p.transactionId || 'N/A'}
                                </td>
                                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>
                                    {p.customerName || p.customerId || 'N/A'}
                                </td>
                                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#4a2d8f' }}>
                                    ${p.amount?.toFixed(2)}
                                </td>
                                <td style={{ padding: '14px 16px', fontSize: 13 }}>
                                    {p.paymentMethod?.replace('_', ' ') || 'N/A'}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            background: statusColor[p.status]?.bg || '#f0f0f0',
                                            color: statusColor[p.status]?.text || '#666',
                                            padding: '4px 12px',
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}>{p.status}</span>
                                </td>
                                <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>
                                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {p.status === 'COMPLETED' && (
                                            <button onClick={() => handleRefund(p.id)} style={{
                                                background: '#eef2ff', color: '#4338ca',
                                                border: '1px solid #c7d2fe', borderRadius: 8,
                                                padding: '6px 12px', fontSize: 12,
                                                cursor: 'pointer', fontWeight: 700,
                                                transition: 'all 0.2s'
                                            }} onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'} onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}>Refund</button>
                                        )}
                                        {p.status === 'PENDING' && (
                                            <button onClick={() => handleStatusChange(p.id, 'COMPLETED')} style={{
                                                background: '#ecfdf5', color: '#059669',
                                                border: '1px solid #a7f3d0', borderRadius: 8,
                                                padding: '6px 12px', fontSize: 12,
                                                cursor: 'pointer', fontWeight: 700,
                                                transition: 'all 0.2s'
                                            }} onMouseEnter={e => e.currentTarget.style.background = '#d1fae5'} onMouseLeave={e => e.currentTarget.style.background = '#ecfdf5'}>Approve</button>
                                        )}
                                        <button onClick={() => handleDelete(p.id)} style={{
                                            background: '#fef2f2', color: '#dc2626',
                                            border: '1px solid #fecaca', borderRadius: 8,
                                            padding: '6px 12px', fontSize: 12,
                                            cursor: 'pointer', fontWeight: 700,
                                            transition: 'all 0.2s'
                                        }} onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'} onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}