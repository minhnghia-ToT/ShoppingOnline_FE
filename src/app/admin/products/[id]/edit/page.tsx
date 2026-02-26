"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/src/lib/api";

interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [status, setStatus] = useState("Active");
  const [categoryId, setCategoryId] = useState<number>(1);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ===============================
  // Notification helper
  // ===============================

  const showNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ===============================
  // LOAD PRODUCT
  // ===============================

  useEffect(() => {
    if (!productId) return;
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const data = await api.getAdminProductById(productId);

      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setDiscountPrice(data.discountPrice);
      setStockQuantity(data.stockQuantity);
      setStatus(data.status);
      setCategoryId(data.categoryId);
      setImages(data.images || []);
    } catch (err: any) {
      showNotification(
        err.message || "Failed to load product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE STATUS (PATCH API)
  // ===============================

  const handleChangeStatus = async (newStatus: string) => {
    try {
      setStatusLoading(true);

      await api.updateProductStatus(productId, newStatus);

      setStatus(newStatus);

      showNotification(
        "Status updated successfully",
        "success"
      );
    } catch (err: any) {
      showNotification(
        err.message || "Failed to update status",
        "error"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // ===============================
  // DELETE IMAGE
  // ===============================

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;

    try {
      await api.deleteProductImage(imageId);
      setImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );
      showNotification("Image deleted successfully", "success");
    } catch (err: any) {
      showNotification(
        err.message || "Failed to delete image",
        "error"
      );
    }
  };

  // ===============================
  // UPDATE PRODUCT
  // ===============================

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        name,
        description,
        price,
        discountPrice,
        stockQuantity,
        status,
        categoryId,
        newImages: [] as {
          imageUrl: string;
          isMain: boolean;
        }[],
      };

      await api.updateProduct(productId, payload);

      showNotification(
        "Product updated successfully",
        "success"
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (err: any) {
      showNotification(
        err.message || "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Edit Product</h1>

      <div style={formGrid}>
        <Input label="Name" value={name} setValue={setName} />

        <Input
          label="Price"
          value={price}
          setValue={setPrice}
          type="number"
        />

        <Input
          label="Discount Price"
          value={discountPrice}
          setValue={setDiscountPrice}
          type="number"
        />

        <Input
          label="Stock Quantity"
          value={stockQuantity}
          setValue={setStockQuantity}
          type="number"
        />

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            style={textareaStyle}
          />
        </div>

        {/* STATUS */}
        <div>
          <label style={labelStyle}>Status</label>
          <select
            value={status}
            onChange={(e) =>
              handleChangeStatus(e.target.value)
            }
            disabled={statusLoading}
            style={{
              ...inputStyle,
              opacity: statusLoading ? 0.6 : 1,
            }}
          >
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
          </select>

          {statusLoading && (
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Updating status...
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Category Id</label>
          <input
            type="number"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(Number(e.target.value))
            }
            style={inputStyle}
          />
        </div>
      </div>

      {/* IMAGES */}
      <h2 style={{ marginTop: 40 }}>Images</h2>

      <div style={imageGrid}>
        {images.map((img) => (
          <div key={img.id} style={imageWrap}>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`}
              style={imageStyle}
              onClick={() =>
                setPreviewImage(
                  `${process.env.NEXT_PUBLIC_API_URL}${img.imageUrl}`
                )
              }
            />

            <button
              style={deleteBtn}
              onClick={() =>
                handleDeleteImage(img.id)
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* SAVE */}
      <button
        onClick={handleSubmit}
        style={saveBtn}
      >
        {saving ? "Saving..." : "Update Product"}
      </button>

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          style={overlay}
          onClick={() =>
            setPreviewImage(null)
          }
        >
          <img
            src={previewImage}
            style={previewStyle}
          />
        </div>
      )}

      {/* NOTIFICATION */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "14px 20px",
            borderRadius: 10,
            color: "#fff",
            fontWeight: 600,
            background:
              notification.type === "success"
                ? "#22c55e"
                : "#ef4444",
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string | number;
  setValue: any;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          type === "number"
            ? setValue(Number(e.target.value))
            : setValue(e.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle: React.CSSProperties = {
  padding: "50px 60px",
  fontFamily: "DM Sans, sans-serif",
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 30,
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: 100,
};

const imageGrid: React.CSSProperties = {
  display: "flex",
  gap: 16,
  marginTop: 20,
  flexWrap: "wrap",
};

const imageWrap: React.CSSProperties = {
  position: "relative",
};

const imageStyle: React.CSSProperties = {
  width: 120,
  height: 120,
  objectFit: "cover",
  borderRadius: 10,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  position: "absolute",
  top: -8,
  right: -8,
  background: "#e05a3a",
  border: "none",
  color: "#fff",
  width: 24,
  height: 24,
  borderRadius: "50%",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  marginTop: 40,
  padding: "12px 30px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const previewStyle: React.CSSProperties = {
  maxWidth: "80%",
  maxHeight: "80%",
  borderRadius: 16,
};