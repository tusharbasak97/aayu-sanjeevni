"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  Target,
  Eye,
  Users,
  Shield,
  Award,
  Globe,
  Star,
  Quote,
  CheckCircle,
} from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import VoiceReader from "@/components/ui/VoiceReader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    id: "ramu",
    name: "Ramu Kaka",
    age: "64 Years",
    location: "Sitapur, UP",
    condition: "Bilateral Cataract Surgery",
    quoteEn:
      "I had lost my vision for 3 years and could no longer farm. Aayu Sanjeevni tested me, took me to the hospital for 100% free cataract surgery, and gave medicines. Today I can see my family again.",
    outcome: "100% Vision Restored (₹0 cost)",
    rating: 5,
    tag: "Eye Care",
    avatarBg: "#0d9488",
  },
  {
    id: "anita",
    name: "Anita Devi",
    age: "42 Years",
    location: "Samastipur, Bihar",
    condition: "Complex Tumor Surgery",
    quoteEn:
      "Private hospitals asked for 4 lakhs which my poor family could never afford. Aayu Sanjeevni arranged my surgery, hospital stay, and 6 months of medicines completely free. They gave me a second life.",
    outcome: "Fully Recovered",
    rating: 5,
    tag: "Surgery & Care",
    avatarBg: "#6366f1",
  },
  {
    id: "aarav",
    name: "Master Aarav's Father",
    age: "7 Year Old Child",
    location: "Mandla, MP",
    condition: "Pediatric VSD Heart Surgery",
    quoteEn:
      "My 7-year-old had a hole in his heart. As daily-wage laborers, we had lost hope. The foundation coordinated pediatric open-heart surgery at a top hospital at zero cost. Today my son is running and going to school.",
    outcome: "Life Saved",
    rating: 5,
    tag: "Pediatric Cardiac",
    avatarBg: "#ef4444",
  },
  {
    id: "doctor",
    name: "Dr. Arvind Mehta",
    age: "AIIMS New Delhi",
    location: "Volunteer Doctor",
    condition: "25+ Years Medical Experience",
    quoteEn:
      "Volunteering with Aayu Sanjeevni in rural camps has been the most fulfilling work of my medical career. Every underprivileged patient receives the exact same gold-standard medical care as a private VIP.",
    outcome: "150+ Volunteer Doctors",
    rating: 5,
    tag: "Doctor's Note",
    avatarBg: "#f59e0b",
  },
];

