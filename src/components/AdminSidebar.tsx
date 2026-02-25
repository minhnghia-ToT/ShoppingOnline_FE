"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">ADMIN</h2>

      <ul className="space-y-4">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block p-3 rounded-lg transition ${
                pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}