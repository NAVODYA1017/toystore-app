import React, { useEffect, useState } from 'react';
import { getReviewsByProduct, addReview, deleteReview } from '../../services/reviewService';

// ── Star selector ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}
                    style={{
                        fontSize: 28,
                        cursor: 'pointer',
                        color: n <= (hovered || value) ? '#f59e0b' : '#d1d5db',
                        transition: 'color 0.15s, transform 0.15s',
                        transform: n <= (hovered || value) ? 'scale(1.2)' : 'scale(1)',
                        userSelect: 'none',
                    }}
                >★</span>
            ))}
        </div>
    );
}

// ── Static star display ────────────────────────────────────────────────────────
function Stars({ rating }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ color: n <= rating ? '#f59e0b' : '#d1d5db', fontSize: 15 }}>★</span>
            ))}
        </span>
    );
}

// ── Avatar initials ────────────────────────────────────────────────────────────
function Avatar({ name }) {
    const initials = (name || 'U').slice(0, 2).toUpperCase();
    const colors = ['#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#ec4899'];
    const color  = colors[initials.charCodeAt(0) % colors.length];
    return (
        <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{initials}</div>
    );
}

// ── Main ReviewSection component ───────────────────────────────────────────────
// Props:
//   productId  — required, used to fetch & submit reviews
//   productName — optional, shown in the submit form title
//   compact    — if true, shows a smaller "Leave a Review" button style (for OrderList)
export default function ReviewSection({ productId, productName, compact = false }) {
    const [reviews, setReviews]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating]     = useState(5);
    const [comment, setComment]   = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);

    const user = (() => { try { return JSON.parse(localStorage.getItem('loggedInUser') || '{}'); } catch { return {}; } })();

    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        getReviewsByProduct(productId)
            .then(data => {
                setReviews(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("ERROR FETCHING REVIEWS:", err);
                setReviews([]);
            })
            .finally(() => setLoading(false));
    }, [productId, submitted]);

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const handleSubmit = async () => {
        if (!comment.trim()) return;
        if (!user.id && !user.email) { alert('Please log in to leave a review.'); return; }
        setSubmitting(true);
        try {
            await addReview({
                productId,
                userId: user.id || user.email,
                rating,
                comment: comment.trim(),
            });
            setComment('');
            setRating(5);
            setShowForm(false);
            setSubmitted(s => !s); // trigger reload
        } catch {
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await deleteReview(id);
            setSubmitted(s => !s);
        } catch {
            alert('Failed to delete review.');
        }
    };

    const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
        n,
        count: reviews.filter(r => r.rating === n).length,
    }));

    return (
        <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #ede9fe',
            padding: compact ? '20px' : '28px 32px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.06)',
            fontFamily: 'Segoe UI, sans-serif',
        }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: compact ? 16 : 20, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
                        ⭐ Ratings & Reviews
                        {productName && <span style={{ fontSize: 14, fontWeight: 500, color: '#888', marginLeft: 8 }}>for {productName}</span>}
                    </h2>
                    {avgRating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                            <span style={{ fontSize: 32, fontWeight: 900, color: '#f59e0b' }}>{avgRating}</span>
                            <div>
                                <Stars rating={Math.round(avgRating)} />
                                <div style={{ fontSize: 12, color: '#888' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                    )}
                </div>

                {user.email && (
                    <button onClick={() => setShowForm(f => !f)} style={{
                        background: showForm ? '#fee2e2' : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                        color: showForm ? '#dc2626' : '#fff',
                        border: 'none', borderRadius: 12,
                        padding: '10px 20px', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {showForm ? '✕ Cancel' : '✏️ Write a Review'}
                    </button>
                )}
            </div>

            {/* ── Rating breakdown ── */}
            {reviews.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    {ratingCounts.map(({ n, count }) => (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: '#888', width: 12 }}>{n}</span>
                            <span style={{ color: '#f59e0b', fontSize: 12 }}>★</span>
                            <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                                <div style={{
                                    width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                                    borderRadius: 10,
                                    transition: 'width 0.5s',
                                }} />
                            </div>
                            <span style={{ fontSize: 12, color: '#888', width: 18 }}>{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Write Review Form ── */}
            {showForm && (
                <div style={{
                    background: '#faf8ff', border: '1.5px solid #ede9fe',
                    borderRadius: 16, padding: 20, marginBottom: 24,
                }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                        Your Rating
                    </div>
                    <StarPicker value={rating} onChange={setRating} />
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        style={{
                            width: '100%', marginTop: 14,
                            padding: '12px 14px',
                            borderRadius: 12, border: '1.5px solid #ede9fe',
                            fontSize: 14, resize: 'vertical',
                            fontFamily: 'Segoe UI, sans-serif',
                            boxSizing: 'border-box', outline: 'none',
                            background: '#fff',
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !comment.trim()}
                        style={{
                            marginTop: 12,
                            background: submitting || !comment.trim() ? '#e5e7eb' : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                            color: submitting || !comment.trim() ? '#9ca3af' : '#fff',
                            border: 'none', borderRadius: 10,
                            padding: '10px 28px', fontSize: 14, fontWeight: 700,
                            cursor: submitting || !comment.trim() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {submitting ? '⏳ Submitting...' : '🚀 Submit Review'}
                    </button>
                </div>
            )}

            {/* ── Reviews List ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 32, color: '#888' }}>Loading reviews…</div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                    <div style={{ color: '#888', fontSize: 14 }}>No reviews yet. Be the first to review!</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {reviews.map((rev, i) => (
                        <div key={rev.id || i} style={{
                            display: 'flex', gap: 12,
                            padding: '14px 0',
                            borderBottom: i < reviews.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}>
                            <Avatar name={rev.userId} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 2 }}>
                                            {rev.userId?.includes('@')
                                                ? rev.userId.split('@')[0]
                                                : (rev.userId?.slice(0, 12) || 'Anonymous')}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <Stars rating={rev.rating} />
                                            <span style={{ fontSize: 11, color: '#aaa' }}>
                                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Delete own review */}
                                    {(user.id === rev.userId || user.email === rev.userId) && (
                                        <button onClick={() => handleDelete(rev.id)} style={{
                                            background: 'none', border: 'none',
                                            color: '#dc2626', cursor: 'pointer', fontSize: 13,
                                        }}>🗑️</button>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                                    {rev.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
