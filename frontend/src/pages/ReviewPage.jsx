import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import ReviewSection from '../components/client/ReviewSection';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
  .rp-root { min-height: 100vh; background: #faf9f7; font-family: 'DM Sans', sans-serif; padding-bottom: 3rem; }
  .rp-header { background: linear-gradient(135deg, #1a0533, #2d1052); padding: 1.5rem 2rem; display: flex; align-items: center; }
  .rp-back { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0.5rem 1.2rem; border-radius: 100px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-family: 'DM Sans'; transition: 0.2s; }
  .rp-back:hover { background: rgba(255,255,255,0.2); }
  .rp-container { max-width: 860px; margin: 2rem auto 0; padding: 0 1.5rem; }
  .rp-product { background: #fff; border-radius: 20px; padding: 1.5rem; display: flex; gap: 1.5rem; align-items: center; box-shadow: 0 4px 20px rgba(124,58,237,0.08); margin-bottom: 2rem; border: 1px solid #ede9fe; }
  .rp-img { width: 100px; height: 100px; border-radius: 12px; object-fit: cover; background: #f3e8ff; display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
  .rp-info { flex: 1; }
  .rp-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem; color: #1a0533; }
  .rp-price { font-weight: 700; color: #7c3aed; font-size: 1.1rem; }
`;

export default function ReviewPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        getProductById(productId)
            .then(data => setProduct(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#7c3aed' }}>Loading...</div>;

    if (!product) return (
        <div style={{ padding: 48, textAlign: 'center' }}>
            <h2 style={{ color: '#dc2626' }}>Product not found</h2>
            <button onClick={() => navigate('/orders')} style={{ marginTop: 12, padding: '10px 20px', cursor: 'pointer' }}>Back to Orders</button>
        </div>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="rp-root animate-fade-in">
                <div className="rp-header">
                    <button className="rp-back" onClick={() => navigate('/orders')}>
                        ← Back to Orders
                    </button>
                </div>

                <div className="rp-container">
                    <div className="rp-product">
                        <div className="rp-img">
                            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{width: '100%', height: '100%', borderRadius: 12, objectFit: 'cover'}}/> : '🧸'}
                        </div>
                        <div className="rp-info">
                            <h1 className="rp-title">{product.name}</h1>
                            <div className="rp-price">LKR {product.price?.toFixed(2)}</div>
                        </div>
                    </div>

                    <ReviewSection productId={productId} productName={product.name} />
                </div>
            </div>
        </>
    );
}
