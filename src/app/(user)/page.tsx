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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const isLoggedIn = () => {
    return typeof window !== "undefined" && localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  /* ADD TO CART */

  const handleAddToCart = (productId: number) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    console.log("Add to cart", productId);

    // sau này gọi API
    // api.addToCart(productId)
  };

  /* BUY NOW */

  const handleBuyNow = (productId: number) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    router.push(`/checkout/${productId}`);
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="page-hero">
        <p className="hero-eyebrow">Collection</p>
        <h1 className="hero-title">Our Products</h1>
      </section>

      {/* PRODUCT GRID */}
      <section className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            {/* IMAGE */}
            <div className="product-image">
              <img
                src={getImageUrl(product.mainImage)}
                alt={product.name}
              />
            </div>

            {/* INFO */}
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

              {/* ACTION BUTTONS */}
              <div
                className="product-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(product.id)}
                >
                  🛒 Add to Cart
                </button>

                <button
                  className="btn-buy"
                  onClick={() => handleBuyNow(product.id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        .home-page {
          padding: 60px 80px;
          background: #ffffff;
          min-height: 100vh;
        }

        .page-hero {
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-eyebrow {
          letter-spacing: 3px;
          font-size: 12px;
          color: #888;
          margin-bottom: 10px;
        }

        .hero-title {
          font-size: 40px;
          font-weight: 600;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 40px;
        }

        .product-card {
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #eee;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .product-image {
          width: 100%;
          height: 280px;
          overflow: hidden;
          background: #f6f6f6;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }

        .product-card:hover img {
          transform: scale(1.05);
        }

        .product-body {
          padding: 18px;
        }

        .product-category {
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .product-price {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 16px;
        }

        .price-old {
          text-decoration: line-through;
          color: #999;
          font-size: 14px;
        }

        .price-new {
          font-size: 18px;
          font-weight: 600;
          color: #111;
        }

        .product-actions {
          display: flex;
          gap: 10px;
        }

        .btn-cart {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #111;
          background: transparent;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-cart:hover {
          background: #111;
          color: white;
        }

        .btn-buy {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: black;
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-buy:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}