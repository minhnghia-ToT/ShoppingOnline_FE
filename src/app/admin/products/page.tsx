"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";

interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  status: string;
  categoryId: number;
  categoryName: string;
  images: ProductImage[];
}

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getAdminProducts();
      setProducts(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || !selectedProductId) return;
    try {
      setUploading(true);
      await api.uploadProductImages(selectedProductId, selectedFiles);
      setSelectedProductId(null);
      setSelectedFiles(null);
      fetchProducts();
    } catch (error: any) {
      alert(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      await api.deleteProduct(deleteTargetId);
      setDeleteTargetId(null);
      fetchProducts();
    } catch (error: any) {
      alert(error.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={centerStyle}>
        <div style={loaderWrap}>
          <div style={loaderBar} />
        </div>
        <style>{css}</style>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{css}</style>

      {/* Header */}
      <div style={headerRow}>
        <div>
          <p style={eyebrow}>ADMIN MANAGEMENT</p>
          <h1 style={heading}>Products</h1>
        </div>
        <div style={countBadge}>{total}</div>
      </div>

      {/* Table */}
      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "",
                "Product Name",
                "Category",
                "Price",
                "Stock",
                "Status",
                "",
              ].map((col, i) => (
                <th
                  key={i}
                  style={{ ...thStyle, textAlign: i === 6 ? "right" : "left" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const mainImage = product.images.find((img) => img.isMain);
              const isHovered = hoveredRow === product.id;

              return (
                <tr
                  key={product.id}
                  style={{
                    ...trStyle,
                    background: isHovered ? "#fafafa" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ ...tdStyle, width: 64 }}>
                    <div style={imgWrap}>
                      {mainImage ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${mainImage.imageUrl}`}
                          style={imgStyle}
                          alt={product.name}
                        />
                      ) : (
                        <div style={imgPlaceholder}>—</div>
                      )}
                    </div>
                  </td>

                  <td style={{ ...tdStyle, maxWidth: 240 }}>
                    <span style={productName}>{product.name}</span>
                  </td>

                  <td style={tdStyle}>
                    <span style={categoryTag}>{product.categoryName}</span>
                  </td>

                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {product.discountPrice > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <span style={oldPrice}>
                          ${product.price.toLocaleString()}
                        </span>
                        <span style={salePrice}>
                          ${product.discountPrice.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span style={normalPrice}>
                        ${product.price.toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        ...stockNum,
                        color: product.stockQuantity < 10 ? "#e05a3a" : "#111",
                      }}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        ...statusPill,
                        background:
                          product.status === "Active" ? "#111" : "#f0f0f0",
                        color:
                          product.status === "Active" ? "#fff" : "#888",
                      }}
                    >
                      {product.status === "Active"
                        ? "Active"
                        : "Hidden"}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={actionGroup}>
                      <button
                        style={actionBtn}
                        onClick={() => setSelectedProductId(product.id)}
                        title="Upload images"
                        className="action-btn"
                      >
                        <UploadIcon />
                      </button>
                      <button
                        style={actionBtn}
                        onClick={() =>
                          router.push(`/admin/products/${product.id}`)
                        }
                        title="View details"
                        className="action-btn"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        style={actionBtn}
                        onClick={() =>
                          router.push(`/admin/products/${product.id}/edit`)
                        }
                        title="Edit product"
                        className="action-btn"
                      >
                        <EditIcon />
                      </button>
                      <button
                        style={{ ...actionBtn, color: "#e05a3a" }}
                        onClick={() => setDeleteTargetId(product.id)}
                        title="Delete product"
                        className="action-btn-danger"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {selectedProductId && (
        <div style={overlayStyle} onClick={() => setSelectedProductId(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <p style={modalLabel}>UPLOAD</p>
            <h2 style={modalTitle}>Select image files</h2>

            <label style={fileLabel} className="file-label">
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
              <UploadIcon />
              <span style={{ marginTop: 10, fontSize: 13, color: "#777" }}>
                {selectedFiles
                  ? `${selectedFiles.length} file(s) selected`
                  : "Click to choose images"}
              </span>
            </label>

            <div style={modalActions}>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFiles}
                style={{
                  ...modalPrimaryBtn,
                  opacity: !selectedFiles ? 0.4 : 1,
                  cursor: !selectedFiles ? "not-allowed" : "pointer",
                }}
                className="modal-btn-primary"
              >
                {uploading ? <span className="dot-loader" /> : "Upload"}
              </button>
              <button
                onClick={() => setSelectedProductId(null)}
                style={modalSecondaryBtn}
                className="modal-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTargetId && (
        <div style={overlayStyle} onClick={() => setDeleteTargetId(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <p style={modalLabel}>CONFIRMATION</p>
            <h2 style={modalTitle}>Delete this product?</h2>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 24, lineHeight: 1.6 }}>
              This action cannot be undone. The product will be permanently removed from the system.
            </p>
            <div style={modalActions}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ ...modalPrimaryBtn, background: "#e05a3a" }}
                className="modal-btn-danger"
              >
                {deleting ? <span className="dot-loader" /> : "Delete"}
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                style={modalSecondaryBtn}
                className="modal-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SVG Icons ── */
const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

/* ── Styles ── */
const pageStyle: React.CSSProperties = {
  padding: "48px 56px",
  minHeight: "100vh",
  background: "#fff",
  fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: 40,
  borderBottom: "1px solid #111",
  paddingBottom: 20,
};

const eyebrow: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "#bbb",
  marginBottom: 6,
  fontWeight: 600,
};

const heading: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  color: "#111",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  margin: 0,
};

const countBadge: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1.5px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 600,
  color: "#555",
};

const tableWrap: React.CSSProperties = { overflowX: "auto" };

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  padding: "0 12px 14px",
  fontSize: 10,
  letterSpacing: "0.14em",
  color: "#bbb",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  borderBottom: "1px solid #eee",
};

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #f4f4f4",
  transition: "background 0.12s ease",
};

const tdStyle: React.CSSProperties = {
  padding: "16px 12px",
  verticalAlign: "middle",
};

const imgWrap: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 8,
  overflow: "hidden",
  background: "#f6f6f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const imgPlaceholder: React.CSSProperties = {
  fontSize: 16,
  color: "#ccc",
};

const productName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#111",
  letterSpacing: "-0.01em",
};

const categoryTag: React.CSSProperties = {
  fontSize: 11,
  color: "#666",
  background: "#f4f4f4",
  padding: "4px 10px",
  borderRadius: 20,
  whiteSpace: "nowrap" as const,
};

const oldPrice: React.CSSProperties = {
  fontSize: 11,
  color: "#ccc",
  textDecoration: "line-through",
};

const salePrice: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#e05a3a",
};

const normalPrice: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#111",
};

const stockNum: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
};

const statusPill: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.04em",
};

const actionGroup: React.CSSProperties = {
  display: "flex",
  gap: 6,
  justifyContent: "flex-end",
};

const actionBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  border: "1px solid #e8e8e8",
  borderRadius: 8,
  background: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  backdropFilter: "blur(6px)",
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "36px 40px",
  width: 380,
  boxShadow: "0 32px 80px rgba(0,0,0,0.1)",
  animation: "modalIn 0.18s ease",
};

const modalLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.16em",
  color: "#bbb",
  fontWeight: 600,
  marginBottom: 6,
};

const modalTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#111",
  marginBottom: 24,
  letterSpacing: "-0.02em",
};

const fileLabel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  border: "1.5px dashed #e0e0e0",
  borderRadius: 12,
  padding: "28px 20px",
  cursor: "pointer",
  color: "#aaa",
  transition: "border-color 0.15s, color 0.15s",
};

const modalActions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 24,
};

const modalPrimaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "0.01em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalSecondaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: "#f5f5f5",
  color: "#555",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const centerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "60vh",
};

const loaderWrap: React.CSSProperties = {
  width: 100,
  height: 1.5,
  background: "#f0f0f0",
  borderRadius: 2,
  overflow: "hidden",
};

const loaderBar: React.CSSProperties = {
  height: "100%",
  background: "#111",
  borderRadius: 2,
  animation: "loadBar 1s ease-in-out infinite",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .action-btn-danger:hover {
    background: #e05a3a !important;
    border-color: #e05a3a !important;
    color: white !important;
  }

  .modal-btn-danger:hover:not(:disabled) {
    background: #c94d30 !important;
  }

  .action-btn:hover {
    background: #111 !important;
    border-color: #111 !important;
    color: white !important;
  }

  .file-label:hover {
    border-color: #111 !important;
    color: #111 !important;
  }

  .modal-btn-primary:hover:not(:disabled) {
    background: #333 !important;
  }

  .modal-btn-secondary:hover {
    background: #ebebeb !important;
  }

  .dot-loader {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes loadBar {
    0%   { width: 0%;   margin-left: 0; }
    50%  { width: 55%;  margin-left: 20%; }
    100% { width: 0%;   margin-left: 100%; }
  }

  @keyframes modalIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
`;