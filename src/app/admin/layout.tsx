"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role || role.toLowerCase() !== "admin") {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  // ===============================
  // NAV GROUPS
  // ===============================

  const navGroups = [
    {
      group: "Dashboard",
      links: [{ href: "/admin", label: "Dashboard", icon: "⊞" }],
    },
    {
      group: "Category Management",
      links: [
        { href: "/admin/Categories", label: "All Categories", icon: "📂" },
        { href: "/admin/Categories/create", label: "Add Category", icon: "➕" },
        { href: "/admin/Categories/toggle", label: "Manage Status", icon: "🔄" },
      ],
    },
    {
      group: "Product Management",
      links: [
        { href: "/admin/products", label: "All Products", icon: "📦" },
        { href: "/admin/products/create", label: "Add Product", icon: "➕" },
      ],
    },
    {
      group: "Order Management",
      links: [
        { href: "/admin/Order", label: "All Orders", icon: "🧾" },
      ],
    },
    {
      group: "Product Report documents",
      links: [
        { href: "/admin/RP", label: "Product Report", icon: "📊" },
        { href: "/admin/Export", label: "Export Document", icon: "📝" },
      ],
    },
    {
      group: "Banner Management",
      links: [
        { href: "/admin/Banner", label: "All Banners", icon: "🖼️" },
      ],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f0f3fa",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      }}
    >
      {/* ===============================
      SIDEBAR
      =============================== */}

      <aside
        style={{
          width: sidebarOpen ? "240px" : "64px",
          background: "#1a2038",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: "0 16px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                background:
                  "linear-gradient(135deg, #4fc3f7 0%, #1565c0 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "800",
                color: "white",
              }}
            >
              A
            </div>

            {sidebarOpen && (
              <span
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "15px",
                  letterSpacing: "1px",
                }}
              >
                ADMIN PANEL
              </span>
            )}
          </div>

          {/* Toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ☰
          </button>
        </div>

        {/* ===============================
        NAVIGATION
        =============================== */}

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {navGroups.map((group) => {
            const isOpen = openGroups.includes(group.group);

            return (
              <div key={group.group}>
                {/* GROUP HEADER */}
                <div
                  onClick={() => toggleGroup(group.group)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarOpen ? "space-between" : "center",
                    padding: sidebarOpen ? "12px 16px" : "12px",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {sidebarOpen && <span>{group.group}</span>}

                  {sidebarOpen && (
                    <span
                      style={{
                        transform: isOpen
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        transition: "0.2s",
                      }}
                    >
                      ▶
                    </span>
                  )}
                </div>

                {/* LINKS */}
                {isOpen &&
                  group.links.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: sidebarOpen
                            ? "10px 16px 10px 28px"
                            : "12px 20px",
                          color: isActive
                            ? "#4fc3f7"
                            : "rgba(255,255,255,0.55)",
                          textDecoration: "none",
                          fontSize: "13.5px",
                          fontWeight: isActive ? "600" : "400",
                          background: isActive
                            ? "rgba(79,195,247,0.1)"
                            : "transparent",
                          borderLeft: isActive
                            ? "3px solid #4fc3f7"
                            : "3px solid transparent",
                          transition: "all 0.15s ease",
                          justifyContent: sidebarOpen
                            ? "flex-start"
                            : "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "17px",
                            width: "20px",
                            textAlign: "center",
                          }}
                        >
                          {link.icon}
                        </span>

                        {sidebarOpen && (
                          <span style={{ flex: 1 }}>{link.label}</span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ===============================
      MAIN CONTENT
      =============================== */}

      <div
        style={{
          marginLeft: sidebarOpen ? "240px" : "64px",
          flex: 1,
          transition: "margin-left 0.25s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}