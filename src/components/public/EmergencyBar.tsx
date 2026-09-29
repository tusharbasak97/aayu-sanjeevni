"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, X } from "lucide-react";

export default function EmergencyBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside
      role="complementary"
      aria-label="24x7 Free Emergency Helpline"
      className="emergency-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        background: "#080e1b",
        color: "#ffffff",
        padding: "0.6rem 1.25rem",
        borderTop: "2px solid #2563eb",
        boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        fontFamily: "var(--font-heading)",
      }}
    >
      {/* Left: Emergency Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0 }}>
        <span
          style={{
            position: "relative",
            display: "flex",
            width: "12px",
            height: "12px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "#ef4444",
              animation: "emergency-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              opacity: 0.75,
            }}
          />
          <span
            style={{
              position: "relative",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#dc2626",
            }}
          />
        </span>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          <span style={{ color: "#e2e8f0" }}>24x7 FREE HELPLINE:</span>{" "}
          <a
            href="tel:18002008899"
            style={{
              color: "#93c5fd",
              fontWeight: 800,
              textDecoration: "underline",
              whiteSpace: "nowrap",
            }}
          >
            1800-200-8899
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="emergency-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          flexWrap: "wrap",
        }}
      >
        {/* Direct Call Button */}
        <a
          href="tel:18002008899"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem",
            background: "#10b981",
            color: "#ffffff",
            padding: "0.45rem 1rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            minHeight: "38px",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
            transition: "transform 0.15s ease",
          }}
          title="Direct Toll-Free Phone Call"
        >
          <Phone size={15} />
          <span>Call Free</span>
        </a>

        {/* WhatsApp Assistance */}
        <a
          href="https://wa.me/919800000000?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%AE%E0%A5%81%E0%A4%AB%E0%A5%8D%E0%A4%A4%20%E0%A4%87%E0%A4%B2%E0%A4%BE%E0%A4%9C%20%E0%A4%B5%20%E0%A4%95%E0%A5%88%E0%A4%82%E0%A4%AA%20%E0%A4%95%E0%A5%80%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem",
            background: "#25D366",
            color: "#ffffff",
            padding: "0.45rem 1rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            minHeight: "38px",
            boxShadow: "0 2px 8px rgba(37, 211, 102, 0.4)",
            transition: "transform 0.15s ease",
          }}
          title="Chat on WhatsApp"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </a>

        {/* Locate nearest camp */}
        <Link
          href="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            padding: "0.45rem 0.9rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            minHeight: "38px",
            border: "1px solid rgba(255, 255, 255, 0.22)",
          }}
        >
          <MapPin size={15} />
          <span>Find Camp</span>
        </Link>

        {/* Dismiss Button with min 40x40px touch area */}
        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-sm)",
            marginLeft: "0.2rem",
          }}
          aria-label="Dismiss emergency helpline bar"
          title="Dismiss helpline"
        >
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        @keyframes emergency-ping {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .emergency-bar {
            padding: 0.65rem 1rem !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.5rem !important;
          }
          .emergency-actions {
            justifyContent: space-between !important;
            width: 100% !important;
          }
          .emergency-actions a {
            flex: 1 !important;
            padding: 0.45rem 0.5rem !important;
            font-size: 0.78rem !important;
          }
        }
      `}</style>
    </aside>
  );
}
