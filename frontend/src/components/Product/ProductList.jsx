import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../services/productService';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const navigate = useNavigate();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch {
            alert('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Delete "${name}"?`)) {
            try { await deleteProduct(id); fetchProducts(); }
            catch { alert('Failed to delete.'); }
        }
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryId?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div style={{ textAlign:'center', padding:'4rem', color:'#7c3aed' }}>
            <div style={{ fontSize:'2rem', animation:'float 1.5s ease-in-out infinite', marginBottom:'0.6rem' }}>⏳</div>
            <p style={{ fontWeight:'600', color:'#6b7280', fontSize:'0.95rem' }}>Loading...</p>
        </div>
    );

    return (
        <div style={{ background:'#f5f3ff', minHeight:'100vh' }}>

            {/* Header */}
            <div style={{
                background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)',
                padding:'1.5rem',
            }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                    <h1 style={{ color:'white', fontSize:'1.4rem', fontWeight:'800', marginBottom:'0.2rem' }}>
                        Product Management
                    </h1>
                    <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem' }}>
                        {products.length} total products
                    </p>
                </div>
            </div>

            <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.2rem 1.5rem' }}>

                {/* Toolbar */}
                <div style={{
                    display:'flex', gap:'0.8rem', marginBottom:'1.2rem',
                    alignItems:'center', flexWrap:'wrap', justifyContent:'space-between',
                }}>
                    <div style={{ position:'relative', flex:1, minWidth:'200px', maxWidth:'340px' }}>
            <span style={{
                position:'absolute', left:'10px', top:'50%',
                transform:'translateY(-50%)',
                fontSize:'0.9rem', color:'#9ca3af', pointerEvents:'none',
            }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width:'100%',
                                padding:'0.6rem 0.9rem 0.6rem 2.2rem',
                                borderRadius:'10px',
                                border:'1.5px solid #e5e7eb',
                                fontSize:'0.88rem',
                                background:'white',
                                color:'#111827',
                                outline:'none',
                            }}
                            onFocus={(e) => e.target.style.borderColor='#7c3aed'}
                            onBlur={(e)  => e.target.style.borderColor='#e5e7eb'}
                        />
                    </div>

                    <button
                        onClick={() => navigate('/admin/products/new')}
                        style={{
                            padding:'0.65rem 1.4rem',
                            fontSize:'0.88rem', fontWeight:'700',
                            color:'white',
                            background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                            border:'none', borderRadius:'10px', cursor:'pointer',
                            boxShadow:'0 3px 12px rgba(124,58,237,0.35)',
                            transition:'all 0.2s ease',
                            whiteSpace:'nowrap',
                        }}
                        onMouseOver={(e) => { e.target.style.transform='translateY(-2px)'; }}
                        onMouseOut={(e)  => { e.target.style.transform='translateY(0)';    }}
                    >
                        + Add Product
                    </button>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{
                        background:'white', borderRadius:'14px', padding:'3rem',
                        textAlign:'center', color:'#9ca3af',
                    }}>
                        <div style={{ fontSize:'3rem', marginBottom:'0.8rem' }}>📦</div>
                        <p style={{ fontWeight:'600', fontSize:'0.95rem' }}>
                            {search ? 'No results found.' : 'No products yet.'}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display:'grid',
                        gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',
                        gap:'1rem',
                    }}>
                        {filtered.map((product, index) => (
                            <AdminCard
                                key={product.id}
                                product={product}
                                index={index}
                                onView={()   => navigate(`/product/${product.id}`)}
                                onEdit={()   => navigate(`/admin/products/edit/${product.id}`)}
                                onDelete={()  => handleDelete(product.id, product.name)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AdminCard({ product, index, onView, onEdit, onDelete }) {
    const inStock = product.stockQuantity > 0;

    return (
        <div
            className="card-hover"
            style={{
                background:'white',
                borderRadius:'12px',
                overflow:'hidden',
                boxShadow:'0 2px 10px rgba(0,0,0,0.07)',
                border:'1px solid #ede9fe',
                animation:`fadeInUp 0.4s ease ${index*0.04}s backwards`,
            }}
        >
            {/* Image */}
            <div style={{
                height:'140px',
                background: product.imageUrl
                    ? 'transparent'
                    : 'linear-gradient(135deg,#1e1b4b,#4c1d95)',
                display:'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden', position:'relative',
            }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onError={(e) => {
                            e.target.style.display='none';
                            e.target.parentNode.style.background='linear-gradient(135deg,#1e1b4b,#4c1d95)';
                        }}
                    />
                ) : (
                    <span style={{ fontSize:'3rem' }}>🧸</span>
                )}

                <span style={{
                    position:'absolute', top:'6px', right:'6px',
                    padding:'2px 7px', borderRadius:'20px',
                    fontSize:'0.65rem', fontWeight:'700',
                    background: inStock ? '#dcfce7' : '#fee2e2',
                    color:       inStock ? '#15803d' : '#dc2626',
                }}>
          {inStock ? 'In Stock' : 'Out'}
        </span>
            </div>

            {/* Info */}
            <div style={{ padding:'0.75rem' }}>
                <div style={{
                    display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', gap:'0.4rem', marginBottom:'0.3rem',
                }}>
                    <h3 style={{
                        fontSize:'0.85rem', fontWeight:'700',
                        color:'#111827', lineHeight:'1.3', flex:1,
                        overflow:'hidden', display:'-webkit-box',
                        WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                    }}>
                        {product.name}
                    </h3>
                </div>

                {product.categoryId && (
                    <span style={{
                        display:'inline-block',
                        fontSize:'0.65rem', fontWeight:'700',
                        padding:'2px 8px', borderRadius:'20px',
                        background:'#f3e8ff', color:'#7c3aed',
                        marginBottom:'0.5rem',
                    }}>
            {product.categoryId}
          </span>
                )}

                <div style={{
                    display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:'0.7rem',
                }}>
          <span style={{ fontSize:'1rem', fontWeight:'800', color:'#7c3aed' }}>
            ${product.price}
          </span>
                    <span style={{ fontSize:'0.72rem', color:'#6b7280', fontWeight:'500' }}>
            Qty: {product.stockQuantity}
          </span>
                </div>

                {/* Buttons */}
                <div style={{ display:'flex', gap:'0.4rem' }}>
                    {[
                        { label:'View',   fn: onView,   bg:'#10b981' },
                        { label:'Edit',   fn: onEdit,   bg:'#0ea5e9' },
                        { label:'Delete', fn: onDelete, bg:'#ef4444' },
                    ].map(btn => (
                        <button
                            key={btn.label}
                            onClick={btn.fn}
                            style={{
                                flex:1,
                                padding:'0.5rem 0.3rem',
                                fontSize:'0.72rem',
                                fontWeight:'700',
                                color:'white',
                                background:btn.bg,
                                border:'none',
                                borderRadius:'7px',
                                cursor:'pointer',
                                transition:'all 0.2s ease',
                            }}
                            onMouseOver={(e) => { e.target.style.opacity='0.85'; e.target.style.transform='scale(1.05)'; }}
                            onMouseOut={(e)  => { e.target.style.opacity='1';    e.target.style.transform='scale(1)';    }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}