"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBannerPage() {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("jpeg") && !file.type.includes("png")) {
      alert("Only JPG or PNG images are allowed.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select a banner image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Image", image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/banners`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Create failed");

      setSuccessPopup(true);

      setTimeout(() => {
        router.push("/admin/Banner");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Create Banner
      </h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          maxWidth: "500px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Upload */}
        <label
          style={{
            fontWeight: "600",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Banner Image (JPG / PNG)
        </label>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ marginBottom: "8px" }}>Preview:</p>

            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: "25px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            background: "#1976d2",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Creating..." : "Create Banner"}
        </button>
      </div>

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              width: "320px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              Banner Created Successfully
            </h3>

            <p style={{ fontSize: "14px", color: "#666" }}>
              Redirecting to banner list...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}