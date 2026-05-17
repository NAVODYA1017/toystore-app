import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../../services/productService';
import { useCart } from '../../context/CartContext';

function ProductDetail({ isClientView = false }) {
    const [product, setProduct]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded]       = useState(false);
    const { id }                  = useParams();
    const navigate                = useNavigate();
    const { addToCart }           = useCart();

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

    // ✅ Fixed: actually calls addToCart
    const handleAddToCart = async () => {
        await addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // ✅ Fixed: Buy Now — add then go to checkout
    const handleBuyNow = async () => {
        await addToCart(product, quantity);
        navigate('/checkout');
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '6rem', color: '#7c3aed' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontWeight: '600', color: '#6b7280' }}>Loading product...</p>
        </div>
    );

    if (!product) return null;

    const inStock = product.stockQuantity > 0;
    const stock   = product.stockQuantity ?? 0;

    return (
        <div style={{ background: '#f3f0ff', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Back Button */}
                <button
                    onClick={() => navigate(isClientView ? '/shop' : '/admin/products')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'white', border: '2px solid #e5e7eb',
                        borderRadius: '10px', padding: '0.6rem 1.2rem',
                        fontSize: '0.9rem', fontWeight: '600', color: '#374151',
                        cursor: 'pointer', marginBottom: '1.5rem', transition: 'all 0.2s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
                    onMouseOut={e  => { e.currentTarget.style.borderColor = '#e5e7eb';  e.currentTarget.style.color = '#374151'; }}
                >
                    ← Back
                </button>

                {/* Main Card */}
                <div style={{
                    background: 'white', borderRadius: '24px', overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                }}>
                    {/* Left - Image */}
                    <div style={{
                        height: '500px',
                        background: product.imageUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    }}>
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name}
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = 'linear-gradient(135deg, #a855f7, #7c3aed)'; }}
                            />
                        ) : (
                            <span style={{ fontSize: '9rem' }}>🧸</span>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                        {/* Category + Stock badges */}
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {product.categoryId && (
                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', background: '#f3e8ff', color: '#7c3aed' }}>
                                    {product.categoryId}
                                </span>
                            )}
                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', background: inStock ? '#dcfce7' : '#fee2e2', color: inStock ? '#15803d' : '#dc2626' }}>
                                {inStock ? `In Stock (${stock})` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Name */}
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', lineHeight: '1.3' }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#7c3aed', lineHeight: 1 }}>
                            LKR {product.price?.toFixed(2)}
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.7' }}>
                            {product.description}
                        </p>

                        <div style={{ height: '1px', background: '#f3f4f6' }} />

                        {/* Meta Info */}
                        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>PRICE</p>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>LKR {product.price?.toFixed(2)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>STOCK</p>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>{stock} units</p>
                            </div>
                            {product.categoryId && (
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>CATEGORY</p>
                                    <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '700' }}>{product.categoryId}</p>
                                </div>
                            )}
                            {product.createdAt && (
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>ADDED</p>
                                    <p style={{ fontSize: '0.9rem', color: '#111827', fontWeight: '700' }}>{new Date(product.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
                            {isClientView ? (
                                inStock ? (
                                    <>
                                        {/* ✅ Quantity Selector */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '2px solid #ede9fe', borderRadius: '12px', overflow: 'hidden', width: 'fit-content', background: '#faf5ff' }}>
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                    style={{ width: 40, height: 40, border: 'none', background: 'transparent', color: '#7c3aed', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }}>−</button>
                                            <span style={{ minWidth: 40, textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: '#1a0533', borderLeft: '1px solid #ede9fe', borderRight: '1px solid #ede9fe', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {quantity}
                                            </span>
                                            <button onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                                                    style={{ width: 40, height: 40, border: 'none', background: 'transparent', color: '#7c3aed', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }}>+</button>
                                        </div>

                                        {/* ✅ Buy Now */}
                                        <button onClick={handleBuyNow} style={{
                                            padding: '1rem', fontSize: '1rem', fontWeight: '700', color: 'white',
                                            background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                            border: 'none', borderRadius: '12px', cursor: 'pointer',
                                            boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
                                        }}>
                                            ⚡ Buy Now
                                        </button>

                                        {/* ✅ Add to Cart */}
                                        <button onClick={handleAddToCart} style={{
                                            padding: '1rem', fontSize: '1rem', fontWeight: '700', color: 'white',
                                            background: added
                                                ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                                                : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                            border: 'none', borderRadius: '12px', cursor: 'pointer',
                                            boxShadow: added
                                                ? '0 4px 16px rgba(22,163,74,0.3)'
                                                : '0 4px 16px rgba(124,58,237,0.3)',
                                            transition: 'all 0.3s',
                                        }}>
                                            {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                                        </button>
                                    </>
                                ) : (
                                    <button disabled style={{
                                        padding: '1rem', fontSize: '1rem', fontWeight: '700',
                                        background: '#e5e7eb', color: '#9ca3af',
                                        border: 'none', borderRadius: '12px', cursor: 'not-allowed',
                                    }}>
                                        Out of Stock
                                    </button>
                                )
                            ) : (
                                // ✅ Fixed: correct admin edit path
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button
                                        onClick={() => navigate(`/admin/products/edit/${product._id || product.id}`)}
                                        style={{
                                            flex: 1, padding: '0.9rem', fontSize: '1rem', fontWeight: '700',
                                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                        }}>
                                        ✏️ Edit Product
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={{
                                            flex: 1, padding: '0.9rem', fontSize: '1rem', fontWeight: '700',
                                            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                        }}>
                                        🗑️ Delete
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