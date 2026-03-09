"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  categoryName: string;
  mainImage: string;
}

interface Banner {
  id: number;
  imageUrl: string;
  isActive: boolean;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const isLoggedIn = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await api.getProducts();
        setProducts(productData);
        const bannerData = await api.getAdminBanners();
        const active = bannerData.filter((b: Banner) => b.isActive);
        setBanners(active);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const changeBanner = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBanner(index);
      setIsTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      changeBanner(
        currentBanner === banners.length - 1 ? 0 : currentBanner + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [banners, currentBanner]);

  const nextBanner = () =>
    changeBanner(currentBanner === banners.length - 1 ? 0 : currentBanner + 1);
  const prevBanner = () =>
    changeBanner(currentBanner === 0 ? banners.length - 1 : currentBanner - 1);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const handleAddToCart = (productId: number) => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    console.log("Add to cart", productId);
  };

  const handleBuyNow = (productId: number) => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    router.push(`/checkout/${productId}`);
  };

  return (
    <div className="home-page">

      {/* ─── BANNER ─── */}
      <section className="banner-wrapper">
        {banners.length > 0 && (
          <>
            {/* Image layer */}
            <div className={`banner-img-layer ${isTransitioning ? "fade-out" : "fade-in"}`}>
              <img
                src={getImageUrl(banners[currentBanner].imageUrl)}
                alt=""
                className="banner-img"
              />
            </div>

            {/* Gradient veil */}
            <div className="banner-veil" />

            {/* Counter — top right */}
            <div className="banner-counter">
              <span className="counter-current">
                {String(currentBanner + 1).padStart(2, "0")}
              </span>
              <span className="counter-sep" />
              <span className="counter-total">
                {String(banners.length).padStart(2, "0")}
              </span>
            </div>

            {/* Arrow buttons — right edge */}
            <div className="banner-arrows">
              <button className="banner-btn" onClick={prevBanner} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="banner-btn" onClick={nextBanner} aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Progress lines — bottom */}
            <div className="banner-progress">
              {banners.map((_, i) => (
                <button
                  key={i}
                  className={`progress-line ${i === currentBanner ? "active" : ""}`}
                  onClick={() => changeBanner(i)}
                  aria-label={`Go to banner ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ─── HERO LABEL ─── */}
      <section className="page-hero">
        <p className="hero-eyebrow">Collection</p>
        <h1 className="hero-title">Our Products</h1>
        <div className="hero-rule" />
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <div className="product-image-wrap">
              <img src={getImageUrl(product.mainImage)} alt={product.name} />
              <div className="product-image-overlay" />
            </div>

            <div className="product-body">
              <p className="product-category">{product.categoryName}</p>
              <h3 className="product-name">{product.name}</h3>

              <div className="product-price">
                {product.discountPrice > 0 ? (
                  <>
                    <span className="price-old">{formatPrice(product.price)}</span>
                    <span className="price-new">{formatPrice(product.discountPrice)}</span>
                  </>
                ) : (
                  <span className="price-new">{formatPrice(product.price)}</span>
                )}
              </div>

              <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cart" onClick={() => handleAddToCart(product.id)}>
                  Thêm vào giỏ
                </button>
                <button className="btn-buy" onClick={() => handleBuyNow(product.id)}>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        :root {
          --ink: #0e0e0e;
          --chalk: #f5f3ef;
          --gold: #b89a6a;
          --muted: #888480;
          --border: rgba(14,14,14,0.1);
        }

        .home-page {
          font-family: 'Jost', sans-serif;
          background: var(--chalk);
          color: var(--ink);
          padding: 0;
        }

        /* ── BANNER ── */

        .banner-wrapper {
          position: relative;
          width: 100%;
          height: 92vh;
          min-height: 560px;
          overflow: hidden;
          background: #0e0e0e;
        }

        .banner-img-layer {
          position: absolute;
          inset: 0;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .banner-img-layer.fade-in  { opacity: 1; }
        .banner-img-layer.fade-out { opacity: 0; }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.03);
          transition: transform 6s ease;
        }

        .banner-img-layer.fade-in .banner-img {
          transform: scale(1);
        }

        /* Subtle dark veil */
        .banner-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.06) 0%,
            rgba(0,0,0,0.02) 40%,
            rgba(0,0,0,0.52) 100%
          );
          pointer-events: none;
        }

        /* Counter — top right */
        .banner-counter {
          position: absolute;
          top: 40px;
          right: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.65);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .counter-current {
          color: #fff;
          font-weight: 500;
          font-size: 13px;
        }

        .counter-sep {
          display: block;
          width: 28px;
          height: 1px;
          background: rgba(255,255,255,0.35);
        }

        /* Arrows — right side, centred */
        .banner-arrows {
          position: absolute;
          right: 48px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .banner-btn {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, color 0.25s;
          backdrop-filter: blur(6px);
        }

        .banner-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.65);
          color: #fff;
        }

        /* Progress lines — bottom */
        .banner-progress {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .progress-line {
          width: 28px;
          height: 1px;
          background: rgba(255,255,255,0.28);
          border: none;
          cursor: pointer;
          transition: width 0.4s ease, background 0.3s ease;
          padding: 6px 0;
          background-clip: content-box;
        }

        .progress-line:hover {
          background: rgba(255,255,255,0.55);
        }

        .progress-line.active {
          width: 60px;
          background: #fff;
        }

        /* ── HERO ── */

        .page-hero {
          text-align: center;
          padding: 80px 80px 48px;
        }

        .hero-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          letter-spacing: 1px;
          color: var(--ink);
          margin: 0 0 28px;
        }

        .hero-rule {
          width: 40px;
          height: 1px;
          background: var(--gold);
          margin: 0 auto;
        }

        /* ── PRODUCTS ── */

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
          padding: 0 80px 80px;
        }

        .product-card {
          background: #fff;
          cursor: pointer;
          overflow: hidden;
          transition: box-shadow 0.35s ease;
          border: 1px solid var(--border);
        }

        .product-card:hover {
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
          z-index: 1;
        }

        .product-image-wrap {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          background: #f0ede8;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }

        .product-card:hover .product-image-wrap img {
          transform: scale(1.05);
        }

        .product-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .product-body {
          padding: 22px 24px 24px;
          border-top: 1px solid var(--border);
        }

        .product-category {
          font-size: 9px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
          margin-bottom: 8px;
        }

        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          color: var(--ink);
          margin: 0 0 14px;
          line-height: 1.3;
        }

        .product-price {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
        }

        .price-old {
          font-size: 12px;
          color: var(--muted);
          text-decoration: line-through;
          font-weight: 300;
        }

        .price-new {
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: 0.5px;
        }

        .product-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .btn-cart,
        .btn-buy {
          padding: 10px 0;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
          border-radius: 0;
        }

        .btn-cart {
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--ink);
        }

        .btn-cart:hover {
          background: var(--ink);
          color: var(--chalk);
        }

        .btn-buy {
          background: var(--ink);
          color: var(--chalk);
          border: 1px solid var(--ink);
        }

        .btn-buy:hover {
          background: var(--gold);
          border-color: var(--gold);
          color: #fff;
        }

        @media (max-width: 768px) {
          .banner-wrapper { height: 60vh; }
          .banner-arrows { display: none; }
          .banner-counter { top: 20px; right: 20px; }
          .page-hero { padding: 60px 20px 40px; }
          .hero-title { font-size: 36px; }
          .product-grid { padding: 0 16px 60px; gap: 12px; }
        }
      `}</style>
    </div>
  );
}