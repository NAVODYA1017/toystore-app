// src/components/category/CategoryList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../../services/categoryService";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteCategory(id);
            setCategories(categories.filter((c) => (c.id || c._id) !== id));
        } catch (err) {
            alert("Failed to delete category: " + err.message);
        }
    };

    if (loading) return <p style={styles.info}>Loading categories...</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>🏷️ Categories</h2>
                <button style={styles.addBtn} onClick={() => navigate("/admin/categories/new")}>
                    + Add Category
                </button>
            </div>

            {categories.length === 0 ? (
                <p style={styles.info}>No categories found. Add one!</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHead}>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Icon</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((cat) => {
                        const catId = cat.id || cat._id;
                        return (
                            <tr key={catId} style={styles.tr}>
                                <td style={styles.td}>{cat.name}</td>
                                <td style={styles.td}>{cat.description || "—"}</td>
                                <td style={styles.td}>
                                    <div style={{ fontSize: 28 }}>{cat.imageUrl || "📦"}</div>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.editBtn}
                                        onClick={() => navigate(`/admin/categories/edit/${catId}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => handleDelete(catId, cat.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "30px", maxWidth: "900px", margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", fontWeight: "bold" },
    addBtn: {
        backgroundColor: "#333", color: "#fff", border: "none",
        padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
    },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHead: { backgroundColor: "#f0f0f0" },
    th: { padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #ddd" },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: "12px 16px", verticalAlign: "middle" },
    editBtn: {
        backgroundColor: "#4a90e2", color: "#fff", border: "none",
        padding: "6px 14px", borderRadius: "4px", cursor: "pointer",
        marginRight: "8px", fontSize: "13px"
    },
    deleteBtn: {
        backgroundColor: "#e74c3c", color: "#fff", border: "none",
        padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "13px"
    },
    link: { color: "#4a90e2" },
    info: { color: "#666", marginTop: "20px" },
    error: { color: "red", marginTop: "20px" },
};

export default CategoryList;
