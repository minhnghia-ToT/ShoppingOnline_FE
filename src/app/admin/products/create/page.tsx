"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    status: "Active",
    categoryId: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setCategories(data.items || data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "price" ||
        name === "discountPrice" ||
        name === "stockQuantity" ||
        name === "categoryId"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // giả lập loading 5 giây
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setShowToast(true);

      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "80px 40px",
          background: "#f4f6fb",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "60px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          {/* <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "50px",
              letterSpacing: "-0.6px",
            }}
          >
            Add New Product
          </h1> */}

          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup label="Product Name *">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </FormGroup>

              <FormGroup label="Category *">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value={0}>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Grid>

            <FormGroup label="Description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ ...inputStyle, height: "130px" }}
              />
            </FormGroup>

            <Grid>
              <FormGroup label="Price *">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </FormGroup>

              <FormGroup label="Discount Price">
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </FormGroup>
            </Grid>

            <Grid>
              <FormGroup label="Stock Quantity *">
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </FormGroup>

              <FormGroup label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormGroup>
            </Grid>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "40px",
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                fontWeight: 600,
                fontSize: "15px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg,#111827,#1f2937)",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading && (
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "3px solid #fff",
                    borderTop: "3px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              {loading ? "Creating product..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>

      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "#111827",
            color: "white",
            padding: "16px 24px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ✅ Product created successfully
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

function FormGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "26px" }}>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "10px",
          color: "#374151",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "40px",
        rowGap: "24px",
      }}
    >
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  fontSize: "14px",
  outline: "none",
};