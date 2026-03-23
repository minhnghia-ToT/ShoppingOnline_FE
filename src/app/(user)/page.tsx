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

interface Category {
  id: number;
  name: string;
}

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const data = await api.getCategories();
    setCategories(data);
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = async () => {
    if (!keyword.trim()) return fetchProducts();

    const data = await api.searchUserProducts(keyword);
    setProducts(data);
    setSelectedCategory(null);
  };

  // =========================
  // FILTER CATEGORY
  // =========================
  const handleFilterCategory = async (id: number) => {
    setSelectedCategory(id);
    const data = await api.getProductsByCategory(id);
    setProducts(data);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    setLoadingId(product.id);
    await api.addToCart(product.id, 1);
    setLoadingId(null);
  };

  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    router.push(`/checkout?productId=${product.id}&quantity=1`);
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>
            Discover <em>Modern Fashion</em>
          </h1>
          <p>Explore premium collections for your everyday style.</p>

          <button
            className="hero-btn"
            onClick={() => router.push("/products")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* SEARCH */}
      <section className="search">
        <div className="search-inner">
          <input
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products">
        <div className="section-header">
          <h2>Products</h2>
          <span>{products.length} items</span>
        </div>

        {/* CATEGORY FILTER */}
        <div style={{ marginBottom: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setSelectedCategory(null);
              fetchProducts();
            }}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              background: !selectedCategory ? "#000" : "#fff",
              color: !selectedCategory ? "#fff" : "#000",
            }}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleFilterCategory(c.id)}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                background: selectedCategory === c.id ? "#000" : "#fff",
                color: selectedCategory === c.id ? "#fff" : "#000",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="product-card-image">
                <img src={getImageUrl(product.mainImage)} />
              </div>

              <div className="product-card-info">
                <h3>{product.name}</h3>

                <div className="price">
                  {product.discountPrice > 0 ? (
                    <>
                      <span style={{ textDecoration: "line-through", marginRight: 6 }}>
                        {formatPrice(product.price)}
                      </span>
                      <span className="price-sale">
                        {formatPrice(product.discountPrice)}
                      </span>
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div
                className="product-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(product)}
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
          ))}
        </div>
      </section>
    </>
  );
}