import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function ReviewForm({ onSave, editReview }) {
  const [productId, setProductId] = useState('');
  const [userId,    setUserId]    = useState('');
  const [username,  setUsername]  = useState('');
  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [comment,   setComment]   = useState('');
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState('');

  useEffect(() => {
    if (editReview) {
      setProductId(editReview.productId || '');
      setUserId(editReview.userId || '');
      setUsername(editReview.username || '');
      setRating(editReview.rating || 0);
      setComment(editReview.comment || '');
      setErrors({});
      setSuccess('');
    } else {
      clearForm();
    }
  }, [editReview]);

  const clearForm = () => {
    setProductId(''); setUserId(''); setUsername('');
    setRating(0); setComment(''); setErrors({}); setSuccess('');
  };

  const validate = () => {
    const e = {};
    if (!productId.trim()) e.productId = 'Product ID is required.';
    if (!userId.trim())    e.userId    = 'User ID is required.';
    if (!username.trim())  e.username  = 'Username is required.';
    if (!rating)           e.rating    = 'Please select a rating.';
    if (!comment.trim())   e.comment   = 'Comment is required.';
    else if (comment.trim().length < 5)    e.comment = 'At least 5 characters.';
    else if (comment.trim().length > 1000) e.comment = 'Max 1000 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const isEdit = !!editReview;
      const url    = isEdit ? `${BASE_URL}/api/reviews/${editReview.id}` : `${BASE_URL}/api/reviews`;
      const method = isEdit ? 'PUT' : 'POST';
      const body   = isEdit
          ? JSON.stringify({ rating, comment })
          : JSON.stringify({ productId, userId, username, rating, comment });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) throw new Error(await res.text());

      setSuccess(isEdit ? '✅ Review updated!' : '✅ Review submitted!');
      clearForm();
      setTimeout(() => setSuccess(''), 3000);
      onSave();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={s.card}>
        <h2 style={s.title}>
          <span style={{ marginRight: '8px' }}>{editReview ? '✏️' : '📝'}</span>
          {editReview ? 'Edit Review' : 'Write a Review'}
        </h2>

        {success         && <div style={s.alertSuccess}>{success}</div>}
        {errors.submit   && <div style={s.alertError}>❌ {errors.submit}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {!editReview && (
              <>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Product ID *</label>
                    <input
                        style={{ ...s.input, ...(errors.productId ? s.inputErr : {}) }}
                        value={productId}
                        onChange={e => setProductId(e.target.value)}
                        placeholder="e.g. toy-123"
                    />
                    {errors.productId && <span style={s.err}>{errors.productId}</span>}
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>User ID *</label>
                    <input
                        style={{ ...s.input, ...(errors.userId ? s.inputErr : {}) }}
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        placeholder="e.g. user-456"
                    />
                    {errors.userId && <span style={s.err}>{errors.userId}</span>}
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Username *</label>
                  <input
                      style={{ ...s.input, ...(errors.username ? s.inputErr : {}) }}
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Your display name"
                  />
                  {errors.username && <span style={s.err}>{errors.username}</span>}
                </div>
              </>
          )}

          <div style={s.field}>
            <label style={s.label}>Rating *</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                  <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '32px', padding: '0 2px', lineHeight: 1,
                        color: star <= (hovered || rating) ? '#FFB347' : '#e2e8f0',
                        transition: 'all 0.2s ease',
                        transform: star <= hovered ? 'scale(1.1)' : 'scale(1)',
                      }}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >★</button>
              ))}
            </div>
            {errors.rating && <span style={s.err}>{errors.rating}</span>}
          </div>

          <div style={s.field}>
            <label style={s.label}>
              Comment *{' '}
              <span style={{ color: '#a0aec0', fontWeight: 400, fontSize: '12px' }}>
              {comment.length}/1000
            </span>
            </label>
            <textarea
                style={{ ...s.input, minHeight: '100px', resize: 'vertical', ...(errors.comment ? s.inputErr : {}) }}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                maxLength={1000}
            />
            {errors.comment && <span style={s.err}>{errors.comment}</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" style={s.btnOutline} onClick={clearForm}>Clear</button>
            <button type="submit" style={s.btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : editReview ? 'Update review' : 'Submit review'}
            </button>
          </div>
        </form>
      </div>
  );
}

const s = {
  card: {
    background: '#fff',
    border: 'none',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    borderRadius: '16px', padding: '2rem',
    marginBottom: '2rem',
  },
  title: { fontSize: '20px', fontWeight: 700, color: '#ff6b6b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' },
  row:   { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', marginBottom: '1.25rem', flex: 1, minWidth: '180px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '8px' },
  input: {
    border: '2px solid #edf2f7', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
    outline: 'none', color: '#2d3748', background: '#f8fafc',
    transition: 'border-color 0.2s'
  },
  inputErr:   { borderColor: '#FC8181', background: '#FFF5F5' },
  err:        { color: '#E53E3E', fontSize: '12px', marginTop: '6px', fontWeight: 500 },
  alertSuccess: { background: '#C6F6D5', color: '#22543D', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 },
  alertError:   { background: '#FED7D7', color: '#822727', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 },
  btnOutline: {
    padding: '10px 24px', border: '2px solid #e2e8f0', borderRadius: '20px',
    background: '#fff', color: '#4a5568', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
  },
  btnPrimary: {
    padding: '10px 24px', border: 'none', borderRadius: '20px',
    background: '#667eea', color: '#fff', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)', transition: 'transform 0.1s'
  },
};