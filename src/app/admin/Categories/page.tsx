"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const [toast, setToast] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
    setEditName("");
  };

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleUpdate = async () => {
    if (!editName.trim() || editId === null) return;

    try {
      await api.updateCategory({
        id: editId,
        name: editName,
      });

      closeEdit();
      fetchCategories();

      showToast("Category updated successfully");
    } catch (err: any) {
      showToast(err.message || "Update failed");
    }
  };

  return (
    <>
      <style>{`
      .cat-page{
        font-family:'DM Sans',sans-serif;
        background:#ffffff;
        min-height:100vh;
        padding:48px 56px;
        color:#111;
      }

      .cat-header{
        display:flex;
        justify-content:space-between;
        margin-bottom:40px;
      }

      .cat-title{
        font-size:34px;
        font-weight:600;
      }

      .cat-table-card{
        border:1px solid #eee;
        border-radius:12px;
        overflow:hidden;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      th,td{
        padding:16px 20px;
        text-align:left;
      }

      th:last-child,
      td:last-child{
        text-align:right;
      }

      tr{
        border-bottom:1px solid #f2f2f2;
        transition:background .2s;
      }

      tr:hover{
        background:#fafafa;
      }

      .cat-actions{
        display:flex;
        gap:10px;
        justify-content:flex-end;
      }

      .cat-btn-edit{
        background:#eef2ff;
        color:#4338ca;
        border:none;
        padding:6px 14px;
        border-radius:6px;
        cursor:pointer;
      }

      .cat-btn-delete{
        background:#fff1f1;
        color:#dc2626;
        border:none;
        padding:6px 14px;
        border-radius:6px;
        cursor:pointer;
      }

      /* STATUS */

      .cat-status{
        font-size:12px;
        padding:4px 10px;
        border-radius:20px;
        font-weight:500;
      }

      .status-active{
        background:#ecfdf5;
        color:#059669;
      }

      .status-inactive{
        background:#fee2e2;
        color:#dc2626;
      }

      .cat-inactive{
        background:#fff5f5;
      }

      .cat-inactive td{
        color:#dc2626;
      }

      /* POPUP */

      .popup-overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.35);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1000;
      }

      .popup{
        background:white;
        padding:30px;
        border-radius:12px;
        width:340px;
        box-shadow:0 10px 30px rgba(0,0,0,0.15);
      }

      .popup h3{
        margin-bottom:15px;
      }

      .popup input{
        width:100%;
        padding:10px;
        border:1px solid #ddd;
        border-radius:6px;
        margin-bottom:18px;
      }

      .popup-actions{
        display:flex;
        justify-content:flex-end;
        gap:10px;
      }

      .btn-cancel{
        background:#eee;
        border:none;
        padding:8px 16px;
        border-radius:6px;
        cursor:pointer;
      }

      .btn-save{
        background:#111;
        color:white;
        border:none;
        padding:8px 16px;
        border-radius:6px;
        cursor:pointer;
      }

      /* TOAST */

      .toast{
        position:fixed;
        bottom:30px;
        right:30px;
        background:#111;
        color:white;
        padding:14px 22px;
        border-radius:8px;
        font-size:14px;
        box-shadow:0 10px 25px rgba(0,0,0,0.2);
        animation:toastIn .35s ease;
      }

      @keyframes toastIn{
        from{
          opacity:0;
          transform:translateY(20px);
        }
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      `}</style>

      <div className="cat-page">
        <div className="cat-header">
          <h1 className="cat-title">Categories</h1>
        </div>

        <div className="cat-table-card">
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className={!cat.isActive ? "cat-inactive" : ""}
                  >
                    <td>{cat.name}</td>

                    <td>
                      <span
                        className={`cat-status ${
                          cat.isActive
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="cat-actions">
                        <button
                          className="cat-btn-edit"
                          onClick={() => openEdit(cat)}
                        >
                          Edit
                        </button>

                        <button className="cat-btn-delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Edit Category</h3>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="popup-actions">
              <button className="btn-cancel" onClick={closeEdit}>
                Cancel
              </button>

              <button className="btn-save" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}