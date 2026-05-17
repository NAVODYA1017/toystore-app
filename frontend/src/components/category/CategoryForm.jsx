// src/components/category/CategoryForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCategory, updateCategory, getCategoryById } from "../../services/categoryService";

const CategoryForm = () => {
    const { id } = useParams(); // if id exists → edit mode
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        description: "",
        imageUrl: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // If edit mode, load existing data
    useEffect(() => {
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const data = await getCategoryById(id);
                    setForm({
                        name: data.name || "",
                        description: data.description || "",
                        imageUrl: data.imageUrl || "",
                    });
                } catch (err) {
                    setError("Failed to load category data.");
                }
            };
            fetchData();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccessMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Category name is required.");
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await updateCategory(id, form);
                setSuccessMsg("Category updated successfully!");
            } else {
                await createCategory(form);
                setSuccessMsg("Category created successfully!");
                setForm({ name: "", description: "", imageUrl: "" });
            }
            setTimeout(() => navigate("/admin/categories"), 1000);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>
                {isEditMode ? "✏️ Edit Category" : "➕ Add New Category"}
            </h2>

            {error && <p style={styles.error}>{error}</p>}
            {successMsg && <p style={styles.success}>{successMsg}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label style={styles.label}>Category Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Action Figures"
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description of this category..."
                        style={{ ...styles.input, height: "90px", resize: "vertical" }}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Select Category Icon</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                        {['🚗', '🧩', '🎮', '🪆', '🎯', '🤖', '🧸', '🚂', '👶', '⚡', '🚀', '🎨', '📚', '🌟', '3️⃣', '🔟', '🏎️'].map(icon => (
                            <div 
                                key={icon}
                                onClick={() => setForm({ ...form, imageUrl: icon })}
                                style={{
                                    fontSize: 28, cursor: 'pointer', padding: 8,
                                    borderRadius: 8, background: form.imageUrl === icon ? '#e0d4fc' : '#f8f9fa',
                                    border: form.imageUrl === icon ? '2px solid #7c3aed' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>

                {form.imageUrl && (
                    <div style={styles.preview}>
                        <p style={styles.previewLabel}>Selected Icon:</p>
                        <div style={{ fontSize: 48 }}>{form.imageUrl}</div>
                    </div>
                )}

                <div style={styles.btnRow}>
                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
                    </button>
                    <button
                        type="button"
                        style={styles.cancelBtn}
                        onClick={() => navigate("/admin/categories")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { padding: "30px", maxWidth: "560px", margin: "0 auto" },
    title: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    field: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "14px", fontWeight: "600", color: "#333" },
    input: {
        padding: "10px 14px", borderRadius: "6px",
        border: "1px solid #ccc", fontSize: "14px",
        outline: "none", width: "100%", boxSizing: "border-box"
    },
    btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
    submitBtn: {
        backgroundColor: "#333", color: "#fff", border: "none",
        padding: "11px 24px", borderRadius: "6px",
        cursor: "pointer", fontSize: "14px", fontWeight: "600"
    },
    cancelBtn: {
        backgroundColor: "#eee", color: "#333", border: "none",
        padding: "11px 24px", borderRadius: "6px",
        cursor: "pointer", fontSize: "14px"
    },
    preview: { marginTop: "4px" },
    previewLabel: { fontSize: "13px", color: "#666", marginBottom: "6px" },
    previewImg: { width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" },
    error: { color: "#e74c3c", backgroundColor: "#fdf0ef", padding: "10px", borderRadius: "6px" },
    success: { color: "#27ae60", backgroundColor: "#eafaf1", padding: "10px", borderRadius: "6px" },
};

export default CategoryForm;