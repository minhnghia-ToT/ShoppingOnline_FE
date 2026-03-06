"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = localStorage.getItem("cart");

    if (cart) {
      const items = JSON.parse(cart);
      setCartCount(items.length);
    }
  }, []);

  const handleUserClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <header className="header">
      <nav className="nav">

        {/* LOGO */}
        <div className="logo">
          <Link href="/">VELORA</Link>
        </div>

        {/* MENU */}
        <ul className="menu">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Shop</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/faq">FAQ's</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* ACTIONS */}
        <div className="actions">

          {/* USER */}
          <button
            className="icon-btn"
            onClick={handleUserClick}
          >
            <User size={20} />
          </button>

          {/* CART */}
          <button
            className="cart"
            onClick={handleCartClick}
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </button>

        </div>

      </nav>
    </header>
  );
}