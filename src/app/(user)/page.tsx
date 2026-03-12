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
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const isLoggedIn = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  // =========================
  // FETCH DATA
  // =========================
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

  // =========================
  // BANNER AUTO SLIDE
  // =========================
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

  // =========================
  // ADD TO CART (API)
  // =========================
  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    try {
      setLoadingId(product.id);

      await api.addToCart(product.id, 1);

      alert("Added to cart successfully");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // BUY NOW
  // =========================
  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    router.push(`/checkout?productId=${product.id}&quantity=1`);
  };

  return (
    <div className="home-page">
      {/* =========================
            BANNER
      ========================== */}
      <section className="banner-wrapper">
        {banners.length > 0 && (
          <>
            <div
              className={`banner-img-layer ${
                isTransitioning ? "fade-out" : "fade-in"
              }`}
            >
              <img
                src={getImageUrl(banners[currentBanner].imageUrl)}
                alt=""
                className="banner-img"
              />
            </div>

            <div className="banner-arrows">
              <button className="banner-btn" onClick={prevBanner}>
                ◀
              </button>

              <button className="banner-btn" onClick={nextBanner}>
                ▶
              </button>
            </div>
          </>
        )}
      </section>

      {/* HERO */}
      <section className="page-hero">
        <p className="hero-eyebrow">Collection</p>
        <h1 className="hero-title">Our Products</h1>
      </section>

      {/* PRODUCTS */}
      <section className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <div className="product-image-wrap">
              <img src={getImageUrl(product.mainImage)} alt={product.name} />
            </div>

            <div className="product-body">
              <p className="product-category">{product.categoryName}</p>

              <h3 className="product-name">{product.name}</h3>

              <div className="product-price">
                {product.discountPrice > 0 ? (
                  <>
                    <span className="price-old">
                      {formatPrice(product.price)}
                    </span>

                    <span className="price-new">
                      {formatPrice(product.discountPrice)}
                    </span>
                  </>
                ) : (
                  <span className="price-new">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div
                className="product-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingId === product.id}
                >
                  {loadingId === product.id ? "Adding..." : "Add to cart"}
                </button>

                <button
                  className="btn-buy"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* STYLE */}
      <style jsx>{`
        .home-page {
          font-family: sans-serif;
          background: #f5f3ef;
        }

        .banner-wrapper {
          height: 70vh;
          position: relative;
          overflow: hidden;
        }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-arrows {
          position: absolute;
          right: 40px;
          top: 50%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .banner-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.6);
          cursor: pointer;
        }

        .page-hero {
          text-align: center;
          padding: 60px 20px;
        }

        .hero-title {
          font-size: 42px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
          gap: 20px;
          padding: 40px 80px;
        }

        .product-card {
          background: white;
          border: 1px solid #eee;
          cursor: pointer;
        }

        .product-image-wrap {
          height: 260px;
          overflow: hidden;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-body {
          padding: 20px;
        }

        .product-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-cart,
        .btn-buy {
          flex: 1;
          padding: 10px;
          border: none;
          cursor: pointer;
        }

        .btn-cart {
          background: white;
          border: 1px solid black;
        }

        .btn-buy {
          background: black;
          color: white;
        }

        .price-old {
          text-decoration: line-through;
          margin-right: 10px;
          color: gray;
        }

        .price-new {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}