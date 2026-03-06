"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await api.getAdminCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditPopup = (category: Category) => {
    setEditCategory(category);
    setEditName(category.name);
  };

  const closePopup = () => {
    setEditCategory(null);
  };

  const handleUpdate = async () => {
    if (!editCategory) return;

    try {
      await api.updateCategory({
        id: editCategory.id,
        name: editName,
      });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === editCategory.id ? { ...c, name: editName } : c
        )
      );

      closePopup();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <div style={{ padding: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>Categories</h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 10 }}>
                  Category Name
                </th>
                <th style={{ textAlign: "right", padding: 10 }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ padding: 10 }}>{cat.name}</td>

                  <td style={{ textAlign: "right", padding: 10 }}>
                    <button
                      onClick={() => openEditPopup(cat)}
                      style={{
                        marginRight: 10,
                        padding: "6px 12px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        padding: "6px 12px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* POPUP EDIT CATEGORY */}
      {editCategory && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: 20 }}>Edit Category</h2>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={inputStyle}
            />

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button onClick={closePopup} style={cancelBtn}>
                Cancel
              </button>

              <button onClick={handleUpdate} style={saveBtn}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 30,
  borderRadius: 10,
  width: 400,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const cancelBtn: React.CSSProperties = {
  marginRight: 10,
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  background: "#9ca3af",
  color: "white",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};