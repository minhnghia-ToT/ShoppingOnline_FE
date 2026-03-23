"use client";

import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const router = useRouter();

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // ===============================
  // ACTIONS
  // ===============================

  const handleSearch = async () => {
    try {
      if (!keyword.trim()) {
        fetchProducts();
        return;
      }

      const data = await api.searchUserProducts(keyword);
      setProducts(data);
      setSelectedCategory(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFilterCategory = async (id: number) => {
    try {
      setSelectedCategory(id);
      const data = await api.getProductsByCategory(id);
      setProducts(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  // ===============================
  // UI
  // ===============================

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .page {
          width: 100%;
          background: var(--chalk);
          font-family: 'Jost', sans-serif;
          color: var(--ink);
        }

        .header {
          padding: 72px 80px 36px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          letter-spacing: 2px;
        }

        .header-left p {
          margin-top: 8px;
          font-size: 12px;
          letter-spacing: 2px;
          color: var(--muted);
          text-transform: uppercase;
        }

        .header-count {
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--muted);
        }

        .container {
          padding: 60px 80px;
        }

        .content {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
        }

        /* SIDEBAR */

        .sidebar {
          border-right: 1px solid var(--border);
          padding-right: 20px;
        }

        .sidebar h3 {
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 20px;
        }

        .category-item {
          padding: 10px 0;
          cursor: pointer;
          color: var(--muted);
          font-size: 13px;
        }

        .category-item:hover {
          color: var(--ink);
        }

        .category-item.active {
          color: var(--gold);
        }

        /* SEARCH */

        .search-bar {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border);
        }

        .search-bar input {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          outline: none;
        }

        .search-bar button {
          background: var(--gold);
          border: none;
          padding: 10px 16px;
          cursor: pointer;
        }

        /* GRID */

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 48px 36px;
        }

        .card {
          cursor: pointer;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card-image-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #eee;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.6s;
        }

        .card:hover img {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(14,14,14,0.9);
          padding: 14px;
          display: flex;
          gap: 10px;
          transform: translateY(100%);
          transition: 0.3s;
        }

        .card:hover .card-overlay {
          transform: translateY(0);
        }

        .btn {
          flex: 1;
          padding: 10px;
          font-size: 11px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
        }

        .btn-cart {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
        }

        .btn-cart.added,
        .btn-cart:hover {
          background: var(--gold);
          color: #000;
        }

        .btn-buy {
          background: var(--gold);
        }

        .card-body {
          text-align: center;
          padding-top: 16px;
        }

        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
        }

        .card-price {
          margin-top: 6px;
          font-size: 13px;
          color: var(--muted);
        }

        /* MOBILE */

        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: flex;
            overflow-x: auto;
            gap: 16px;
            border: none;
          }
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <h1>Products</h1>
            <p>Explore our collection</p>
          </div>
          <span className="header-count">{products.length} items</span>
        </div>

        {/* CONTENT */}
        <div className="container">
          <div className="content">
            {/* SIDEBAR */}
            <div className="sidebar">
              <h3>Categories</h3>

              <div
                className={`category-item ${!selectedCategory ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(null);
                  fetchProducts();
                }}
              >
                All
              </div>

              {categories.map((c) => (
                <div
                  key={c.id}
                  className={`category-item ${
                    selectedCategory === c.id ? "active" : ""
                  }`}
                  onClick={() => handleFilterCategory(c.id)}
                >
                  {c.name}
                </div>
              ))}
            </div>

            {/* MAIN */}
            <div>
              {/* SEARCH */}
              <div className="search-bar">
                <input
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              {/* GRID */}
              <div className="grid">
                {products.map((p) => (
                  <div key={p.id} className="card">
                    <div className="card-image-wrap">
                      <img
                        src={getImageUrl(p.mainImage)}
                        onClick={() =>
                          router.push(`/products/${p.id}`)
                        }
                      />

                      <div className="card-overlay">
                        <button
                          className={`btn btn-cart ${
                            addedIds.has(p.id) ? "added" : ""
                          }`}
                          onClick={() => handleAddToCart(p.id)}
                        >
                          {addedIds.has(p.id)
                            ? "Added ✓"
                            : "Add"}
                        </button>

                        <button
                          className="btn btn-buy"
                          onClick={() => handleBuyNow(p.id)}
                        >
                          Buy
                        </button>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-name">{p.name}</div>
                      <div className="card-price">
                        {formatPrice(p.discountPrice || p.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}