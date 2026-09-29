import HeroSection from "@/components/public/HeroSection";
import Link from "next/link";
import {
  Stethoscope,
  Pill,
  ScanLine,
  FileText,
  ArrowRight,
  Heart,
  Users,
  HandHeart,
} from "lucide-react";
import GsapScrollReveal from "@/components/ui/GsapScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Mission Section */}
      <section
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}
          >
            Our Mission
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            Healthcare is a{" "}
            <span className="gradient-text">Right, Not a Privilege</span>
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-text-muted)",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Every individual deserves access to world-class medical care
            regardless of their financial situation. Aayu Sanjeevni bridges this
            gap — connecting underprivileged patients with renowned doctors while
            covering all costs.
          </p>
        </div>

        {/* Impact Cards with GSAP Scroll Reveal and 3D Tilt */}
        <GsapScrollReveal
          stagger={0.15}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          {[
            {
              icon: <Heart size={28} />,
              title: "Zero Cost Healthcare",
              desc: "All diagnoses, medicines, X-rays, and treatments are completely free for patients.",
              color: "#ef4444",
              bg: "rgba(239, 68, 68, 0.08)",
            },
            {
              icon: <Users size={28} />,
              title: "Renowned Doctors",
              desc: "We partner with top-tier medical professionals who volunteer their expertise.",
              color: "#3b82f6",
              bg: "rgba(59, 130, 246, 0.08)",
            },
            {
              icon: <HandHeart size={28} />,
              title: "Complete Support",
              desc: "From government paperwork to follow-up care — we handle every detail so patients can focus on healing.",
              color: "#8b5cf6",
              bg: "rgba(139, 92, 246, 0.08)",
            },
          ].map((card) => (
            <TiltCard key={card.title} maxTilt={6}>
              <div
                className="card-hover"
                style={{
                  padding: "2rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-sm)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    marginBottom: "1.25rem",
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </TiltCard>
          ))}
        </GsapScrollReveal>
      </section>

      {/* Services Section */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--color-surface-hover)",
          borderTop: "1px solid var(--color-border-light)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              What We Offer
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              Our <span className="gradient-text">Services</span>
            </h2>
          </div>

          <GsapScrollReveal
            stagger={0.12}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: <Stethoscope size={28} />,
                title: "Medical Diagnosis",
                desc: "Comprehensive health checkups and diagnoses by top specialists, absolutely free.",
              },
              {
                icon: <Pill size={28} />,
                title: "Free Medicines",
                desc: "All prescribed medications provided at no cost — from antibiotics to long-term treatments.",
              },
              {
                icon: <ScanLine size={28} />,
                title: "X-Ray & Imaging",
                desc: "Advanced diagnostic imaging including X-rays, ultrasounds, and lab tests.",
              },
              {
                icon: <FileText size={28} />,
                title: "Govt. Registration",
                desc: "We handle all government paperwork — Aadhaar linking, scheme registration, and more.",
              },
            ].map((service) => (
              <TiltCard key={service.title} maxTilt={5}>
                <div
                  className="card-hover"
                  style={{
                    padding: "2rem",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--color-nav-active-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary)",
                      margin: "0 auto 1.25rem",
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {service.desc}
                  </p>
                </div>
              </TiltCard>
            ))}
          </GsapScrollReveal>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <MagneticButton strength={15}>
              <Link
                href="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.8rem 2rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                }}
              >
                All Services <ArrowRight size={16} />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <GsapScrollReveal direction="up" distance={40}>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "3.5rem 2rem",
              borderRadius: "var(--radius-xl)",
              background: "#0b1426",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(30, 58, 95, 0.25)",
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                Need Medical Assistance?
              </h2>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#cbd5e1",
                  marginBottom: "2rem",
                  maxWidth: "500px",
                  margin: "0 auto 2rem",
                  lineHeight: 1.7,
                }}
              >
                Reach out to us and we&apos;ll connect you with world-class doctors
                — completely free of charge.
              </p>
              <MagneticButton strength={20}>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.95rem 2.75rem",
                    borderRadius: "var(--radius-full)",
                    background: "white",
                    color: "#152b47",
                    fontWeight: 800,
                    textDecoration: "none",
                    fontSize: "1rem",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  Contact Us Today <ArrowRight size={18} />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </GsapScrollReveal>
      </section>
    </>
  );
}
