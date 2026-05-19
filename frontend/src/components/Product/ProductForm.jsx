import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';

const EMPTY_PRODUCT = {
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: ''
};

function ProductForm() {
    const [product, setProduct]     = useState(EMPTY_PRODUCT);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]     = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const { id }   = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (e) {
            console.error('Failed to load categories', e);
        }
    };

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct({
                name:          data.name          || '',
                description:   data.description   || '',
                price:         data.price         || '',
                stockQuantity: data.stockQuantity || '',
                imageUrl:      data.imageUrl      || '',
                categoryId:    data.categoryId    || '',
            });
        } catch {
            alert('Failed to load product');
            navigate('/admin/products');
        }
    };

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        if (e.target.name === 'imageUrl') setImageError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            name:          product.name,
            description:   product.description,
            price:         parseFloat(product.price),
            stockQuantity: parseInt(product.stockQuantity),
            imageUrl:      product.imageUrl,
            categoryId:    product.categoryId,
        };
        try {
            if (isEditMode) {
                await updateProduct(id, payload);
            } else {
                await createProduct(payload);
            }
            navigate('/admin/products');
        } catch (err) {
            console.error(err);
            alert('Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    // ── Shared input style ──────────────────────────────────────────
    const inputStyle = {
        width:        '100%',
        padding:      '0.85rem 1rem',
        fontSize:     '0.95rem',
        borderRadius: '10px',
        border:       '2px solid #e5e7eb',
        background:   'white',          // ← FORCES WHITE
        color:        '#111827',        // ← FORCES DARK TEXT
        fontFamily:   'inherit',
        boxSizing:    'border-box',
        transition:   'border-color 0.2s, box-shadow 0.2s',
        outline:      'none',
    };

    const labelStyle = {
        display:      'block',
        marginBottom: '0.5rem',
        fontWeight:   '700',
        fontSize:     '0.9rem',
        color:        '#374151',
    };

    const fieldWrap = { marginBottom: '1.5rem' };
    // ───────────────────────────────────────────────────────────────

    return (
        <div style={{ background: '#f3f0ff', minHeight: '100vh' }}>

            {/* Page header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
            }}>
                <h1 style={{
                    color:      'white',
                    fontSize:   '1.8rem',
                    fontWeight: '800',
                }}>
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.4rem' }}>
                    {isEditMode ? 'Update the product details below' : 'Fill in the details to add a new toy'}
                </p>
            </div>

            {/* Form card */}
            <div style={{ maxWidth: '680px', margin: '2.5rem auto', padding: '0 1.5rem 4rem' }}>
                <div style={{
                    background:   'white',
                    borderRadius: '20px',
                    padding:      '2.5rem',
                    boxShadow:    '0 8px 40px rgba(0,0,0,0.1)',
                }}>
                    <form onSubmit={handleSubmit}>

                        {/* ── Product Name ── */}
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Product Name <Req /></label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="e.g. Rainbow Teddy Bear"
                                required
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#7c3aed';
                                    e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow   = 'none';
                                }}
                            />
                        </div>

                        {/* ── Description ── */}
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Description <Req /></label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                placeholder="Describe the toy — material, age range, features..."
                                required
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#7c3aed';
                                    e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow   = 'none';
                                }}
                            />
                        </div>

                        {/* ── Image URL ── */}
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={product.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/toy-image.jpg"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#7c3aed';
                                    e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow   = 'none';
                                }}
                            />

                            {/* Image preview */}
                            {product.imageUrl && !imageError && (
                                <div style={{
                                    marginTop:    '0.8rem',
                                    borderRadius: '10px',
                                    overflow:     'hidden',
                                    border:       '2px solid #e5e7eb',
                                    height:       '180px',
                                    background:   '#f9fafb',
                                    display:      'flex',
                                    alignItems:   'center',
                                    justifyContent: 'center',
                                }}>
                                    <img
                                        src={product.imageUrl}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                                        onError={() => setImageError(true)}
                                    />
                                </div>
                            )}

                            {product.imageUrl && imageError && (
                                <p style={{
                                    marginTop:  '0.5rem',
                                    fontSize:   '0.82rem',
                                    color:      '#dc2626',
                                    fontWeight: '600',
                                }}>
                                    ⚠️ Cannot load image — please check the URL.
                                </p>
                            )}
                        </div>

                        {/* ── Category ── */}
                        <div style={fieldWrap}>
                            <label style={labelStyle}>Category</label>
                            <select
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleChange}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#7c3aed';
                                    e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow   = 'none';
                                }}
                            >
                                <option value="">Select a category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id || cat._id || cat.name} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ── Price & Stock side by side ── */}
                        <div style={{
                            display:             'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap:                 '1rem',
                            marginBottom:        '2rem',
                        }}>
                            {/* Price */}
                            <div>
                                <label style={labelStyle}>Price ($) <Req /></label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#7c3aed';
                                        e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow   = 'none';
                                    }}
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label style={labelStyle}>Stock Quantity <Req /></label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={product.stockQuantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#7c3aed';
                                        e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow   = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* ── Live Preview Strip ── */}
                        {(product.name || product.price) && (
                            <div style={{
                                background:   '#f9fafb',
                                border:       '2px solid #e5e7eb',
                                borderRadius: '12px',
                                padding:      '1.2rem',
                                marginBottom: '2rem',
                                display:      'flex',
                                alignItems:   'center',
                                gap:          '1rem',
                            }}>
                                {/* Mini image or emoji */}
                                <div style={{
                                    width:          '56px',
                                    height:         '56px',
                                    borderRadius:   '10px',
                                    overflow:       'hidden',
                                    background:     'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    flexShrink:     0,
                                    display:        'flex',
                                    alignItems:     'center',
                                    justifyContent: 'center',
                                    fontSize:       '1.8rem',
                                }}>
                                    {product.imageUrl && !imageError
                                        ? <img src={product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImageError(true)} />
                                        : '🧸'
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontSize:     '0.95rem',
                                        fontWeight:   '700',
                                        color:        '#111827',
                                        marginBottom: '2px',
                                        overflow:     'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace:   'nowrap',
                                    }}>
                                        {product.name || 'Product Name'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {product.price && (
                                            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#7c3aed' }}>
                        ${product.price}
                      </span>
                                        )}
                                        {product.stockQuantity && (
                                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>
                        Stock: {product.stockQuantity}
                      </span>
                                        )}
                                        {product.categoryId && (
                                            <span style={{
                                                fontSize:   '0.75rem',
                                                fontWeight: '700',
                                                padding:    '2px 8px',
                                                borderRadius: '20px',
                                                background: '#f3e8ff',
                                                color:      '#7c3aed',
                                            }}>
                        {product.categoryId}
                      </span>
                                        )}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize:   '0.75rem',
                                    color:      '#9ca3af',
                                    fontWeight: '600',
                                    flexShrink: 0,
                                }}>
                  Preview
                </span>
                            </div>
                        )}

                        {/* ── Submit Buttons ── */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex:         2,
                                    padding:      '1rem',
                                    fontSize:     '1rem',
                                    fontWeight:   '700',
                                    color:        'white',
                                    background:   loading
                                        ? '#c4b5fd'
                                        : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    border:       'none',
                                    borderRadius: '12px',
                                    cursor:       loading ? 'not-allowed' : 'pointer',
                                    transition:   'all 0.2s ease',
                                    boxShadow:    loading ? 'none' : '0 4px 15px rgba(124,58,237,0.35)',
                                }}
                                onMouseOver={(e) => {
                                    if (!loading) {
                                        e.target.style.transform  = 'translateY(-2px)';
                                        e.target.style.boxShadow  = '0 8px 25px rgba(124,58,237,0.45)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(124,58,237,0.35)';
                                }}
                            >
                                {loading
                                    ? 'Saving...'
                                    : isEditMode
                                        ? 'Update Product'
                                        : 'Create Product'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                style={{
                                    flex:         1,
                                    padding:      '1rem',
                                    fontSize:     '1rem',
                                    fontWeight:   '700',
                                    color:        '#374151',
                                    background:   'white',
                                    border:       '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor:       'pointer',
                                    transition:   'all 0.2s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#7c3aed';
                                    e.currentTarget.style.color       = '#7c3aed';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.color       = '#374151';
                                }}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

// Small red asterisk for required fields
function Req() {
    return <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>;
}

export default ProductForm;
