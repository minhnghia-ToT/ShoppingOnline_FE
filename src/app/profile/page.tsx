"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="container">
      <h1>My Profile</h1>
      <p>Welcome to your account page.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}