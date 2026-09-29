import Link from "next/link";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0b1426",
        color: "#94a3b8",
        paddingTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "3rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Heart size={18} fill="white" />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "white",
                }}
              >
                Aayu Sanjeevni
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "300px" }}>
              Empowering underprivileged communities with free, world-class
              healthcare — because every life deserves the best medical care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Medical Camps", href: "/events" },
                { label: "Blog & News", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              Our Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Free Medical Diagnosis",
                "Pharmacy & Medicines",
                "X-Ray & Imaging",
                "Govt. Registration Help",
                "Medical Camps",
              ].map((service) => (
                <li
                  key={service}
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              Contact Us
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}
              >
                <Phone size={16} style={{ color: "var(--color-primary-light)", flexShrink: 0 }} />
                <span>+91 98XXX XXXXX</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}
              >
                <Mail size={16} style={{ color: "var(--color-primary-light)", flexShrink: 0 }} />
                <span>contact@aayusanjeevni.org</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "start", gap: "0.5rem", fontSize: "0.9rem" }}
              >
                <MapPin size={16} style={{ color: "var(--color-primary-light)", flexShrink: 0, marginTop: "3px" }} />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            padding: "1.5rem 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Aayu Sanjeevni. All rights reserved.
          </p>
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
