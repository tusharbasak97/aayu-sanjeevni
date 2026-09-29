"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import AccessibilityToolbar from "./AccessibilityToolbar";
import MagneticButton from "../ui/MagneticButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <nav
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
            }}
          >
            <Heart size={20} fill="white" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1.35rem",
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            Aayu{" "}
            <span style={{ color: "var(--color-primary)" }}>Sanjeevni</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="nav-desktop"
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    color: isActive
                      ? "var(--color-nav-active-text)"
                      : "var(--color-text-muted)",
                    background: isActive
                      ? "var(--color-nav-active-bg)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text)";
                      e.currentTarget.style.background = "var(--color-nav-active-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions: Language Selector + Accessibility + Get Help CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Accessibility toolbar on desktop */}
          <div className="nav-desktop">
            <AccessibilityToolbar />
          </div>

          {/* Regional Indian Language Selector */}
          <LanguageSelector />

          {/* Get Help CTA */}
          <div className="nav-desktop">
            <MagneticButton strength={0.25}>
              <Link
                href="/contact"
                style={{
                  display: "inline-block",
                  padding: "0.55rem 1.35rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "#ffffff",
                  background: "var(--color-primary)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                Get Help
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle with >=44px Touch Target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav-mobile-toggle"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text)",
              borderRadius: "var(--radius-sm)",
            }}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            padding: "1.25rem 1.5rem 1.75rem",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
              Reading & Theme
            </span>
            <AccessibilityToolbar />
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "block",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: isActive
                    ? "var(--color-nav-active-text)"
                    : "var(--color-text)",
                  background: isActive
                    ? "var(--color-nav-active-bg)"
                    : "transparent",
                  marginBottom: "0.35rem",
                  transition: "background 0.15s ease",
                  minHeight: "44px",
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <div style={{ marginTop: "1.25rem" }}>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: 700,
                color: "#ffffff",
                background: "var(--color-primary)",
                minHeight: "48px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              }}
            >
              Get Help
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: inline-flex !important;
          }
        }
        @media (min-width: 901px) {
          .nav-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
