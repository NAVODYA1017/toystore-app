import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [sortBy, setSortBy]     = useState('default');
    const [filterCat, setFilterCat] = useState('All');
    const navigate = useNavigate();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
            setError(null);
        } catch {
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(products.map(p => p.categoryId).filter(Boolean))];

    const displayed = products
        .filter(p => filterCat === 'All' || p.categoryId === filterCat)
        .sort((a, b) => {
            if (sortBy === 'price-asc')  return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name')       return a.name.localeCompare(b.name);
            return 0;
        });

    if (loading) return (
        <div style={{ textAlign:'center', padding:'4rem', color:'#7c3aed' }}>
            <div style={{ fontSize:'2.5rem', animation:'float 1.5s ease-in-out infinite', marginBottom:'0.8rem' }}>🌈</div>
            <p style={{ fontSize:'1rem', fontWeight:'600', color:'#6b7280' }}>Loading toys...</p>
        </div>
    );

    if (error) return (
        <div style={{
            maxWidth:'400px', margin:'3rem auto',
            background:'#fff0f0', border:'2px solid #fca5a5',
            borderRadius:'12px', padding:'1.5rem',
            textAlign:'center', color:'#dc2626', fontWeight:'600',
        }}>
            ⚠️ {error}
        </div>
    );

    return (
        <div style={{ background:'#f5f3ff', minHeight:'100vh' }}>

            {/* ── Header ── */}
            <div style={{
                background:'linear-gradient(135deg,#ff6b6b 0%,#feca57 50%,#48dbfb 100%)',
                backgroundSize:'200%',
                animation:'gradientMove 6s ease infinite',
                padding:'1.5rem',              // ← compact
                textAlign:'center',
            }}>
                <h1 style={{
                    color:'white', fontSize:'1.4rem', fontWeight:'800',
                    textShadow:'0 2px 8px rgba(0,0,0,0.18)', marginBottom:'0.2rem',
                }}>
                    All Toys Collection
                </h1>
                <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'0.85rem' }}>
                    {displayed.length} products available
                </p>
            </div>

            <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.2rem 1.5rem' }}>

                {/* ── Filter Bar ── */}
                <div style={{
                    background:'white',
                    borderRadius:'12px',
                    padding:'0.8rem 1rem',
                    marginBottom:'1.2rem',
                    boxShadow:'0 1px 8px rgba(0,0,0,0.07)',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.6rem',
                    flexWrap:'wrap',
                    justifyContent:'space-between',
                }}>
                    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCat(cat)}
                                style={{
                                    padding:'0.35rem 0.9rem',
                                    borderRadius:'20px',
                                    border:'1.5px solid',
                                    borderColor: filterCat===cat ? '#7c3aed' : '#e5e7eb',
                                    background:  filterCat===cat
                                        ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                                        : 'white',
                                    color:  filterCat===cat ? 'white' : '#6b7280',
                                    fontWeight:'600',
                                    fontSize:'0.78rem',
                                    cursor:'pointer',
                                    transition:'all 0.2s',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding:'0.4rem 0.9rem',
                            borderRadius:'8px',
                            border:'1.5px solid #e5e7eb',
                            fontSize:'0.82rem',
                            fontWeight:'600',
                            color:'#374151',
                            background:'white',
                            cursor:'pointer',
                        }}
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="name">Name: A–Z</option>
                    </select>
                </div>

                {/* ── Product Grid ── */}
                {displayed.length === 0 ? (
                    <div style={{
                        background:'white', borderRadius:'16px', padding:'3rem',
                        textAlign:'center', color:'#9ca3af',
                    }}>
                        <div style={{ fontSize:'3rem', marginBottom:'0.8rem' }}>🎪</div>
                        <p style={{ fontWeight:'600' }}>No products found.</p>
                    </div>
                ) : (
                    <div style={{
                        display:'grid',
                        gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',  // ← smaller cards
                        gap:'1rem',
                    }}>
                        {displayed.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product, index, onClick }) {
    const inStock = product.stockQuantity > 0;

    return (
        <div
            onClick={onClick}
            className="card-hover"
            style={{
                background:'white',
                borderRadius:'12px',
                overflow:'hidden',
                boxShadow:'0 2px 10px rgba(0,0,0,0.07)',
                cursor:'pointer',
                border:'1px solid #ede9fe',
                animation:`fadeInUp 0.4s ease ${index*0.04}s backwards`,
            }}
        >
            {/* Image */}
            <div style={{
                height:'160px',                  // ← compact image
                background: product.imageUrl
                    ? 'transparent'
                    : 'linear-gradient(135deg,#a855f7,#7c3aed)',
                overflow:'hidden',
                position:'relative',
                display:'flex', alignItems:'center', justifyContent:'center',
            }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
                        onMouseOver={(e) => { e.target.style.transform='scale(1.08)'; }}
                        onMouseOut={(e)  => { e.target.style.transform='scale(1)';    }}
                        onError={(e) => {
                            e.target.style.display='none';
                            e.target.parentNode.style.background='linear-gradient(135deg,#a855f7,#7c3aed)';
                        }}
                    />
                ) : (
                    <span style={{ fontSize:'4rem' }}>🧸</span>
                )}

                {/* Stock badge */}
                <span style={{
                    position:'absolute', top:'6px', left:'6px',
                    padding:'2px 7px',
                    borderRadius:'20px',
                    fontSize:'0.68rem', fontWeight:'700',
                    background: inStock ? '#dcfce7' : '#fee2e2',
                    color:       inStock ? '#15803d' : '#dc2626',
                }}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>

                {/* Category badge */}
                {product.categoryId && (
                    <span style={{
                        position:'absolute', top:'6px', right:'6px',
                        padding:'2px 7px',
                        borderRadius:'20px',
                        fontSize:'0.65rem', fontWeight:'700',
                        background:'rgba(255,255,255,0.92)',
                        color:'#7c3aed',
                    }}>
            {product.categoryId}
          </span>
                )}
            </div>

            {/* Info */}
            <div style={{ padding:'0.75rem' }}>
                <h3 style={{
                    fontSize:'0.85rem',
                    fontWeight:'700',
                    color:'#111827',
                    marginBottom:'0.25rem',
                    lineHeight:'1.35',
                    overflow:'hidden',
                    display:'-webkit-box',
                    WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical',
                }}>
                    {product.name}
                </h3>

                <p style={{
                    fontSize:'0.73rem',
                    color:'#9ca3af',
                    lineHeight:'1.4',
                    marginBottom:'0.6rem',
                    overflow:'hidden',
                    display:'-webkit-box',
                    WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical',
                }}>
                    {product.description}
                </p>

                <div style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    marginBottom:'0.6rem',
                }}>
          <span style={{
              fontSize:'1.1rem', fontWeight:'800', color:'#7c3aed',
          }}>
            ${product.price}
          </span>
                    <span style={{ fontSize:'0.7rem', color:'#9ca3af', fontWeight:'500' }}>
            Qty: {product.stockQuantity}
          </span>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    disabled={!inStock}
                    style={{
                        width:'100%',
                        padding:'0.55rem',
                        fontSize:'0.8rem',
                        fontWeight:'700',
                        color: inStock ? 'white' : '#9ca3af',
                        background: inStock
                            ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                            : '#f3f4f6',
                        border:'none',
                        borderRadius:'8px',
                        cursor: inStock ? 'pointer' : 'not-allowed',
                        transition:'all 0.2s ease',
                    }}
                    onMouseOver={(e) => { if (inStock) e.target.style.opacity='0.88'; }}
                    onMouseOut={(e)  => { e.target.style.opacity='1'; }}
                >
                    {inStock ? 'View Details' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}