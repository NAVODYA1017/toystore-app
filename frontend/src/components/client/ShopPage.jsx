import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Read category from URL query string
        const searchParams = new URLSearchParams(location.search);
        const urlCat = searchParams.get('category');
        if (urlCat) setSelectedCategory(urlCat);

        getAllProducts().then(data => {
            setProducts(data);
            setFiltered(data);
            const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
            // If the requested category isn't in our dynamic list yet, we can still filter by it
            if (urlCat && !cats.includes(urlCat)) cats.push(urlCat);
            setCategories(cats);
            setLoading(false);
        });
    }, [location.search]);

    useEffect(() => {
        let result = [...products];

        if (selectedCategory !== 'ALL')
            result = result.filter(p => p.category === selectedCategory);

        if (search)
            result = result.filter(p =>
                p.name?.toLowerCase().includes(search.toLowerCase())
            );

        if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'name')       result.sort((a, b) => a.name?.localeCompare(b.name));

        setFiltered(result);
    }, [selectedCategory, search, sortBy, products]);

    return (
        <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>

            {/* Header */}
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#2d2d2d', marginBottom: 8 }}>🧸 Shop</h1>
            <p style={{ color: '#888', marginBottom: 32 }}>{filtered.length} products found</p>

            {/* Filters Bar */}
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
            }}>
                {/* Search */}
                <input
                    placeholder="🔍 Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: 200,
                        padding: '10px 16px',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        fontSize: 14,
                        outline: 'none',
                    }}
                />

                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    fontSize: 14,
                    background: '#fff',
                    cursor: 'pointer',
                }}>
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>

                {/* Sidebar — Categories */}
                <div style={{
                    width: 200,
                    flexShrink: 0,
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        position: 'sticky',
                        top: 80,
                    }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#2d2d2d' }}>
                            Categories
                        </h3>
                        {['ALL', ...categories].map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 12px',
                                marginBottom: 4,
                                borderRadius: 8,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: selectedCategory === cat ? 700 : 400,
                                background: selectedCategory === cat ? '#f0ebff' : 'transparent',
                                color: selectedCategory === cat ? '#4a2d8f' : '#555',
                                fontSize: 14,
                            }}>
                                {cat === 'ALL' ? '🏷️ All Products' : `• ${cat}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div style={{ flex: 1 }}>
                    {loading ? (
                        <div style={{ marginTop: 60 }}><div className="smooth-spinner" /></div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                            No products found.
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 24,
                        }}>
                            {filtered.map(p => (
                                <ShopProductCard
                                    key={p._id || p.id}
                                    product={p}
                                    addToCart={addToCart}
                                    navigate={navigate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ShopProductCard({ product, addToCart, navigate }) {
    const [added, setAdded] = useState(false);
    const id = product._id || product.id;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

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
            {/* Image */}
            <div style={{
                height: 200,
                background: '#f8f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: 64 }}>🧸</span>
                )}
                {(product.stockQuantity ?? product.quantity) === 0 && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 16,
                    }}>Out of Stock</div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: '#9f7aea', fontWeight: 600, marginBottom: 4 }}>
                    {product.category || 'Toy'}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#2d2d2d', marginBottom: 4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                </div>
                <div style={{ fontSize: 12, color: (product.stockQuantity ?? product.quantity) > 0 ? '#38a169' : '#e53e3e', marginBottom: 10 }}>
                    {(product.stockQuantity ?? product.quantity) > 0 ? `✓ ${product.stockQuantity ?? product.quantity} in stock` : '✗ Out of stock'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#4a2d8f', marginBottom: 12 }}>
                    ${product.price?.toFixed(2)}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleAddToCart}
                            disabled={(product.stockQuantity ?? product.quantity) === 0}
                            style={{
                                flex: 1,
                                background: (product.stockQuantity ?? product.quantity) === 0 ? '#ccc' : added ? '#38a169' : '#4a2d8f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '9px 0',
                                fontWeight: 700,
                                cursor: (product.stockQuantity ?? product.quantity) === 0 ? 'not-allowed' : 'pointer',
                                fontSize: 13,
                            }}>
                        {added ? '✓ Added!' : '+ Cart'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${id}`); }} style={{
                        flex: 1,
                        background: '#fff',
                        color: '#4a2d8f',
                        border: '2px solid #4a2d8f',
                        borderRadius: 8,
                        padding: '9px 0',
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