const timelineMilestones = [
  {
    year: "2020",
    title: "The Genesis in Pandemic",
    desc: "Started as an emergency relief taskforce delivering oxygen, life-saving medicines, and tele-consults to 5,000+ stranded migrant families.",
  },
  {
    year: "2022",
    title: "10,000+ Free Surgeries Milestone",
    desc: "Partnered with premier hospital chains to conduct free cardiac, eye cataract, and pediatric procedures with zero financial burden on patients.",
  },
  {
    year: "2024",
    title: "Mobile Hospital Fleet Launch",
    desc: "Deployed solar-powered mobile diagnostic vans equipped with digital X-Ray, ultrasound, and pharmacy into remote rural districts of UP, Bihar, and MP.",
  },
  {
    year: "Today",
    title: "Universal Care & Digital Inclusion",
    desc: "Serving 50,000+ patients annually across 12 Indian states with multi-lingual assistance and door-to-door follow-up healthcare.",
  },
];

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.from(".hero-anim-item", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. Timeline cards scroll animation
      gsap.from(".timeline-card", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
      });

      // 3. Values cards scroll animation
      gsap.from(".value-card", {
        scrollTrigger: {
          trigger: ".values-section",
          start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
      });

      // 4. Testimonials cards scroll animation
      gsap.from(".testimonial-card-anim", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: "72px" }}>
      {/* Hero Banner with GSAP & Voice Reader */}
      <section
        ref={heroRef}
        style={{
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          background: "rgba(30, 58, 95, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            className="hero-anim-item"
            style={{
              display: "inline-block",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.75rem",
              background: "rgba(30, 58, 95, 0.1)",
              padding: "0.3rem 0.9rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            About Aayu Sanjeevni
          </span>

          <h1
            className="hero-anim-item"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              marginBottom: "1.25rem",
              lineHeight: 1.15,
            }}
          >
            A Life-Saving Promise for <br />
            <span className="gradient-text">India&apos;s Most Vulnerable</span>
          </h1>

          <p
            className="hero-anim-item"
            style={{
              fontSize: "1.15rem",
              color: "var(--color-text-muted)",
              maxWidth: "680px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.8,
            }}
          >
            Aayu Sanjeevni has one single mission: to ensure no underprivileged or uneducated citizen loses their life due to a lack of money. We provide world-class diagnoses, free medicines, and successful surgeries.
          </p>

          {/* Voice Reader button for illiterate visitors */}
          <div className="hero-anim-item" style={{ marginBottom: "1.5rem" }}>
            <VoiceReader
              text="The goal of the Aayu Sanjeevni foundation is to provide 100% free, high-quality treatment, medicines, and surgeries to every poor and needy person in India. Not a single rupee is taken from any patient."
              label="Listen to our Story"
            />
          </div>

          {/* Key Impact Metric Badges */}
          <div
            className="hero-anim-item"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            {[
              { num: "50,000+", label: "Patients Healed" },
              { num: "12,000+", label: "Free Surgeries" },
              { num: "₹0", label: "Cost to Patient" },
              { num: "150+", label: "Top Specialists" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--color-surface)",
                  padding: "0.85rem 1.4rem",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-sm)",
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    color: "var(--color-primary)",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {stat.num}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)" }}>
                  {stat.label}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Mission */}
          <TiltCard
            maxTilt={6}
            glare={true}
            style={{
              padding: "2.5rem",
              borderRadius: "var(--radius-xl)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                background: "rgba(13, 148, 136, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
                marginBottom: "1.25rem",
              }}
            >
              <Target size={28} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Our Mission
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              To eliminate healthcare inequality by providing underprivileged individuals with free,
              top-tier medical diagnoses, treatments, medicines, and complete administrative support
              — ensuring zero burden on the patient, financially and emotionally.
            </p>
            <div style={{ marginTop: "1rem" }}>
              <VoiceReader
                size="sm"
                text="Our Mission: To eradicate inequality in healthcare. We aim to provide free checkups, medicines, and hospital surgeries to every underprivileged citizen."
                label="Listen to Mission"
              />
            </div>
          </TiltCard>

          {/* Vision */}
          <TiltCard
            maxTilt={6}
            glare={true}
            style={{
              padding: "2.5rem",
              borderRadius: "var(--radius-xl)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                background: "rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-secondary)",
                marginBottom: "1.25rem",
              }}
            >
              <Eye size={28} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Our Vision
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              A world where access to quality healthcare is universal — where no child, parent, or
              elderly person suffers simply because they cannot afford hospital charges. We envision
              a compassionate society leaving no one behind.
            </p>
            <div style={{ marginTop: "1rem" }}>
              <VoiceReader
                size="sm"
                text="Our Vision: A society where no human dies due to a lack of money. Healthcare is a fundamental right of every Indian."
                label="Listen to Vision"
              />
            </div>
          </TiltCard>
        </div>
      </section>

      {/* NEW TESTIMONIALS SECTION (Requested by User) */}
      <section
        ref={testimonialsRef}
        style={{
          padding: "5rem 1.5rem",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border-light)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "rgba(30, 58, 95, 0.1)",
                padding: "0.3rem 0.8rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              Real Stories of Hope
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)",
                fontWeight: 800,
                marginTop: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              Saved Lives, Restored <span className="gradient-text">Smiles</span>
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--color-text-muted)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Hear directly from the underprivileged families and doctors whose lives have been
              transformed through 100% free care.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "2rem",
            }}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card-anim">
                <TiltCard
                  maxTilt={8}
                  glare={true}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "2rem",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-light)",
                    boxShadow: "var(--shadow-md)",
                    position: "relative",
                  }}
                >
                  <div>
                    {/* Top Row: Tag & Rating */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.65rem",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(30, 58, 95, 0.1)",
                          color: "var(--color-primary-dark)",
                        }}
                      >
                        {t.tag}
                      </span>
                      <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={15} fill="#f59e0b" />
                        ))}
                      </div>
                    </div>

                    <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                      <Quote
                        size={28}
                        style={{
                          position: "absolute",
                          top: -10,
                          left: -6,
                          opacity: 0.12,
                          color: "var(--color-primary)",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                          color: "var(--color-text)",
                          fontStyle: "italic",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        &ldquo;{t.quoteEn}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Footer of Card: Person Details & Audio Voice Reader */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--color-border-light)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: t.avatarBg,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
                            {t.name}
                          </h4>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                            {t.location}
                          </span>
                        </div>
                      </div>

                      {/* Condition badge */}
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: "var(--color-success)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <CheckCircle size={13} /> {t.outcome}
                      </span>
                    </div>

                    {/* Audio Reader for illiterate patients */}
                    <div style={{ textAlign: "right" }}>
                      <VoiceReader
                        size="sm"
                        text={`${t.name}, ${t.location}. ${t.quoteEn}`}
                        label="Listen (Audio)"
                      />
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section
        ref={timelineRef}
        style={{ padding: "4rem 1.5rem", maxWidth: "1000px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800 }}>
            Our Journey of <span className="gradient-text">Hope & Healing</span>
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            From pandemic emergency relief to full-fledged healthcare for millions
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {timelineMilestones.map((item) => (
            <div
              key={item.year}
              className="timeline-card"
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.75rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-sm)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(30, 58, 95, 0.1)",
                  flexShrink: 0,
                }}
              >
                {item.year}
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section
        className="values-section"
        style={{
          padding: "4rem 1.5rem",
          background: "var(--color-surface)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Our Core <span className="gradient-text">Values</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: <Heart size={24} />,
                title: "Compassion",
                desc: "Every decision is rooted in deep empathy and genuine care for vulnerable families.",
                color: "#ef4444",
                bg: "rgba(239, 68, 68, 0.08)",
              },
              {
                icon: <Shield size={24} />,
                title: "Integrity",
                desc: "100% financial and clinical transparency. Every donation saves verified lives.",
                color: "#3b82f6",
                bg: "rgba(59, 130, 246, 0.08)",
              },
              {
                icon: <Award size={24} />,
                title: "Excellence",
                desc: "No compromise in quality. Only board-certified specialists and safe medicines.",
                color: "#f59e0b",
                bg: "rgba(245, 158, 11, 0.08)",
              },
              {
                icon: <Users size={24} />,
                title: "Community",
                desc: "Uniting local health workers, voluntary surgeons, and donors for maximum impact.",
                color: "#8b5cf6",
                bg: "rgba(139, 92, 246, 0.08)",
              },
              {
                icon: <Globe size={24} />,
                title: "Accessibility",
                desc: "Reaching the most remote rural villages where hospitals do not exist.",
                color: "#10b981",
                bg: "rgba(16, 185, 129, 0.08)",
              },
            ].map((value) => (
              <div key={value.title} className="value-card">
                <TiltCard
                  maxTilt={10}
                  style={{
                    padding: "1.75rem",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-light)",
                    boxShadow: "var(--shadow-sm)",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-md)",
                      background: value.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: value.color,
                      marginBottom: "1rem",
                    }}
                  >
                    {value.icon}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    {value.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.86rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {value.desc}
                  </p>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
