"use client";

import { logout } from "@/src/lib/auth";

export default function HomePage() {
  return (
    <div className="container">
      <h1>Luxury Store</h1>
      <p>Welcome to our premium collection.</p>

      <button onClick={logout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}