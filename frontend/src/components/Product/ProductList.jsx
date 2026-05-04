import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p style={{ fontWeight: 700, color: '#888' }}>Loading toys...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">🎁 All Products</h1>
                <Link to="/products/new" className="btn btn-primary">
                    + Add New Product
                </Link>
            </div>

            <div className="rainbow-bar"></div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <div className="emoji">🧸</div>
                    <h2>No products yet!</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Start by adding your first toy to the store.</p>
                    <Link to="/products/new" className="btn btn-success">+ Add First Product</Link>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map((product, i) => (
                        <div
                            className="product-card"
                            key={product.id}
                            style={{ animationDelay: `${i * 0.07}s` }}
                        >
                            <div className="product-card-img">
                                {product.imageUrl
                                    ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : '🧸'}
                            </div>
                            <div className="product-card-body">
                                <div className="product-card-name">{product.name}</div>
                                <div className="product-card-desc">
                                    {product.description || 'No description available.'}
                                </div>
                                <div className="product-card-price">${product.price}</div>
                                <div className="product-card-actions">
                                    <Link to={`/products/${product.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                        👁 View
                                    </Link>
                                    <Link to={`/products/${product.id}/edit`} className="btn btn-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        className="btn btn-danger"
                                        style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;