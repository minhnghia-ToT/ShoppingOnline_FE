"use client";

import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err: any) {
        alert(err.message);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const handleAddToCart = async (id: number) => {
    try {
      await api.addToCart(id, 1);
      setAddedIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBuyNow = (id: number) => {
    router.push(`/checkout?productId=${id}&quantity=1`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
        }

        .header {
          padding: 56px 60px 28px;
          border-bottom: 1px solid #f0ede8;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: -0.5px;
          color: #111;
          line-height: 1;
        }

        .header-left p {
          margin-top: 6px;
          font-size: 13px;
          color: #999;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .header-count {
          font-size: 12px;
          color: #bbb;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 400;
        }

        .grid-container {
          padding: 44px 60px 80px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 36px 28px;
        }

        .card {
          background: #fff;
          cursor: pointer;
          position: relative;
          animation: fadeUp 0.5s ease both;
        }

        .card:nth-child(1) { animation-delay: 0ms; }
        .card:nth-child(2) { animation-delay: 60ms; }
        .card:nth-child(3) { animation-delay: 120ms; }
        .card:nth-child(4) { animation-delay: 180ms; }
        .card:nth-child(5) { animation-delay: 240ms; }
        .card:nth-child(6) { animation-delay: 300ms; }
        .card:nth-child(7) { animation-delay: 360ms; }
        .card:nth-child(8) { animation-delay: 420ms; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-image-wrap {
          position: relative;
          overflow: hidden;
          background: #f8f7f5;
          aspect-ratio: 3 / 4;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .card:hover .card-image-wrap img {
          transform: scale(1.04);
        }

        .card-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.96);
          padding: 14px 16px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          gap: 8px;
        }

        .card:hover .card-overlay {
          transform: translateY(0);
        }

        .btn {
          flex: 1;
          padding: 10px 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cart {
          background: #f5f4f2;
          color: #333;
          border: 1px solid #e8e6e2;
        }

        .btn-cart:hover, .btn-cart.added {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .btn-buy {
          background: #1a1a1a;
          color: #fff;
        }

        .btn-buy:hover {
          background: #333;
        }

        .card-body {
          padding: 16px 4px 0;
        }

        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 500;
          color: #111;
          line-height: 1.3;
          letter-spacing: 0.1px;
        }

        .card-price {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 400;
          color: #888;
          letter-spacing: 0.2px;
        }

        .card-price .original {
          text-decoration: line-through;
          color: #ccc;
          margin-left: 6px;
          font-size: 12px;
        }

        .loading-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 36px 28px;
        }

        .skeleton-card { animation: pulse 1.5s ease infinite; }

        .skeleton-img {
          aspect-ratio: 3/4;
          background: #f2f1ef;
          border-radius: 2px;
        }

        .skeleton-line {
          height: 14px;
          background: #f2f1ef;
          border-radius: 2px;
          margin-top: 14px;
        }

        .skeleton-line.short { width: 50%; margin-top: 8px; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 640px) {
          .header { padding: 36px 24px 20px; flex-direction: column; align-items: flex-start; gap: 8px; }
          .grid-container { padding: 28px 24px 60px; }
          .grid { gap: 24px 16px; grid-template-columns: repeat(2, 1fr); }
          .card-overlay { transform: translateY(0); }
          .header-left h1 { font-size: 32px; }
        }
      `}</style>

      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>Sản phẩm</h1>
            <p>Khám phá bộ sưu tập của chúng tôi</p>
          </div>
          {products.length > 0 && (
            <span className="header-count">{products.length} sản phẩm</span>
          )}
        </div>

        {/* Grid */}
        <div className="grid-container">
          {products.length === 0 ? (
            <div className="loading-skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid">
              {products.map((p) => (
                <div key={p.id} className="card">
                  {/* Image */}
                  <div className="card-image-wrap">
                    <img
                      src={getImageUrl(p.mainImage)}
                      alt={p.name}
                      onClick={() => router.push(`/products/${p.id}`)}
                    />
                    {/* Hover Overlay with Actions */}
                    <div className="card-overlay">
                      <button
                        className={`btn btn-cart${addedIds.has(p.id) ? " added" : ""}`}
                        onClick={() => handleAddToCart(p.id)}
                      >
                        {addedIds.has(p.id) ? "Đã thêm ✓" : "Thêm vào giỏ"}
                      </button>
                      <button
                        className="btn btn-buy"
                        onClick={() => handleBuyNow(p.id)}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div
                    className="card-body"
                    onClick={() => router.push(`/products/${p.id}`)}
                  >
                    <div className="card-name">{p.name}</div>
                    <div className="card-price">
                      {formatPrice(p.discountPrice || p.price)}
                      {p.discountPrice && p.price !== p.discountPrice && (
                        <span className="original">{formatPrice(p.price)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}