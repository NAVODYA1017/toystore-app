import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../../services/productService';

function ProductDetail({ isClientView = false }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch {
            alert('Product not found');
            navigate(isClientView ? '/shop' : '/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            try {
                await deleteProduct(id);
                navigate('/admin/products');
            } catch {
                alert('Failed to delete product');
            }
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '6rem', color: '#7c3aed' }}>
            <div style={{ fontSize: '3rem', animation: 'float 1.5s ease-in-out infinite', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontWeight: '600', color: '#6b7280' }}>Loading product...</p>
        </div>
    );

    if (!product) return null;

    const inStock = product.stockQuantity > 0;

    return (
        <div style={{ background: '#f3f0ff', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Back Button */}
                <button
                    onClick={() => navigate(isClientView ? '/shop' : '/admin/products')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#7c3aed';
                        e.currentTarget.style.color = '#7c3aed';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#374151';
                    }}
                >
                    ← Back
                </button>

                {/* Main Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 0,
                }}>
                    {/* Left - Image */}
                    <div style={{
                        height: '500px',
                        background: product.imageUrl
                            ? 'transparent'
                            : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentNode.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)';
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: '9rem', animation: 'float 3s ease-in-out infinite' }}>🧸</span>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                        {/* Category + Stock */}
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {product.categoryId && (
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    background: '#f3e8ff',
                                    color: '#7c3aed',
                                }}>
                  {product.categoryId}
                </span>
                            )}
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                background: inStock ? '#dcfce7' : '#fee2e2',
                                color: inStock ? '#15803d' : '#dc2626',
                            }}>
                {inStock ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
              </span>
                        </div>

                        {/* Name */}
                        <h1 style={{
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            color: '#111827',
                            lineHeight: '1.3',
                        }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#7c3aed',
                            lineHeight: 1,
                        }}>
                            ${product.price}
                        </div>

                        {/* Description */}
                        <p style={{
                            fontSize: '1rem',
                            color: '#6b7280',
                            lineHeight: '1.7',
                        }}>
                            {product.description}
                        </p>

                        {/* Divider */}
                        <div style={{ height: '1px', background: '#f3f4f6' }} />

                        {/* Meta Info */}
                        <div style={{
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.8rem',
                        }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>
                                    PRICE
                                </p>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>
                                    ${product.price}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>
                                    STOCK
                                </p>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>
                                    {product.stockQuantity} units
                                </p>
                            </div>
                            {product.categoryId && (
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>
                                        CATEGORY
                                    </p>
                                    <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>
                                        {product.categoryId}
                                    </p>
                                </div>
                            )}
                            {product.createdAt && (
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>
                                        ADDED
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: '#111827', fontWeight: '700' }}>
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
                            {isClientView ? (
                                <button
                                    disabled={!inStock}
                                    style={{
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: 'white',
                                        background: inStock
                                            ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                                            : '#e5e7eb',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: inStock ? 'pointer' : 'not-allowed',
                                        color: inStock ? 'white' : '#9ca3af',
                                    }}
                                >
                                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button
                                        onClick={() => navigate(`/admin/edit/${product.id}`)}
                                        className="btn-edit"
                                        style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
                                    >
                                        Edit Product
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn-danger"
                                        style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
                                    >
                                        Delete Product
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;