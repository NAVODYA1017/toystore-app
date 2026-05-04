import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../../services/productService';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            navigate('/products');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p style={{ fontWeight: 700, color: '#888' }}>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page">
                <div className="empty-state">
                    <div className="emoji">❓</div>
                    <h2>Product not found</h2>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div style={{ marginBottom: '1.2rem' }}>
                <Link to="/products" className="btn btn-ghost">← Back to Products</Link>
            </div>

            <div className="detail-card">
                <div className="detail-hero">
                    {product.imageUrl
                        ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '🧸'}
                </div>

                <div className="detail-body">
                    <div className="detail-name">{product.name}</div>
                    <div className="detail-price">${product.price}</div>

                    <div className="detail-meta">
                        <span className="meta-badge">📦 Stock: {product.stockQuantity ?? 'N/A'}</span>
                        <span className="meta-badge">🏷️ Category: {product.categoryId ?? 'N/A'}</span>
                        <span className="meta-badge">📅 {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="rainbow-bar"></div>

                    <p className="detail-desc">
                        {product.description || 'No description available for this product.'}
                    </p>

                    <div className="detail-actions">
                        <Link to={`/products/${id}/edit`} className="btn btn-warning">✏️ Edit Product</Link>
                        <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete Product</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;