"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  checkLogin();

  window.addEventListener("storage", checkLogin);

  return () => {
    window.removeEventListener("storage", checkLogin);
  };
}, []);

  return (
    <header style={headerStyle}>
      <h2 style={logoStyle}>Luxury Store</h2>

      <nav style={{ display: "flex", gap: "20px" }}>
        {!isLoggedIn ? (
          <>
            <Link href="/login" style={linkStyle}>
              Login
            </Link>
            <Link href="/register" style={linkStyle}>
              Register
            </Link>
          </>
        ) : (
          <Link href="/profile" style={linkStyle}>
            My Account
          </Link>
        )}
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "25px 60px",
  borderBottom: "1px solid #eee",
  backgroundColor: "#fff",
};

const logoStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "22px",
  letterSpacing: "1px",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "14px",
  letterSpacing: "1px",
};