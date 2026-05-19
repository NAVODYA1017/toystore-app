import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function StarDisplay({ rating }) {
  return (
      <span aria-label={`${rating} out of 5 stars`} style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(s => (
          <span key={s} style={{ color: s <= rating ? '#FFB347' : '#edf2f7', fontSize: '16px' }}>★</span>
      ))}
    </span>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function RatingBar({ star, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', color: '#4a5568', width: '30px', textAlign: 'right', fontWeight: 600 }}>{star} ★</span>
        <div style={{ flex: 1, height: '10px', background: '#edf2f7', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #ffcc33, #FFB347)', borderRadius: '6px', transition: 'width 0.6s ease' }} />
        </div>
        <span style={{ fontSize: '13px', color: '#a0aec0', width: '24px', fontWeight: 500 }}>{count}</span>
      </div>
  );
}

export default function ReviewList({ onEdit }) {
  const [reviews,       setReviews]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterUser,    setFilterUser]    = useState('');

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`);
      if (!res.ok) throw new Error('Failed to load');
      setReviews(await res.json());
    } catch {
      setError('Could not connect to backend. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete review.');
    }
  };

  // Stats
  const total    = reviews.length;
  const avg      = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : null;
  const products = new Set(reviews.map(r => r.productId)).size;
  const countByStar = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
  }));
  const maxCount = Math.max(...countByStar.map(c => c.count), 1);

  // Filtered
  const filtered = reviews.filter(r => {
    const pf = filterProduct.trim().toLowerCase();
    const uf = filterUser.trim().toLowerCase();
    return (
        (!pf || r.productId?.toLowerCase().includes(pf)) &&
        (!uf || r.userId?.toLowerCase().includes(uf))
    );
  });

  return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ff6b6b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📋</span> All Reviews
        </h2>

        {/* Stats - Pastel Colored Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '1.5rem' }}>
          {[
            { val: total,                  label: 'Total reviews',     bg: '#fff5f5', color: '#c53030' },
            { val: avg ? `${avg} ★` : '—', label: 'Average rating',   bg: '#fffff0', color: '#b7791f' },
            { val: products,               label: 'Products reviewed', bg: '#ebf8ff', color: '#2b6cb0' },
          ].map(({ val, label, bg, color }) => (
              <div key={label} style={{ background: bg, borderRadius: '16px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: color }}>{val}</div>
                <div style={{ fontSize: '13px', color: color, opacity: 0.8, marginTop: '4px', fontWeight: 600 }}>{label}</div>
              </div>
          ))}
        </div>

        {/* Rating breakdown */}
        <div style={{ background: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#4a5568', marginBottom: '12px' }}>Rating Breakdown</div>
          {countByStar.map(c => <RatingBar key={c.star} star={c.star} count={c.count} max={maxCount} />)}
        </div>

        {/* Filters + Refresh */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
              style={s.filterInput}
              placeholder="🔍 Filter by product ID..."
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
          />
          <input
              style={s.filterInput}
              placeholder="🔍 Filter by user ID..."
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
          />
          <button style={s.refreshBtn} onClick={loadReviews}>↻ Refresh</button>
        </div>

        {/* Error / Loading / Empty */}
        {error   && <div style={s.alertError}>{error}</div>}
        {loading && <div style={s.empty}>Loading reviews... ✨</div>}
        {!loading && !error && filtered.length === 0 && (
            <div style={s.empty}>No reviews yet. Be the first to write one! 🧸</div>
        )}

        {/* Review cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(r => (
              <div key={r.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  {/* Left: avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={s.avatar}>{initials(r.username)}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#2d3748' }}>{r.username}</div>
                      <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {formatDate(r.createdAt)}
                        <span style={s.productTag}>{r.productId}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right: stars + actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StarDisplay rating={r.rating} />
                    <div style={{ display: 'flex', gap: '6px', marginLeft: '10px' }}>
                      <button style={s.editBtn} onClick={() => onEdit(r)} title="Edit review">Edit</button>
                      <button style={s.deleteBtn} onClick={() => handleDelete(r.id)} title="Delete review">Delete</button>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: 1.6, marginTop: '14px', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                  {r.comment}
                </p>
              </div>
          ))}
        </div>
      </div>
  );
}

const s = {
  filterInput: {
    flex: 1, minWidth: '180px',
    border: '2px solid #edf2f7', borderRadius: '12px',
    padding: '10px 14px', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', color: '#2d3748',
    background: '#fff', transition: 'border-color 0.2s'
  },
  refreshBtn: {
    padding: '10px 18px', border: '2px solid #e2e8f0',
    borderRadius: '12px', background: '#fff', color: '#4a5568',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  alertError: {
    background: '#FED7D7', color: '#822727',
    padding: '12px 16px', borderRadius: '10px',
    fontSize: '14px', marginBottom: '1.5rem', fontWeight: 500
  },
  empty: { textAlign: 'center', padding: '3rem', color: '#a0aec0', fontSize: '15px', fontWeight: 500 },
  card: {
    background: '#fff', border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    borderRadius: '16px', padding: '1.25rem 1.5rem',
  },
  avatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#4a5568',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 800, flexShrink: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  productTag: {
    background: '#ebf4ff', color: '#3182ce',
    fontSize: '11px', fontWeight: 600,
    padding: '4px 10px', borderRadius: '12px',
  },
  editBtn: {
    background: '#ebf8ff', color: '#3182ce', border: 'none',
    cursor: 'pointer', padding: '6px 12px', fontWeight: 600,
    borderRadius: '8px', fontSize: '12px', transition: 'background 0.2s'
  },
  deleteBtn: {
    background: '#ff6b6b', color: '#fff', border: 'none',
    cursor: 'pointer', padding: '6px 12px', fontWeight: 600,
    borderRadius: '8px', fontSize: '12px', transition: 'background 0.2s'
  },
};