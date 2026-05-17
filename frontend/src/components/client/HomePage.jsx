import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    useEffect(() => {
        getAllProducts().then(data => {
            setProducts(data.slice(0, 8));
            setLoadingProducts(false);
        });
        getAllCategories().then(data => {
            setCategories(data);
            setLoadingCategories(false);
        });
    }, []);

    return (
        <div className="animate-fade-in">
            {/* ── Hero ── */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                padding: '80px 48px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🧸🎮🎯</div>
                <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px' }}>Welcome to Neverland</h1>
                <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32 }}>
                    Discover amazing toys for kids of all ages!
                </p>
                <Link to="/shop" style={{
                    background: '#fff',
                    color: '#4a2d8f',
                    padding: '14px 40px',
                    borderRadius: 30,
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: 18,
                }}>Shop Now →</Link>
            </div>

            {/* ── Categories ── */}
            <div style={{ padding: '48px 32px' }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#2d2d2d' }}>Shop by Category</h2>
                {loadingCategories ? (
                    <div className="smooth-spinner" />
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}
                    >
                        {categories.map(c => (
                            <motion.div key={c.id || c.name} variants={itemVariants}>
                                <Link to={`/shop?category=${encodeURIComponent(c.name)}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    background: '#fff', border: '1px solid #ede9fe',
                                    padding: '12px 24px', borderRadius: 16,
                                    textDecoration: 'none', color: '#4a2d8f',
                                    fontWeight: 700, fontSize: 14,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ fontSize: 24 }}>{c.imageUrl || '📦'}</span>
                                    {c.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ── Featured Products ── */}
            <div style={{ padding: '0 32px 48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2d2d2d', margin: 0 }}>🔥 Featured Products</h2>
                    <Link to="/shop" style={{ color: '#4a2d8f', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
                </div>

                {loadingProducts ? (
                    <div className="smooth-spinner" />
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 24,
                        }}
                    >
                        {products.map(p => (
                            <motion.div key={p._id || p.id} variants={itemVariants}>
                                <ProductCard product={p} addToCart={addToCart} navigate={navigate} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product, addToCart, navigate }) {
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const id = product._id || product.id;

    return (
        <div onClick={() => navigate(`/product/${id}`)} style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
             onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
        >
            <div style={{
                height: 200,
                background: '#f8f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: 64 }}>🧸</span>
                )}
            </div>

            <div style={{ padding: '16px' }}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{product.category || 'Toy'}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#2d2d2d',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                </div>

                <div style={{ fontSize: 12, color: (product.stockQuantity ?? product.quantity) > 0 ? '#38a169' : '#e53e3e', marginBottom: 8 }}>
                    {(product.stockQuantity ?? product.quantity) > 0 ? `✓ In Stock (${product.stockQuantity ?? product.quantity})` : '✗ Out of Stock'}
                </div>

                <div style={{ fontSize: 20, fontWeight: 900, color: '#4a2d8f', marginBottom: 12 }}>
                    ${product.price?.toFixed(2)}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleAddToCart} style={{
                        flex: 1,
                        background: added ? '#38a169' : '#4a2d8f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 0',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: 13,
                        transition: 'background 0.2s',
                    }}>
                        {added ? '✓ Added!' : '+ Cart'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`); }} style={{
                        flex: 1,
                        background: '#fff',
                        color: '#4a2d8f',
                        border: '2px solid #4a2d8f',
                        borderRadius: 8,
                        padding: '8px 0',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: 13,
                    }}>
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}