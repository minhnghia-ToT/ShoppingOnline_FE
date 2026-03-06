"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export default function AdminCategoryStatusPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await api.toggleCategoryStatus(id);

      setCategories((prev) =>
        prev.map((c) =>
          c.id === res.categoryId
            ? { ...c, isActive: res.isActive }
            : c
        )
      );

      showToast(
        res.isActive
          ? "Category activated"
          : "Category deactivated"
      );
    } catch {
      showToast("Toggle failed");
    }
  };

  return (
    <>
      <style>{`
      .cat-page{
        font-family:'DM Sans',sans-serif;
        background:#fff;
        min-height:100vh;
        padding:48px 56px;
        color:#111;
      }

      .cat-title{
        font-size:34px;
        font-weight:600;
        margin-bottom:40px;
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
      }

      tr:hover{
        background:#fafafa;
      }

      .status{
        font-size:13px;
        padding:4px 10px;
        border-radius:20px;
        font-weight:500;
      }

      .active{
        background:#ecfdf5;
        color:#059669;
      }

      .inactive{
        background:#fef2f2;
        color:#dc2626;
      }

      .btn-toggle{
        border:none;
        padding:6px 14px;
        border-radius:6px;
        cursor:pointer;
        background:#111;
        color:white;
        font-size:13px;
      }

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
        <h1 className="cat-title">Category Status</h1>

        <div className="cat-table-card">
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>

                    <td>
                      <span
                        className={`status ${
                          cat.isActive ? "active" : "inactive"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-toggle"
                        onClick={() => toggleStatus(cat.id)}
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}