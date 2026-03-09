"use client";

import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";

interface Banner {
  id: number;
  imageUrl: string;
  isActive: boolean;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [createPopup, setCreatePopup] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const fetchBanners = async () => {
    try {
      const data = await api.getAdminBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to load banners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // DELETE
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await api.deleteBanner(deleteId);

      setBanners((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // TOGGLE
  const toggleBanner = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/banners/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  // IMAGE SELECT
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("jpeg") && !file.type.includes("png")) {
      alert("Only JPG or PNG images allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // CREATE BANNER
  const createBanner = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      await api.createBanner(image);

      setCreatePopup(false);
      setSuccessPopup(true);

      setImage(null);
      setPreview(null);

      fetchBanners();

      setTimeout(() => {
        setSuccessPopup(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Create banner failed");
    }
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Loading banners...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
          Banner Management
        </h1>

        <button
          onClick={() => setCreatePopup(true)}
          style={{
            padding: "8px 16px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Add Banner
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "12px" }}>Preview</th>
              <th style={{ padding: "12px" }}>Image URL</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                <td style={{ padding: "12px" }}>
                  <img
                    src={getImageUrl(banner.imageUrl)}
                    style={{
                      width: "140px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #eee",
                      opacity: banner.isActive ? 1 : 0.35,
                    }}
                  />
                </td>

                <td style={{ padding: "12px", fontSize: "13px", color: "#666" }}>
                  {banner.imageUrl}
                </td>

                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: banner.isActive ? "#e6f7e6" : "#fdeaea",
                      color: banner.isActive ? "#0a7d00" : "#b00020",
                    }}
                  >
                    {banner.isActive ? "Visible" : "Hidden"}
                  </span>
                </td>

                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => toggleBanner(banner.id)}
                    style={{
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      background: banner.isActive ? "#ff9800" : "#2e7d32",
                      color: "white",
                    }}
                  >
                    {banner.isActive ? "Hide" : "Activate"}
                  </button>

                  <button
                    onClick={() => setDeleteId(banner.id)}
                    style={{
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#e53935",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      marginLeft: "8px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE POPUP */}
      {createPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Create Banner</h3>

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  borderRadius: "6px",
                }}
              />
            )}

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={createBanner}
                style={{
                  padding: "8px 16px",
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Create
              </button>

              <button
                onClick={() => setCreatePopup(false)}
                style={{
                  padding: "8px 16px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "360px",
              textAlign: "center",
            }}
          >
            <h3>Delete Banner</h3>

            <p style={{ margin: "15px 0" }}>
              Are you sure you want to delete this banner?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "8px 16px",
                  background: "#e53935",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                }}
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteId(null)}
                style={{
                  padding: "8px 16px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "#2e7d32",
            color: "white",
            padding: "12px 18px",
            borderRadius: "6px",
          }}
        >
          Banner created successfully
        </div>
      )}
    </div>
  );
}