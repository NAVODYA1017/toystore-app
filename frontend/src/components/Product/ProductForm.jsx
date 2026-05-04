import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../services/productService';

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        categoryId: '',
    });

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProduct(id, formData);
            } else {
                await createProduct(formData);
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div>
            <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Category ID</label>
                    <input
                        type="text"
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">{isEditing ? 'Update Product' : 'Create Product'}</button>
                <button type="button" onClick={() => navigate('/products')}>Cancel</button>
            </form>
        </div>
    );
}

export default ProductForm;