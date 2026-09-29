"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Stethoscope,
  Pill,
  ScanLine,
  FileText,
  Ambulance,
  Eye,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Activity,
} from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import VoiceReader from "@/components/ui/VoiceReader";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    icon: <Stethoscope size={32} />,
    title: "Medical Diagnosis",
    titleHi: "Free Doctor Consultation",
    description:
      "Comprehensive health checkups and specialist consultations by renowned doctors. From general medicine to cardiology and pediatric care — we ensure accurate diagnoses for every patient.",
    features: [
      "Specialist Consultations",
      "General Health Checkups",
      "Chronic Disease Management",
      "Pediatric Care",
    ],
    color: "#0d9488",
    bg: "rgba(13, 148, 136, 0.08)",
  },
  {
    icon: <Pill size={32} />,
    title: "100% Free Pharmacy",
    titleHi: "Free Medicine Distribution",
    description:
      "All prescribed medications provided at absolutely no cost. We maintain a full pharmacy stocked with essential and specialized drugs for all conditions, ensuring no family goes without life-saving medication.",
    features: [
      "Essential Medicines",
      "Chronic Disease Drugs",
      "Antibiotics & Antivirals",
      "Supplements & Vitamins",
    ],
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.08)",
  },
  {
    icon: <ScanLine size={32} />,
    title: "X-Ray & Lab Tests",
    titleHi: "Digital X-Ray and Blood Tests",
    description:
      "Advanced diagnostic imaging services including digital X-rays, ultrasound scans, ECG, and pathology blood tests to support accurate medical evaluations without financial burden.",
    features: [
      "Digital X-Ray",
      "Blood Tests & Pathology",
      "Ultrasound Scans",
      "ECG Monitoring",
    ],
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
  },
  {
    icon: <Eye size={32} />,
    title: "Eye Surgery & Cataract",
    titleHi: "Free Cataract Surgery",
    description:
      "Dedicated vision restoration program restoring sight to elderly and poor villagers with advanced micro-incision cataract surgery, premium lens implants, and prescription glasses.",
    features: [
      "Micro-Incision Cataract Surgery",
      "Premium Intraocular Lens Free",
      "Free Prescription Glasses",
      "Post-operative Eye Care",
    ],
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.08)",
  },
  {
    icon: <Ambulance size={32} />,
    title: "Mobile Health Camps",
    titleHi: "Mobile Medical Van",
    description:
      "Regular outreach programs in remote, tribal, and rural communities. Our solar-powered mobile diagnostic clinics bring world-class healthcare right to the village doorstep.",
    features: [
      "Doorstep Rural Outreach",
      "Multi-Specialist Doctor Team",
      "On-the-spot Free Medicine",
      "Free Transport to Hospital",
    ],
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.08)",
  },
  {
    icon: <FileText size={32} />,
    title: "Ayushman & Govt Schemes",
    titleHi: "Government Schemes Help",
    description:
      "Illiterate and poor patients often miss government benefits due to paperwork. We assist with Ayushman Bharat (PM-JAY), state health cards, Aadhaar linking, and documentation.",
    features: [
      "Ayushman Bharat Registration",
      "Free Health Card Generation",
      "Aadhaar Documentation Help",
      "Cashless Hospital Empanelment",
    ],
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
  },
];

const patientJourneySteps = [
  {
    step: "01",
    title: "Walk-in or Call",
    titleEn: "Toll-Free Helpline",
    desc: "Come directly to the nearest camp or call 1800-200-8899. No documents or money required.",
    icon: <PhoneCall size={24} />,
    color: "#0d9488",
  },
  {
    step: "02",
    title: "Specialist Checkup",
    titleEn: "Diagnosis",
    desc: "Comprehensive physical examination, BP, Sugar, and ECG tests by senior doctors.",
    icon: <Stethoscope size={24} />,
    color: "#6366f1",
  },
  {
    step: "03",
    title: "Free Medicines",
    titleEn: "Pharmacy",
    desc: "Get all prescribed medicines completely free from our pharmacy counter on the spot.",
    icon: <Pill size={24} />,
    color: "#f59e0b",
  },
  {
    step: "04",
    title: "Surgery & Care",
    titleEn: "Hospitalization",
    desc: "If surgery is needed, we cover admission, operation, food, and medicines at partnered hospitals.",
    icon: <Activity size={24} />,
    color: "#10b981",
  },
];

export default function ServicesClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.from(".services-hero-item", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. Journey steps reveal
      gsap.from(".journey-step-card", {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.16,
        ease: "back.out(1.4)",
      });

      // 3. Service cards reveal
      gsap.from(".service-grid-card", {
        scrollTrigger: {
          trigger: ".services-grid-container",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: "72px" }}>
      {/* Hero Banner */}
      <section
        ref={heroRef}
        style={{
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          background: "rgba(30, 58, 95, 0.08)",
        }}
      >
        <span
          className="services-hero-item"
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
          Free Medical Services
        </span>
        <h1
          className="services-hero-item"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          Comprehensive, 100% Free <br />
          <span className="gradient-text">Healthcare for Every Citizen</span>
        </h1>
        <p
          className="services-hero-item"
          style={{
            fontSize: "1.15rem",
            color: "var(--color-text-muted)",
            maxWidth: "680px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.8,
          }}
        >
          Diagnosis, specialist consultations, blood tests, X-rays, medicines, and complex surgeries — everything is completely free. Not a single penny is charged from any underprivileged patient.
        </p>

        {/* Voice Reader button */}
        <div className="services-hero-item">
          <VoiceReader
            text="All services of Aayu Sanjeevni are 100% free for the poor and needy. This includes doctor consultations, X-rays, lab tests, medicines, and surgeries for cataracts or heart conditions."
            label="Listen to Services Overview"
          />
        </div>
      </section>

      {/* Visual Step-by-Step Guide for Illiterate / Poor Patients */}
      <section
        ref={stepsRef}
        style={{
          padding: "4rem 1.5rem",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "rgba(30, 58, 95, 0.1)",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              Easy 4-Step Process
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              How It Works
            </h2>
              Follow these 4 simple steps to receive free medical treatment without any hassle:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {patientJourneySteps.map((step) => (
              <div key={step.step} className="journey-step-card">
                <TiltCard
                  maxTilt={8}
                  style={{
                    padding: "2rem",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      color: "rgba(30, 58, 95, 0.15)",
                    }}
                  >
                    {step.step}
                  </div>

                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "var(--radius-lg)",
                      background: `${step.color}15`,
                      color: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {step.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--color-text)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--color-primary)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {step.titleEn}
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid with 3D Tilt & Voice */}
      <section
        className="services-grid-container"
        style={{ padding: "4rem 1.5rem 5rem", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800 }}>
            Our Medical <span className="gradient-text">Offerings</span>
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            Click on any service to learn details or listen to an audio explanation
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {services.map((service) => (
            <div key={service.title} className="service-grid-card">
              <TiltCard
                maxTilt={6}
                glare={true}
                style={{
                  height: "100%",
                  padding: "2.25rem",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-md)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Service Icon */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "var(--radius-lg)",
                      background: service.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: service.color,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {service.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {service.title}
                  </h3>


                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.7,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {service.description}
                  </p>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1.5rem 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        style={{
                          fontSize: "0.84rem",
                          color: "var(--color-text)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <CheckCircle2 size={15} style={{ color: service.color, flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Audio Voice Reader */}
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--color-border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <VoiceReader
                    size="sm"
                    text={`${service.title}. ${service.description}`}
                    label="Listen (Audio)"
                  />
                  <Link
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: service.color,
                      textDecoration: "none",
                    }}
                  >
                    Get Help <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
