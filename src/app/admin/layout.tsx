"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Heart,
  LayoutDashboard,
  FileText,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const sidebarItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin/dashboard" },
  { icon: <FileText size={20} />, label: "Blog Posts", href: "/admin/blogs" },
  { icon: <CalendarDays size={20} />, label: "Events", href: "/admin/events" },
  { icon: <ImageIcon size={20} />, label: "Media", href: "/admin/media" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: "260px",
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border-light)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : undefined,
          zIndex: 50,
          boxShadow: sidebarOpen ? "var(--shadow-xl)" : undefined,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-sm)",
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Heart size={16} fill="white" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--color-text)",
              }}
            >
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
            style={{
              display: "none",
              padding: "0.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.7rem 1rem",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                      background: isActive ? "rgba(13, 148, 136, 0.08)" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: "1rem 0.75rem",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 1rem",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              marginBottom: "0.25rem",
            }}
          >
            <ChevronLeft size={18} /> View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 1rem",
              borderRadius: "var(--radius-md)",
              width: "100%",
              background: "none",
              border: "none",
              fontSize: "0.85rem",
              color: "#ef4444",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "260px" }} className="admin-main">
        {/* Top Bar (mobile) */}
        <div
          className="admin-topbar"
          style={{
            display: "none",
            padding: "0.75rem 1.5rem",
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border-light)",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text)",
            }}
          >
            <Menu size={22} />
          </button>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Admin
          </span>
          <div style={{ width: "34px" }} />
        </div>

        <div style={{ padding: "2rem" }}>{children}</div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
            position: fixed !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .sidebar-close {
            display: block !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .admin-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
