import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts, getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import ReviewSection from './ReviewSection';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

  .pd-root {
    min-height: 100vh;
    background: #faf9f7;
    font-family: 'DM Sans', sans-serif;
  }

  .pd-back-bar {
    background: linear-gradient(135deg, #1a0533, #2d1052);
    padding: 1rem 2rem;
  }
  .pd-back-btn {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.45rem 1.1rem;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pd-back-btn:hover { background: rgba(255,255,255,0.22); }

  .pd-main {
    max-width: 1080px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }
  @media (max-width: 700px) { .pd-main { grid-template-columns: 1fr; } }

  /* Image side */
  .pd-image-wrap {
    border-radius: 24px;
    overflow: hidden;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    aspect-ratio: 1 / 1;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    box-shadow: 0 8px 40px rgba(124,58,237,0.12);
  }
  .pd-image-wrap img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .pd-image-placeholder { font-size: 7rem; }

  .pd-stock-badge {
    position: absolute;
    top: 1rem; right: 1rem;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
    backdrop-filter: blur(8px);
  }
  .pd-stock-badge.in { background: rgba(220,252,231,0.9); color: #15803d; }
  .pd-stock-badge.out { background: rgba(254,226,226,0.9); color: #dc2626; }

  /* Info side */
  .pd-category {
    display: inline-block;
    background: #f3e8ff;
    color: #7c3aed;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 0.9rem;
  }
  .pd-name {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 900;
    color: #1a0533;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .pd-price {
    font-family: 'Syne', sans-serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: #7c3aed;
    margin-bottom: 0.5rem;
  }
  .pd-stock-text {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
  }
  .pd-desc {
    font-size: 0.95rem;
    line-height: 1.75;
    color: #4b5563;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px dashed #e5e7eb;
  }

  .pd-qty-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }
  .pd-qty-ctrl {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 2px solid #ede9fe;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    background: #faf5ff;
  }
  .pd-qty-btn {
    width: 44px; height: 44px;
    border: none;
    background: transparent;
    color: #7c3aed;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-qty-btn:hover { background: #ede9fe; }
  .pd-qty-num {
    min-width: 48px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a0533;
    border-left: 1px solid #ede9fe;
    border-right: 1px solid #ede9fe;
    height: 44px;
    display: flex; align-items: center; justify-content: center;
  }

  .pd-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  .pd-btn-buy {
    flex: 1; min-width: 130px;
    padding: 0.9rem 1rem;
    background: linear-gradient(135deg, #f97316, #fb923c);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    transition: all 0.2s;
  }
  .pd-btn-buy:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(249,115,22,0.38); }

  .pd-btn-cart {
    flex: 1; min-width: 130px;
    padding: 0.9rem 1rem;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pd-btn-cart.idle {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
  }
  .pd-btn-cart.idle:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(124,58,237,0.4); }
  .pd-btn-cart.added {
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: #fff;
    box-shadow: 0 4px 16px rgba(22,163,74,0.3);
  }

  /* Related */
  .pd-related {
    max-width: 1080px;
    margin: 0 auto 3rem;
    padding: 0 1.5rem;
  }
  .pd-related-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a0533;
    margin-bottom: 1.25rem;
  }
  .pd-related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .pd-related-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ede9fe;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .pd-related-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(124,58,237,0.14);
    border-color: #c4b5fd;
  }
  .pd-related-img {
    height: 140px;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    font-size: 3rem;
  }
  .pd-related-img img { width: 100%; height: 100%; object-fit: cover; }
  .pd-related-info { padding: 0.85rem; }
  .pd-related-name {
    font-size: 0.85rem; font-weight: 600; color: #111827;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  .pd-related-price {
    font-family: 'Syne', sans-serif;
    font-size: 1rem; font-weight: 800; color: #7c3aed;
  }

  /* Loading / Error */
  .pd-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 1rem; color: #7c3aed;
  }
  .pd-spinner {
    width: 40px; height: 40px;
    border: 3px solid #ede9fe;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [related, setRelated]   = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded]       = useState(false);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setAdded(false);
        setQuantity(1);
        getProductById(id).then(data => {
            setProduct(data);
            setLoading(false);
            getAllProducts().then(all => {
                const catKey = data.categoryId || data.category;
                const rel = all
                    .filter(p => {
                        const pCat = p.categoryId || p.category;
                        const pid  = p._id || p.id;
                        return pCat === catKey && pid !== id;
                    })
                    .slice(0, 4);
                setRelated(rel);
            });
        }).catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    const stock = product?.stockQuantity ?? product?.quantity ?? 0;
    const inStock = stock > 0;

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="pd-root">
                <div className="pd-loading">
                    <div className="pd-spinner" />
                    <span style={{ fontFamily: 'DM Sans', color: '#7c3aed', fontWeight: 600 }}>Loading product…</span>
                </div>
            </div>
        </>
    );

    if (!product) return (
        <>
            <style>{styles}</style>
            <div className="pd-root">
                <div className="pd-loading">
                    <span style={{ fontSize: '3rem' }}>😕</span>
                    <span style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Product not found.</span>
                    <button onClick={() => navigate('/shop')} style={{
                        padding: '0.6rem 1.5rem', background: '#7c3aed', color: '#fff',
                        border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
                    }}>Browse Shop</button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="pd-root animate-fade-in">

                {/* Back bar */}
                <div className="pd-back-bar">
                    <button className="pd-back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>

                {/* Main product grid */}
                <div className="pd-main">
                    {/* Image */}
                    <div className="pd-image-wrap">
                        {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name}
                                   onError={e => { e.target.style.display = 'none'; }} />
                            : <div className="pd-image-placeholder">🧸</div>
                        }
                        <span className={`pd-stock-badge ${inStock ? 'in' : 'out'}`}>
                            {inStock ? `✓ In Stock` : '✗ Out of Stock'}
                        </span>
                    </div>

                    {/* Info */}
                    <div>
                        <div className="pd-category">
                            {product.categoryId || product.category || 'Toy'}
                        </div>
                        <h1 className="pd-name">{product.name}</h1>
                        <div className="pd-price">LKR {product.price?.toFixed(2)}</div>
                        {inStock && (
                            <div className="pd-stock-text" style={{ color: '#16a34a' }}>
                                {stock} units available
                            </div>
                        )}

                        {product.description && (
                            <p className="pd-desc">{product.description}</p>
                        )}

                        {inStock && (
                            <>
                                <div className="pd-qty-label">Quantity</div>
                                <div className="pd-qty-ctrl">
                                    <button className="pd-qty-btn"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span className="pd-qty-num">{quantity}</span>
                                    <button className="pd-qty-btn"
                                            onClick={() => setQuantity(q => Math.min(stock, q + 1))}>+</button>
                                </div>

                                <div className="pd-actions">
                                    <button className="pd-btn-buy" onClick={handleBuyNow}>
                                        ⚡ Buy Now
                                    </button>
                                    <button
                                        className={`pd-btn-cart ${added ? 'added' : 'idle'}`}
                                        onClick={handleAddToCart}
                                    >
                                        {added ? '✓ Added!' : '🛒 Add to Cart'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div style={{ maxWidth: 1080, margin: '0 auto 3rem', padding: '0 1.5rem' }}>
                    <ReviewSection
                        productId={product._id || product.id}
                        productName={product.name}
                    />
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="pd-related">
                        <h2 className="pd-related-title">🎯 You might also like</h2>
                        <div className="pd-related-grid">
                            {related.map(p => {
                                const pid = p._id || p.id;
                                return (
                                    <div key={pid} className="pd-related-card"
                                         onClick={() => navigate(`/product/${pid}`)}>
                                        <div className="pd-related-img">
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt={p.name} />
                                                : '🧸'}
                                        </div>
                                        <div className="pd-related-info">
                                            <div className="pd-related-name">{p.name}</div>
                                            <div className="pd-related-price">
                                                LKR {p.price?.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}