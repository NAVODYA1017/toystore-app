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
      <h2 style={s.title}>{editReview ? '✏️ Edit Review' : '📝 Write a Review'}</h2>

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
                  fontSize: '30px', padding: '0 2px', lineHeight: 1,
                  color: star <= (hovered || rating) ? '#EF9F27' : '#ddd',
                  transition: 'color 0.1s',
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
            <span style={{ color: '#bbb', fontWeight: 400, fontSize: '12px' }}>
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

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
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
    background: '#fff', border: '1px solid #e8e8e8',
    borderRadius: '16px', padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  title: { fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '1.2rem' },
  row:   { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', marginBottom: '1rem', flex: 1, minWidth: '180px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' },
  input: {
    border: '1px solid #ddd', borderRadius: '8px',
    padding: '9px 12px', fontSize: '14px',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
    outline: 'none', color: '#111', background: '#fff',
  },
  inputErr:   { borderColor: '#A32D2D' },
  err:        { color: '#A32D2D', fontSize: '12px', marginTop: '4px' },
  alertSuccess: { background: '#E1F5EE', color: '#0F6E56', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' },
  alertError:   { background: '#FCEBEB', color: '#A32D2D', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' },
  btnOutline: {
    padding: '9px 20px', border: '1px solid #ddd', borderRadius: '8px',
    background: 'transparent', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  btnPrimary: {
    padding: '9px 20px', border: '1px solid #0F6E56', borderRadius: '8px',
    background: '#0F6E56', color: '#E1F5EE', fontSize: '14px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
  },
};
