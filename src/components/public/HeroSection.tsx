"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/ui/MagneticButton";
import VoiceReader from "@/components/ui/VoiceReader";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Continuous Organic Orb Floating ──
      if (!prefersReducedMotion) {
        if (orb1Ref.current) {
          gsap.to(orb1Ref.current, {
            x: "+=40",
            y: "-=30",
            scale: 1.15,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
        if (orb2Ref.current) {
          gsap.to(orb2Ref.current, {
            x: "-=50",
            y: "+=35",
            scale: 1.2,
            duration: 7.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5,
          });
        }
      }

      // ── Coordinated Entrance Timeline ──
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 30, rotationX: 10 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.9 },
          "-=0.3"
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        );
      }

      // ── Live Animated Number Counters ──
      const statsObj = { count1: 0, count2: 0, count3: 0 };

      tl.to(
        statsObj,
        {
          count1: 10000,
          count2: 100,
          count3: 50,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (counter1Ref.current) {
              counter1Ref.current.textContent = `${Math.floor(
                statsObj.count1
              ).toLocaleString()}+`;
            }
            if (counter2Ref.current) {
              counter2Ref.current.textContent = `${Math.floor(
                statsObj.count2
              )}%`;
            }
            if (counter3Ref.current) {
              counter3Ref.current.textContent = `${Math.floor(
                statsObj.count3
              )}+`;
            }
          },
        },
        "-=0.4"
      );

      // Mouse Parallax on Hero Mesh
      if (!prefersReducedMotion && heroRef.current) {
        const heroEl = heroRef.current;
        const handleHeroMouse = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xFactor = (clientX / window.innerWidth - 0.5) * 30;
          const yFactor = (clientY / window.innerHeight - 0.5) * 30;

          if (orb1Ref.current) {
            gsap.to(orb1Ref.current, {
              x: xFactor * 0.8,
              y: yFactor * 0.8,
              duration: 1.5,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
          if (orb2Ref.current) {
            gsap.to(orb2Ref.current, {
              x: -xFactor * 0.6,
              y: -yFactor * 0.6,
              duration: 1.5,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
        };

        heroEl.addEventListener("mousemove", handleHeroMouse);
        return () => {
          heroEl.removeEventListener("mousemove", handleHeroMouse);
        };
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0b1426",
      }}
    >
      {/* Dynamic GSAP Animated Orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={orb1Ref}
          style={{
            position: "absolute",
            top: "12%",
            right: "12%",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(30, 58, 95, 0.45)",
            filter: "blur(20px)",
            willChange: "transform",
          }}
        />
        <div
          ref={orb2Ref}
          style={{
            position: "absolute",
            bottom: "18%",
            left: "8%",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.25)",
            filter: "blur(25px)",
            willChange: "transform",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "8rem 1.5rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
        }}
      >
        {/* Text Content */}
        <div style={{ maxWidth: "760px" }}>
          {/* Badge */}
          <div
            ref={badgeRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 1.15rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(30, 58, 95, 0.5)",
              border: "1px solid rgba(147, 197, 253, 0.25)",
              marginBottom: "1.75rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#93c5fd",
            }}
          >
            <Heart size={15} fill="currentColor" />
            Serving Humanity Since Day One
          </div>

          {/* Heading */}
          <h1
            ref={titleRef}
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "white",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Free, World-Class{" "}
            <span
              style={{
                color: "#60a5fa",
              }}
            >
              Healthcare
            </span>{" "}
            for Everyone
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: "#e2e8f0",
              marginBottom: "2.25rem",
              maxWidth: "640px",
            }}
          >
            We provide underprivileged individuals with top-tier medical
            diagnoses from renowned doctors — covering all costs, medicines,
            X-rays, and government registrations. Zero burden on the patient.
          </p>

          {/* CTAs with Magnetic Effect */}
          <div
            ref={ctaRef}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "3.5rem",
            }}
          >
            <MagneticButton strength={20}>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 2rem",
                  borderRadius: "var(--radius-full)",
                  background: "#2563eb",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  minHeight: "48px",
                  boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
                  transition: "box-shadow 0.2s",
                }}
              >
                Get Free Help <ArrowRight size={18} />
              </Link>
            </MagneticButton>

            <MagneticButton strength={15}>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 2rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: "48px",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                Our Mission
              </Link>
            </MagneticButton>

            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <VoiceReader
                text="Welcome to Aayu Sanjeevni. We provide every underprivileged citizen with free checkups, free medicines, X-rays, and free surgeries by senior doctors. Not a single rupee is taken from the patient."
                label="Listen to Introduction"
                variant="hero"
              />
            </div>
          </div>

          {/* Stats Counters */}
          <div
            ref={statsContainerRef}
            className="hero-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: <Users size={22} />,
                ref: counter1Ref,
                fallback: "10,000+",
                label: "Patients Helped",
              },
              {
                icon: <Shield size={22} />,
                ref: counter2Ref,
                fallback: "100%",
                label: "Free Treatment",
              },
              {
                icon: <Heart size={22} />,
                ref: counter3Ref,
                fallback: "50+",
                label: "Medical Camps",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(37, 99, 235, 0.15)",
                    border: "1px solid rgba(37, 99, 235, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#60a5fa",
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    ref={stat.ref}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 800,
                      fontSize: "1.35rem",
                      color: "white",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.fallback}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "var(--color-bg)",
          opacity: 0.05,
        }}
      />
    </section>
  );
}
