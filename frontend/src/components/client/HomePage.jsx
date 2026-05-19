import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const spring = { type: 'spring', stiffness: 100, damping: 20 };

const HERO_SLIDES = [
    'https://i.pinimg.com/1200x/81/1d/7c/811d7cd8008dc5c242ba8ad7f79d93ef.jpg',
    'https://i.pinimg.com/736x/95/5b/1e/955b1e5501f0c17cb321af0de3320bf1.jpg',
    'https://i.pinimg.com/736x/3d/2b/d2/3d2bd24f995dd55de3cd94144660729c.jpg',
    'https://i.pinimg.com/736x/f4/08/71/f40871ea230cdf397dd84ea3d1745c05.jpg',
];

function HeroBackground() {
    const [index, setIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${HERO_SLIDES[index]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </AnimatePresence>

            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(102,126,234,0.92) 0%, rgba(118,75,162,0.88) 50%, rgba(102,126,234,0.92) 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 8s ease infinite',
            }} />

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)',
            }} />

            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
}

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const catRef = useRef(null);
    const prodRef = useRef(null);
    const catInView = useInView(catRef, { once: true, margin: '-60px' });
    const prodInView = useInView(prodRef, { once: true, margin: '-60px' });

    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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
        <div style={{ overflowX: 'hidden' }}>
            {/* ═══════ SHORT HERO (no emojis) ═══════ */}
            <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
                <div style={{
                    position: 'relative',
                    color: '#fff',
                    padding: '80px 24px 100px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    minHeight: '50vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <HeroBackground />

                    <div style={{
                        position: 'absolute', top: '10%', left: '5%',
                        width: 300, height: 300, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        animation: 'floatOrb 12s ease-in-out infinite',
                        filter: 'blur(60px)',
                        zIndex: 1,
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '15%', right: '8%',
                        width: 260, height: 260, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        animation: 'floatOrb 10s ease-in-out infinite reverse',
                        filter: 'blur(50px)',
                        zIndex: 1,
                    }} />

                    <style>{`
                        @keyframes floatOrb {
                            0%, 100% { transform: translate(0, 0); }
                            33% { transform: translate(30px, -30px); }
                            66% { transform: translate(-20px, 20px); }
                        }
                        @keyframes spinSlow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>

                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500, height: 500,
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                        animation: 'spinSlow 30s linear infinite',
                        zIndex: 1,
                    }} />

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(36px, 7vw, 64px)',
                            fontWeight: 900,
                            margin: '0 0 16px',
                            letterSpacing: '-2px',
                            textShadow: '0 4px 40px rgba(0,0,0,0.3)',
                            position: 'relative',
                            zIndex: 2,
                            maxWidth: 800,
                        }}
                    >
                        Welcome to Neverland
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, ...spring }}
                        style={{
                            fontSize: 'clamp(17px, 2.5vw, 22px)',
                            opacity: 0.95,
                            marginBottom: 32,
                            maxWidth: 560,
                            marginInline: 'auto',
                            lineHeight: 1.6,
                            position: 'relative',
                            zIndex: 2,
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        Discover amazing toys for kids of all ages!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, ...spring }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        style={{ position: 'relative', zIndex: 2, display: 'inline-block' }}
                    >
                        <Link to="/shop" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            background: '#fff',
                            color: '#4a2d8f',
                            padding: '16px 44px',
                            borderRadius: 50,
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: 18,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                        }}>
                            Shop Now
                            <motion.span
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        style={{
                            position: 'absolute',
                            bottom: 24,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            zIndex: 2,
                        }}
                    >
                        <span style={{ fontSize: 12, opacity: 0.7, fontWeight: 600 }}>Scroll</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                width: 22, height: 32,
                                border: '2px solid rgba(255,255,255,0.5)',
                                borderRadius: 11,
                                display: 'flex',
                                justifyContent: 'center',
                                paddingTop: 5,
                            }}
                        >
                            <motion.div
                                animate={{ opacity: [1, 0, 1], y: [0, 6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    width: 4, height: 4,
                                    background: '#fff',
                                    borderRadius: '50%',
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </div>

                <div style={{ position: 'relative', height: 80, overflow: 'hidden', marginTop: -1 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, width: '100%', height: 80 }}>
                        <motion.path
                            d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
                            fill="#fff"
                            animate={{
                                d: [
                                    "M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z",
                                    "M0,60 C300,0 600,120 900,60 C1050,30 1150,90 1200,60 L1200,120 L0,120 Z",
                                    "M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
                                ]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </svg>
                </div>
            </motion.div>

            {/* ═══════ CATEGORIES (emojis restored) ═══════ */}
            <div ref={catRef} style={{ padding: '40px 32px 64px' }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={catInView ? { opacity: 1, x: 0 } : {}}
                    transition={spring}
                    style={{ marginBottom: 28 }}
                >
                    <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1a1a2e', margin: 0 }}>
                        Shop by Category
                    </h2>
                    <div style={{
                        width: 60, height: 4,
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        borderRadius: 2, marginTop: 12
                    }} />
                </motion.div>

                {loadingCategories ? (
                    <div className="smooth-spinner" />
                ) : (
                    <motion.div
                        initial="hidden"
                        animate={catInView ? 'show' : 'hidden'}
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        style={{
                            display: 'flex',
                            gap: 16,
                            overflowX: 'auto',
                            paddingBottom: 16,
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#c4b5fd transparent'
                        }}
                    >
                        {categories.map((c, i) => (
                            <motion.div
                                key={c.id || c.name}
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                                    show: { opacity: 1, y: 0, scale: 1, transition: spring }
                                }}
                                whileHover={{ y: -8, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Link to={`/shop?category=${encodeURIComponent(c.name)}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    background: '#fff', border: '2px solid #f0e9ff',
                                    padding: '14px 24px', borderRadius: 18,
                                    textDecoration: 'none', color: '#4a2d8f',
                                    fontWeight: 800, fontSize: 15,
                                    boxShadow: '0 4px 20px rgba(102,126,234,0.1)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {/* Emoji with wiggle animation */}
                                    <motion.span
                                        style={{ fontSize: 26 }}
                                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: i * 0.5 }}
                                    >
                                        {c.imageUrl ? (
                                            (!c.imageUrl.includes('.') && !c.imageUrl.includes('/') && !c.imageUrl.startsWith('data:')) ? (
                                                c.imageUrl
                                            ) : (
                                                <img
                                                    src={c.imageUrl}
                                                    alt=""
                                                    style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover', display: 'block' }}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            )
                                        ) : '📦'}
                                    </motion.span>
                                    {c.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ═══════ FEATURED PRODUCTS ═══════ */}
            <div ref={prodRef} style={{ padding: '0 32px 100px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={prodInView ? { opacity: 1, y: 0 } : {}}
                    transition={spring}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}
                >
                    <div>
                        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1a1a2e', margin: 0 }}>
                            🔥 Featured Products
                        </h2>
                        <div style={{
                            width: 60, height: 4,
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            borderRadius: 2, marginTop: 12
                        }} />
                    </div>
                    <motion.div whileHover={{ x: 6 }} transition={spring}>
                        <Link to="/shop" style={{ color: '#4a2d8f', fontWeight: 800, textDecoration: 'none', fontSize: 15 }}>
                            View All →
                        </Link>
                    </motion.div>
                </motion.div>

                {loadingProducts ? (
                    <div className="smooth-spinner" />
                ) : (
                    <motion.div
                        initial="hidden"
                        animate={prodInView ? 'show' : 'hidden'}
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.12 } }
                        }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: 28,
                        }}
                    >
                        {products.map((p) => (
                            <ProductCard key={p._id || p.id} product={p} addToCart={addToCart} navigate={navigate} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product, addToCart, navigate }) {
    const [added, setAdded] = useState(false);
    const id = product._id || product.id;
    const inStock = (product.stockQuantity ?? product.quantity) > 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: spring }
            }}
            whileHover={{ y: -12, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            onClick={() => navigate(`/product/${id}`)}
            style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(102,126,234,0.12)',
                cursor: 'pointer',
                border: '1px solid #f5f3ff',
                position: 'relative',
            }}
        >
            <div style={{
                height: 240,
                background: 'linear-gradient(135deg, #f8f4ff 0%, #ede9fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <AnimatePresence mode="wait">
                    {product.imageUrl ? (
                        <motion.img
                            key="img"
                            src={product.imageUrl}
                            alt={product.name}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <motion.span
                            key="fallback"
                            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            style={{ fontSize: 72, filter: 'grayscale(0.2)' }}
                        >
                            🧸
                        </motion.span>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 0.25 }}
                    transition={{ duration: 0.7 }}
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{
                    fontSize: 12, color: '#8b7bb8', marginBottom: 8,
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                    {product.categoryId || product.category || 'Toy'}
                </div>

                <div style={{
                    fontWeight: 800, fontSize: 17, marginBottom: 12, color: '#1a1a2e',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                    {product.name}
                </div>

                <motion.div
                    animate={{ color: inStock ? '#38a169' : '#e53e3e' }}
                    style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <motion.span
                        animate={inStock ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                        {inStock ? '●' : '○'}
                    </motion.span>
                    {inStock ? `In Stock (${product.stockQuantity ?? product.quantity})` : 'Out of Stock'}
                </motion.div>

                <div style={{ fontSize: 24, fontWeight: 900, color: '#4a2d8f', marginBottom: 16 }}>
                    ${product.price?.toFixed(2)}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <motion.button
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            flex: 1,
                            background: added ? '#38a169' : '#4a2d8f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 14,
                            padding: '12px 0',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: 14,
                            boxShadow: added
                                ? '0 4px 15px rgba(56,161,105,0.4)'
                                : '0 4px 15px rgba(74,45,143,0.3)',
                            transition: 'background 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={added ? 'added' : 'add'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{ display: 'inline-block' }}
                            >
                                {added ? '✓ Added!' : '+ Cart'}
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>

                    <motion.button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`); }}
                        whileHover={{ scale: 1.04, background: '#f5f3ff' }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            flex: 1,
                            background: '#fff',
                            color: '#4a2d8f',
                            border: '2px solid #e9e3ff',
                            borderRadius: 14,
                            padding: '12px 0',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: 14,
                        }}
                    >
                        View
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}