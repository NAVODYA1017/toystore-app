import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategoryById } from './categoryService';
import { useNavigate, useParams } from 'react-router-dom';

function CategoryForm() {
    const [category, setCategory] = useState({ name: '', description: '' });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    useEffect(() => {
        if (isEditing) {
            getCategoryById(id).then((res) => setCategory(res.data));
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateCategory(id, category);
        } else {
            await createCategory(category);
        }
        navigate('/categories');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label><br />
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        required
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Description:</label><br />
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                        required
                        style={{ padding: '8px', width: '300px', height: '80px' }}
                    />
                </div>
                <button type="submit"
                        style={{ padding: '8px 20px', cursor: 'pointer', marginRight: '10px' }}>
                    {isEditing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => navigate('/categories')}
                        style={{ padding: '8px 20px', cursor: 'pointer' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CategoryForm;