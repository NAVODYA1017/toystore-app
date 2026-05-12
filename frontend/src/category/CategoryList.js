import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from './categoryService';
import { useNavigate } from 'react-router-dom';

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await getAllCategories();
        setCategories(response.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Categories</h2>
            <button onClick={() => navigate('/categories/new')}
                    style={{ marginBottom: '15px', padding: '8px 16px', cursor: 'pointer' }}>
                + Add New Category
            </button>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f0f0f0' }}>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td>{cat.description}</td>
                        <td>
                            <button onClick={() => navigate(`/categories/edit/${cat.id}`)}
                                    style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer' }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(cat.id)}
                                    style={{ padding: '5px 10px', cursor: 'pointer', color: 'red' }}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryList;