"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.getAdminProductById(Number(id));
      setProduct(data);
      const main = data.images?.find((i: ProductImage) => i.isMain);
      setSelectedImage(main || data.images?.[0] || null);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={loadingScreen}>
        <div style={loadingInner}>
          <div style={spinner} />
          <p style={loadingText}>Loading product…</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div style={loadingScreen}>
        <p style={loadingText}>Product not found</p>
      </div>
    );

  const hasDiscount = product.discountPrice > 0;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;
  const isActive = product.status === "Active";
  const inStock = product.stockQuantity > 0;

  return (
    <>
      <style>{inlineCSS}</style>
      <div className="pdp-root">

        {/* ── BACK NAV ── */}
        <div className="pdp-nav">
          <a href="/admin/products" className="pdp-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Products
          </a>
          <div className="pdp-breadcrumb">
            <span>{product.categoryName}</span>
            <span className="pdp-sep">/</span>
            <span className="pdp-bc-active">{product.name}</span>
          </div>
          <div className={`pdp-status-tag ${isActive ? "status-active" : "status-inactive"}`}>
            <span className="status-dot" />
            {product.status}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="pdp-layout">

          {/* LEFT — GALLERY */}
          <div className="pdp-gallery">
            {/* Main image */}
            <div className="pdp-main-img-wrap">
              {hasDiscount && (
                <div className="pdp-discount-pill">−{discountPct}%</div>
              )}
              {selectedImage && (
                <img
                  key={selectedImage.id}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${selectedImage.imageUrl}`}
                  alt={product.name}
                  className={`pdp-main-img ${imgLoaded ? "img-visible" : ""}`}
                  onLoad={() => setImgLoaded(true)}
                />
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="pdp-thumbs">
                {product.images.map((img) => {
                  const active = selectedImage?.id === img.id;
                  return (
                    <button
                      key={img.id}
                      className={`pdp-thumb ${active ? "thumb-active" : ""}`}
                      onClick={() => { setImgLoaded(false); setSelectedImage(img); }}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`}
                        alt=""
                      />
                      {img.isMain && <span className="thumb-main-tag">Main</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT — INFO */}
          <div className="pdp-info">

            {/* Category */}
            <div className="pdp-category-row">
              <span className="pdp-category-chip">{product.categoryName}</span>
              <span className="pdp-sku">SKU #{String(product.id).padStart(4, "0")}</span>
            </div>

            {/* Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price */}
            <div className="pdp-price-block">
              {hasDiscount ? (
                <>
                  <span className="pdp-price-old">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="pdp-price-sale">
                    {product.discountPrice.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="pdp-saving">
                    Tiết kiệm {(product.price - product.discountPrice).toLocaleString("vi-VN")}₫
                  </span>
                </>
              ) : (
                <span className="pdp-price-regular">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="pdp-rule" />

            {/* Meta grid */}
            <div className="pdp-meta-grid">
              <div className="pdp-meta-item">
                <span className="pdp-meta-label">Trạng thái</span>
                <span className={`pdp-meta-value ${isActive ? "val-green" : "val-red"}`}>
                  {product.status}
                </span>
              </div>
              <div className="pdp-meta-item">
                <span className="pdp-meta-label">Tồn kho</span>
                <span className={`pdp-meta-value ${inStock ? "val-green" : "val-red"}`}>
                  {inStock ? `${product.stockQuantity} sản phẩm` : "Hết hàng"}
                </span>
              </div>
              <div className="pdp-meta-item">
                <span className="pdp-meta-label">Danh mục</span>
                <span className="pdp-meta-value">{product.categoryName}</span>
              </div>
              <div className="pdp-meta-item">
                <span className="pdp-meta-label">Hình ảnh</span>
                <span className="pdp-meta-value">{product.images.length} ảnh</span>
              </div>
            </div>

            {/* Stock bar */}
            <div className="pdp-stock-bar-wrap">
              <div className="pdp-stock-bar-label">
                <span>Mức tồn kho</span>
                <span>{product.stockQuantity} units</span>
              </div>
              <div className="pdp-stock-bar-bg">
                <div
                  className="pdp-stock-bar-fill"
                  style={{
                    width: `${Math.min(100, (product.stockQuantity / 50) * 100)}%`,
                    background: product.stockQuantity > 20
                      ? "linear-gradient(90deg,#4ade80,#22c55e)"
                      : product.stockQuantity > 5
                      ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
                      : "linear-gradient(90deg,#f87171,#ef4444)",
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="pdp-rule" />

            {/* Description */}
            <div className="pdp-desc">
              <p className="pdp-desc-label">Mô tả sản phẩm</p>
              <p className="pdp-desc-text">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="pdp-actions">
              <a href={`/admin/products/${product.id}/edit`} className="pdp-btn-edit">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.333 2a1.885 1.885 0 0 1 2.667 2.667L4.667 14H2v-2.667L11.333 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Chỉnh sửa
              </a>
              <button className="pdp-btn-delete">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5.333 4V2.667h5.334V4M6.667 7.333v4M9.333 7.333v4M13.333 4l-.667 9.333H3.334L2.667 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Xóa
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   INLINE CSS
───────────────────────────────────────── */
const inlineCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  .pdp-root {
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1a1a;
  padding: 0 0 80px;
}

  /* ── Nav ── */
  .pdp-nav {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px 48px;
    border-bottom: 1px solid #eeeeee;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(12px);
  }
  .pdp-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #888;
    text-decoration: none;
    transition: color .2s;
    flex-shrink: 0;
  }
  .pdp-back:hover { color: #e8e3dc; }
  .pdp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #555;
    flex: 1;
  }
  .pdp-sep { color: #333; }
  .pdp-bc-active { color: #888; }
  .pdp-status-tag {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid;
    flex-shrink: 0;
  }
  .status-active  { color: #4ade80; border-color: rgba(74,222,128,.25); background: rgba(74,222,128,.07); }
  .status-inactive{ color: #f87171; border-color: rgba(248,113,113,.25); background: rgba(248,113,113,.07); }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%; background: currentColor;
    box-shadow: 0 0 6px currentColor;
  }

  /* ── Layout ── */
  .pdp-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    max-width: 1280px;
    margin: 0 auto;
    padding: 48px 48px 0;
    gap: 56px;
  }

  /* ── Gallery ── */
  .pdp-gallery { display: flex; flex-direction: column; gap: 16px; }

  .pdp-main-img-wrap {
    position: relative;
    background: #f8f8f8;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 4/5;
   border: 1px solid #eeeeee;
  }
  .pdp-main-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    opacity: 0;
    transition: opacity .5s ease, transform .6s cubic-bezier(.22,1,.36,1);
    transform: scale(1.03);
  }
  .pdp-main-img.img-visible {
    opacity: 1;
    transform: scale(1);
  }
  .pdp-main-img-wrap:hover .pdp-main-img { transform: scale(1.04); }

  .pdp-discount-pill {
    position: absolute;
    top: 16px; right: 16px;
    z-index: 2;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0f0f0f;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 6px 14px;
    border-radius: 100px;
    box-shadow: 0 4px 16px rgba(245,158,11,.4);
  }

  .pdp-thumbs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pdp-thumb {
    width: 76px; height: 76px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    background: #f3f3f3;
    padding: 0;
    position: relative;
    transition: border-color .2s, transform .2s;
    flex-shrink: 0;
  }
  .pdp-thumb:hover { transform: translateY(-2px); border-color: rgba(255,255,255,.2); }
  .pdp-thumb.thumb-active { border-color: #e8c87a; }
  .pdp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb-main-tag {
    position: absolute;
    bottom: 4px; left: 4px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: rgba(232,200,122,.9);
    color: #0f0f0f;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* ── Info ── */
  .pdp-info { display: flex; flex-direction: column; padding-top: 8px; }

  .pdp-category-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }
  .pdp-category-chip {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 100px;
    background: rgba(232,200,122,.1);
    color: #e8c87a;
    border: 1px solid rgba(232,200,122,.2);
  }
  .pdp-sku {
    font-size: 12px;
    color: #555;
    font-family: 'Plus Jakarta Sans', monospace;
  }

  .pdp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.3px;
    color: #f0ebe3;
    margin-bottom: 28px;
  }

  /* Price */
  .pdp-price-block {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 32px;
  }
  .pdp-price-regular {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 400;
    color: #f0ebe3;
  }
  .pdp-price-old {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    color: #444;
    text-decoration: line-through;
  }
  .pdp-price-sale {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 400;
    color: #e8c87a;
  }
  .pdp-saving {
    font-size: 12px;
    color: #4ade80;
    background: rgba(74,222,128,.08);
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid rgba(74,222,128,.15);
    align-self: center;
  }

  .pdp-rule {
    height: 1px;
    background: rgba(255,255,255,.06);
    margin: 28px 0;
  }

  /* Meta grid */
  .pdp-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .pdp-meta-item {
     background: #ffffff;
     border: 1px solid #eeeeee;
    border-radius: 12px;
    padding: 16px 18px;
  }
  .pdp-meta-label {
    display: block;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 6px;
  }
  .pdp-meta-value {
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #c8c3bc;
  }
  .val-green { color: #4ade80 !important; }
  .val-red   { color: #f87171 !important; }

  /* Stock bar */
  .pdp-stock-bar-wrap { margin-bottom: 0; }
  .pdp-stock-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #555;
    margin-bottom: 8px;
  }
  .pdp-stock-bar-bg {
    height: 6px;
    background: #1e1e1e;
    border-radius: 100px;
    overflow: hidden;
  }
  .pdp-stock-bar-fill {
    height: 100%;
    border-radius: 100px;
    transition: width .8s cubic-bezier(.22,1,.36,1);
  }

  /* Description */
  .pdp-desc { margin-bottom: 36px; }
  .pdp-desc-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #e8c87a;
    margin-bottom: 12px;
  }
  .pdp-desc-text {
    font-size: 15px;
    line-height: 1.8;
    color: #888;
    font-weight: 300;
  }

  /* Actions */
  .pdp-actions {
    display: flex;
    gap: 12px;
    margin-top: auto;
  }
  .pdp-btn-edit {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
    padding: 14px 24px;
    background: #e8c87a;
    color: #0f0f0f;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-decoration: none;
    border-radius: 10px;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(232,200,122,.2);
  }
  .pdp-btn-edit:hover {
    background: #f0d68a;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(232,200,122,.3);
  }
  .pdp-btn-delete {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    background: transparent;
    color: #666;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 10px;
    cursor: pointer;
    transition: all .2s;
  }
  .pdp-btn-delete:hover {
    border-color: rgba(248,113,113,.4);
    color: #f87171;
    background: rgba(248,113,113,.05);
  }

  /* ── Loading ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeup { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .pdp-layout { grid-template-columns: 1fr; padding: 24px; gap: 32px; }
    .pdp-nav { padding: 16px 24px; }
    .pdp-breadcrumb { display: none; }
  }
`;

/* Loading helpers */
const loadingScreen: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0f0f0f",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};
const loadingInner: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
};
const spinner: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "2px solid rgba(232,200,122,.15)",
  borderTop: "2px solid #e8c87a",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
const loadingText: React.CSSProperties = {
  fontSize: 13,
  color: "#555",
  letterSpacing: "2px",
  textTransform: "uppercase",
};