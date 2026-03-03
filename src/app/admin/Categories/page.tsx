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
  const [error, setError] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cat-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .cat-page {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          padding: 48px 56px;
          color: #111;
        }

        /* ── Header ── */
        .cat-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e8e8e8;
        }

        .cat-header-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .cat-title {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          font-weight: 400;
          color: #0d0d0d;
          line-height: 1.1;
        }

        .cat-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 13px;
          color: #6b7280;
          font-weight: 400;
        }

        .cat-count-badge span {
          display: inline-block;
          background: #f3f4f6;
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        /* ── Add Button ── */
        .cat-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: #0d0d0d;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .cat-add-btn:hover {
          background: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        .cat-add-btn:active {
          transform: translateY(0);
        }

        .cat-add-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
        }

        /* ── Table ── */
        .cat-table-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #ebebeb;
          overflow: hidden;
          box-shadow: 0 2px 20px rgba(0,0,0,0.04);
        }

        .cat-table {
          width: 100%;
          border-collapse: collapse;
        }

        .cat-table thead tr {
          background: #fafafa;
          border-bottom: 1px solid #ebebeb;
        }

        .cat-table th {
          padding: 14px 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          text-align: left;
        }

        .cat-table th:last-child {
          text-align: right;
        }

        .cat-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.15s ease;
          vertical-align: middle;
        }

        .cat-table tbody tr:last-child td {
          border-bottom: none;
        }

        .cat-table tbody tr {
          transition: background 0.15s ease;
        }

        .cat-table tbody tr.row-hovered {
          background: #fafafa;
        }

        /* Category name cell */
        .cat-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .row-hovered .cat-dot {
          background: #0d0d0d;
        }

        .cat-name-text {
          font-weight: 500;
          color: #111827;
          font-size: 14.5px;
        }

        /* Action column */
        .cat-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .cat-btn-edit,
        .cat-btn-delete {
          padding: 7px 16px;
          border: none;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
        }

        .cat-btn-edit {
          background: #f0f4ff;
          color: #2563eb;
        }

        .cat-btn-edit:hover {
          background: #2563eb;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(37,99,235,0.25);
        }

        .cat-btn-delete {
          background: #fff1f1;
          color: #dc2626;
        }

        .cat-btn-delete:hover {
          background: #dc2626;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(220,38,38,0.22);
        }

        /* ── States ── */
        .cat-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          gap: 12px;
          text-align: center;
        }

        .cat-state-icon {
          font-size: 32px;
          opacity: 0.3;
        }

        .cat-state-text {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 400;
        }

        .cat-error-text {
          color: #ef4444;
        }

        /* ── Skeleton loader ── */
        .cat-skeleton-row td {
          padding: 18px 20px;
        }

        .skeleton-bar {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        .skeleton-bar.short { width: 40%; }
        .skeleton-bar.medium { width: 60%; }
        .skeleton-bar.btn {
          width: 56px;
          height: 28px;
          display: inline-block;
          border-radius: 6px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="cat-page">
        {/* ── Header ── */}
        <div className="cat-header">
          <div className="cat-header-left">
            <p className="cat-eyebrow">Admin Panel</p>
            <h1 className="cat-title">Categories</h1>
            {!loading && !error && (
              <p className="cat-count-badge">
                <span>{categories.length}</span>
                {categories.length === 1 ? "category" : "categories"} total
              </p>
            )}
          </div>

          <button className="cat-add-btn">
            <span className="cat-add-icon">+</span>
            Add Category
          </button>
        </div>

        {/* ── Table Card ── */}
        <div className="cat-table-card">
          <table className="cat-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Loading state */}
              {loading &&
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="cat-skeleton-row">
                    <td>
                      <div className="skeleton-bar medium" style={{ animationDelay: `${i * 0.1}s` }} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <div className="skeleton-bar btn" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
                        <div className="skeleton-bar btn" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Error state */}
              {!loading && error && (
                <tr>
                  <td colSpan={2}>
                    <div className="cat-state">
                      <span className="cat-state-icon">⚠</span>
                      <p className="cat-state-text cat-error-text">{error}</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!loading && !error && categories.length === 0 && (
                <tr>
                  <td colSpan={2}>
                    <div className="cat-state">
                      <span className="cat-state-icon">◻</span>
                      <p className="cat-state-text">No categories yet. Add one to get started.</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                !error &&
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className={hoveredRow === category.id ? "row-hovered" : ""}
                    onMouseEnter={() => setHoveredRow(category.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td>
                      <div className="cat-name-cell">
                        <span className="cat-dot" />
                        <span className="cat-name-text">{category.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cat-actions">
                        <button className="cat-btn-edit">Edit</button>
                        <button className="cat-btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}