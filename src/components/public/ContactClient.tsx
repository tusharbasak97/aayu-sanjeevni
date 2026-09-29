"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ContactForm from "@/components/public/ContactForm";
import VoiceReader from "@/components/ui/VoiceReader";
import TiltCard from "@/components/ui/TiltCard";
import { Phone, Mail, MapPin, Clock, MessageCircle, AlertCircle } from "lucide-react";

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.from(".contact-hero-item", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. Info cards stagger
      gsap.from(".contact-card-anim", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.2,
      });

      // 3. Form container slide up
      gsap.from(".contact-form-wrapper", {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: "72px" }}>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          background: "rgba(30, 58, 95, 0.08)",
        }}
      >
        <span
          className="contact-hero-item"
          style={{
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.75rem",
            background: "rgba(30, 58, 95, 0.1)",
            padding: "0.3rem 0.85rem",
            borderRadius: "var(--radius-full)",
          }}
        >
          24x7 Assistance
        </span>

        <h1
          className="contact-hero-item"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          We Are Here to <span className="gradient-text">Help You & Your Family</span>
        </h1>

        <p
          className="contact-hero-item"
          style={{
            fontSize: "1.15rem",
            color: "var(--color-text-muted)",
            maxWidth: "680px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.8,
          }}
        >
          If you or someone in your family is ill and cannot afford treatment, do not hesitate to contact us immediately. If you cannot write, simply call our toll-free number.
        </p>

        {/* Voice Reader */}
        <div className="contact-hero-item">
          <VoiceReader
            text="If you or a family member needs free medical treatment, medicines, or surgery, please call our toll-free number 1800 200 8899. This service is completely free."
            label="Listen to Contact Instructions"
          />
        </div>
      </section>

      {/* Main Grid */}
      <section
        style={{
          padding: "3.5rem 1.5rem 5rem",
          maxWidth: "1160px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Left Column: Direct Call, WhatsApp & Info Cards */}
          <div>
            {/* Quick 1-Tap Action for Illiterate / Poor Patients */}
            <div
              className="contact-card-anim"
              style={{
                background: "var(--color-primary)",
                borderRadius: "var(--radius-xl)",
                padding: "1.75rem",
                color: "#ffffff",
                marginBottom: "2rem",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid rgba(20, 184, 166, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <AlertCircle size={20} style={{ color: "#93c5fd" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>
                  Direct Free Call
                </h3>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                No forms required. Our health assistants will speak to you in your language and help you immediately.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Toll-Free Direct Call Button */}
                <a
                  href="tel:18002008899"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "0.85rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-secondary)",
                    color: "#ffffff",
                    fontSize: "1rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <Phone size={18} />
                  <span>1800-200-8899 (Toll-Free Call)</span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href="https://wa.me/919800000000?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%AE%E0%A5%81%E0%A4%AB%E0%A5%8D%E0%A4%A4%20%E0%A4%87%E0%A4%B2%E0%A4%BE%E0%A4%9C%20%E0%A4%95%E0%A5%80%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "0.8rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    background: "#25D366",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Send WhatsApp Message</span>
                </a>
              </div>
            </div>

            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}
            >
              Contact Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  icon: <Phone size={20} />,
                  title: "Emergency Helpline / आपातकालीन हेल्पलाइन",
                  detail: "1800-200-8899 / +91 98XXX XXXXX",
                  subtext: "24 घंटे, 365 दिन सातों पहर उपलब्ध (24/7 Available)",
                  color: "#0d9488",
                  bg: "rgba(13, 148, 136, 0.1)",
                },
                {
                  icon: <Mail size={20} />,
                  title: "Official Email / आधिकारिक ईमेल",
                  detail: "contact@aayusanjeevni.org",
                  subtext: "24 घंटे में उत्तर दिया जाएगा (Replies in 24h)",
                  color: "#6366f1",
                  bg: "rgba(99, 102, 241, 0.1)",
                },
                {
                  icon: <MapPin size={20} />,
                  title: "Central Office & Camps",
                  detail: "New Delhi & Rural Health Centers Across India",
                  subtext: "UP, Bihar, MP, Rajasthan, Jharkhand, Odisha",
                  color: "#f59e0b",
                  bg: "rgba(245, 158, 11, 0.1)",
                },
                {
                  icon: <Clock size={20} />,
                  title: "Camp Timings",
                  detail: "9:00 AM to 5:00 PM",
                  subtext: "Emergency Helpline runs 24x7 continuously",
                  color: "#10b981",
                  bg: "rgba(16, 185, 129, 0.1)",
                },
              ].map((item) => (
                <div key={item.title} className="contact-card-anim">
                  <TiltCard
                    maxTilt={6}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "1.25rem",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border-light)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "var(--radius-md)",
                        background: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          marginBottom: "0.2rem",
                          color: "var(--color-text)",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {item.detail}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", margin: 0 }}>
                        {item.subtext}
                      </p>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact & Assistance Form */}
          <div className="contact-form-wrapper">
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}
            >
              Send Us a Message
            </h2>
            <div
              style={{
                padding: "2.25rem",
                borderRadius: "var(--radius-xl)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
