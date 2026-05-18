import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function StarDisplay({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#EF9F27' : '#ddd', fontSize: '15px' }}>★</span>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
      <span style={{ fontSize: '12px', color: '#666', width: '28px', textAlign: 'right' }}>{star} ★</span>
      <div style={{ flex: 1, height: '7px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#EF9F27', borderRadius: '4px', transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: '12px', color: '#aaa', width: '20px' }}>{count}</span>
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
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1rem' }}>
        {[
          { val: total,                  label: 'Total reviews'     },
          { val: avg ? `${avg} ★` : '—', label: 'Average rating'   },
          { val: products,               label: 'Products reviewed' },
        ].map(({ val, label }) => (
          <div key={label} style={{ background: '#f9f9f9', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>{val}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Rating breakdown */}
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '10px' }}>Rating breakdown</div>
        {countByStar.map(c => <RatingBar key={c.star} star={c.star} count={c.count} max={maxCount} />)}
      </div>

      {/* Filters + Refresh */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={s.filterInput}
          placeholder="Filter by product ID..."
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
        />
        <input
          style={s.filterInput}
          placeholder="Filter by user ID..."
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
        />
        <button style={s.refreshBtn} onClick={loadReviews}>↻ Refresh</button>
      </div>

      {/* Error / Loading / Empty */}
      {error   && <div style={s.alertError}>{error}</div>}
      {loading && <div style={s.empty}>Loading reviews...</div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={s.empty}>No reviews yet. Be the first to write one!</div>
      )}

      {/* Review cards */}
      {filtered.map(r => (
        <div key={r.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            {/* Left: avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={s.avatar}>{initials(r.username)}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{r.username}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formatDate(r.createdAt)}
                  <span style={s.productTag}>{r.productId}</span>
                </div>
              </div>
            </div>
            {/* Right: stars + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StarDisplay rating={r.rating} />
              <button style={s.iconBtn} onClick={() => onEdit(r)} title="Edit review">✏️</button>
              <button style={s.iconBtn} onClick={() => handleDelete(r.id)} title="Delete review">🗑️</button>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.65, marginTop: '10px' }}>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

const s = {
  filterInput: {
    flex: 1, minWidth: '180px',
    border: '1px solid #ddd', borderRadius: '8px',
    padding: '8px 12px', fontSize: '13px',
    fontFamily: 'inherit', outline: 'none', color: '#111',
  },
  refreshBtn: {
    padding: '8px 14px', border: '1px solid #ddd',
    borderRadius: '8px', background: 'transparent',
    fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
  },
  alertError: {
    background: '#FCEBEB', color: '#A32D2D',
    padding: '12px 16px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '1rem',
  },
  empty: { textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: '14px' },
  card: {
    background: '#fff', border: '1px solid #e8e8e8',
    borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '0.75rem',
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#E1F5EE', color: '#0F6E56',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, flexShrink: 0,
  },
  productTag: {
    background: '#f5f5f5', color: '#555',
    fontSize: '11px', fontFamily: 'monospace',
    padding: '2px 8px', borderRadius: '10px',
  },
  iconBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', padding: '4px 6px',
    borderRadius: '6px', fontSize: '15px',
  },
};
