import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllPayments } from '../../services/paymentService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .dash-root {
    background: #f5f3ff;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }

  .dash-header {
    background: linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95);
    padding: 2rem 2rem 2.5rem;
    position: relative;
    overflow: hidden;
  }
  .dash-header::after {
    content: '';
    position: absolute;
    right: -60px; bottom: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(168,85,247,0.15);
    pointer-events: none;
  }
  .dash-header-inner { max-width: 1100px; margin: 0 auto; position: relative; }
  .dash-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.3rem;
  }
  .dash-header p { color: rgba(255,255,255,0.55); font-size: 0.88rem; margin: 0; }

  .dash-body { max-width: 1100px; margin: 0 auto; padding: 1.8rem 1.5rem; }

  /* Stat cards */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #fff;
    border-radius: 18px;
    padding: 1.4rem;
    border: 1px solid #ede9fe;
    text-decoration: none;
    display: block;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(124,58,237,0.12);
    border-color: #c4b5fd;
  }

  .stat-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    background: var(--icon-bg);
  }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .stat-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #9ca3af;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  /* Section title */
  .dash-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e1b4b;
    margin-bottom: 1rem;
  }

  /* Quick actions */
  .dash-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .action-card {
    background: #fff;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    text-decoration: none;
    border: 1px solid #ede9fe;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .action-card:hover {
    background: #faf5ff;
    border-color: #a855f7;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(124,58,237,0.1);
  }
  .action-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #f3e8ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .action-label {
    font-size: 0.88rem;
    font-weight: 600;
    color: #1e1b4b;
  }

  /* Recent payments */
  .dash-payments {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #ede9fe;
    overflow: hidden;
  }
  .dash-payments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid #f5f3ff;
  }
  .dash-payments-header span {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #1e1b4b;
  }
  .view-all-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: #7c3aed;
    text-decoration: none;
  }
  .view-all-link:hover { text-decoration: underline; }

  .payment-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.4rem;
    border-bottom: 1px solid #f9f8ff;
    transition: background 0.15s;
  }
  .payment-row:last-child { border-bottom: none; }
  .payment-row:hover { background: #faf8ff; }

  .payment-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    font-weight: 700;
    font-size: 0.8rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .payment-info { flex: 1; min-width: 0; }
  .payment-id {
    font-size: 0.85rem; font-weight: 600; color: #111827;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .payment-date { font-size: 0.75rem; color: #9ca3af; }
  .payment-amount {
    font-weight: 700; font-size: 0.9rem; color: #1e1b4b;
  }
  .payment-status {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 100px;
  }
  .status-completed { background: #dcfce7; color: #15803d; }
  .status-pending   { background: #fef9c3; color: #854d0e; }
  .status-failed    { background: #fee2e2; color: #dc2626; }

  .dash-empty {
    text-align: center;
    padding: 2.5rem;
    color: #9ca3af;
    font-size: 0.9rem;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim { animation: fadeUp 0.4s ease backwards; }
`;

const STAT_CONFIG = [
    { key: 'products', label: 'Total Products', icon: '🧸', accent: '#7c3aed', iconBg: '#f3e8ff', link: '/admin/products' },
    { key: 'payments', label: 'Payments',        icon: '💳', accent: '#2563eb', iconBg: '#eff6ff', link: '/admin/payments' },
    { key: 'revenue',  label: 'Revenue (LKR)',   icon: '💰', accent: '#059669', iconBg: '#ecfdf5', link: '/admin/payments' },
    { key: 'users',    label: 'Manage Users',    icon: '👥', accent: '#d97706', iconBg: '#fffbeb', link: '/admin/users'    },
];

const QUICK_ACTIONS = [
    { label: 'Add Product',   path: '/admin/products/new',    icon: '➕' },
    { label: 'Add Category',  path: '/admin/categories/new',  icon: '🏷️' },
    { label: 'View Orders',   path: '/admin/orders',          icon: '📦' },
    { label: 'View Payments', path: '/admin/payments',        icon: '💳' },
    { label: 'Manage Users',  path: '/admin/users',           icon: '👥' },
    { label: 'All Products',  path: '/admin/products',        icon: '🧸' },
];

export default function AdminDashboard() {
    const [stats, setStats]       = useState({ products: '—', payments: '—', revenue: '—', users: 'View' });
    const [recent, setRecent]     = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [products, payments] = await Promise.all([
                    getAllProducts(),
                    getAllPayments(),
                ]);
                const revenue = payments
                    .filter(p => p.status === 'COMPLETED')
                    .reduce((s, p) => s + (p.amount || 0), 0);

                setStats({
                    products: products.length,
                    payments: payments.length,
                    revenue: `${revenue.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`,
                    users: 'View',
                });
                setRecent(payments.slice(0, 6));
            } catch {}
            setLoading(false);
        }
        load();
    }, []);

    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    return (
        <>
            <style>{styles}</style>
            <div className="dash-root">
                <div className="dash-header">
                    <div className="dash-header-inner">
                        <h1>Dashboard</h1>
                        <p>Welcome back{user?.name ? `, ${user.name}` : ''}! Here's what's happening today.</p>
                    </div>
                </div>

                <div className="dash-body">
                    {/* Stats */}
                    <div className="dash-stats">
                        {STAT_CONFIG.map((cfg, i) => (
                            <Link
                                key={cfg.key}
                                to={cfg.link}
                                className="stat-card anim"
                                style={{
                                    '--accent': cfg.accent,
                                    '--icon-bg': cfg.iconBg,
                                    animationDelay: `${i * 0.07}s`,
                                }}
                            >
                                <div className="stat-icon">{cfg.icon}</div>
                                <div className="stat-value">{loading ? '…' : stats[cfg.key]}</div>
                                <div className="stat-label">{cfg.label}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="dash-section-title">Quick Actions</div>
                    <div className="dash-actions">
                        {QUICK_ACTIONS.map((a, i) => (
                            <Link
                                key={a.label}
                                to={a.path}
                                className="action-card anim"
                                style={{ animationDelay: `${0.28 + i * 0.06}s` }}
                            >
                                <div className="action-icon">{a.icon}</div>
                                <span className="action-label">{a.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Payments */}
                    <div className="dash-section-title">Recent Payments</div>
                    <div className="dash-payments anim" style={{ animationDelay: '0.6s' }}>
                        <div className="dash-payments-header">
                            <span>Transactions</span>
                            <Link to="/admin/payments" className="view-all-link">View all →</Link>
                        </div>
                        {loading ? (
                            <div className="dash-empty">Loading…</div>
                        ) : recent.length === 0 ? (
                            <div className="dash-empty">No payments recorded yet.</div>
                        ) : recent.map((p, i) => {
                            const initials = (p.customerName || p.customerId || 'U')
                                .slice(0, 2).toUpperCase();
                            const statusClass =
                                p.status === 'COMPLETED' ? 'status-completed' :
                                    p.status === 'PENDING'   ? 'status-pending'   : 'status-failed';
                            return (
                                <div className="payment-row" key={p.id || i}>
                                    <div className="payment-avatar">{initials}</div>
                                    <div className="payment-info">
                                        <div className="payment-id">
                                            {p.customerName || p.customerId || `Order #${p.orderId || p.id}`}
                                        </div>
                                        <div className="payment-date">
                                            {p.createdAt
                                                ? new Date(p.createdAt).toLocaleDateString('en-LK', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })
                                                : '—'}
                                        </div>
                                    </div>
                                    <div className="payment-amount">
                                        LKR {(p.amount || 0).toLocaleString()}
                                    </div>
                                    <span className={`payment-status ${statusClass}`}>
                                        {p.status || 'PENDING'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
