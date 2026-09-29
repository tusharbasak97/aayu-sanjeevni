"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventCard from "@/components/public/EventCard";
import VoiceReader from "@/components/ui/VoiceReader";
import { Calendar, Phone } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: Date | string;
  location: string | null;
  status: string;
  gallery: Array<{
    media?: {
      optimizedUrl?: string | null;
    } | null;
  }>;
}

interface EventsClientProps {
  events: EventItem[];
}

export default function EventsClient({ events }: EventsClientProps) {
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const upcoming = events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING");
  const past = events.filter((e) => e.status === "PAST");

  const displayedEvents =
    filter === "UPCOMING" ? upcoming : filter === "PAST" ? past : events;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.from(".events-hero-anim", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. Events card stagger
      gsap.from(".event-card-item", {
        scrollTrigger: {
          trigger: ".events-grid-wrapper",
          start: "top 80%",
        },
        y: 45,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filter]);

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
          className="events-hero-anim"
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
          Medical Camps & Schedule
        </span>

        <h1
          className="events-hero-anim"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          Free Medical Camps &{" "}
          <span className="gradient-text">Village Outreach</span>
        </h1>

        <p
          className="events-hero-anim"
          style={{
            fontSize: "1.15rem",
            color: "var(--color-text-muted)",
            maxWidth: "680px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.8,
          }}
        >
          Find the dates and locations of free medical camps being held in your nearest village or city. Specialist doctors, free medicines, and cataract screenings are available at all camps.
        </p>

        {/* Voice Reader */}
        <div className="events-hero-anim">
          <VoiceReader
            text="Information about upcoming medical camps of Aayu Sanjeevni is available here. All checkups and medicines at the camp are free. Any citizen can walk in directly without prior registration."
            label="Listen to Camp Details"
          />
        </div>
      </section>

      {/* Main Events Section */}
      <section
        style={{
          padding: "3rem 1.5rem 5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
            borderBottom: "1px solid var(--color-border-light)",
            paddingBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { key: "ALL", label: `All Camps (${events.length})` },
              { key: "UPCOMING", label: `Upcoming (${upcoming.length})` },
              { key: "PAST", label: `Past (${past.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as "ALL" | "UPCOMING" | "PAST")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: filter === tab.key ? "1.5px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: filter === tab.key ? "rgba(30, 58, 95, 0.1)" : "var(--color-surface)",
                  color: filter === tab.key ? "var(--color-primary-dark)" : "var(--color-text-muted)",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Help for poor people */}
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Helpline:{" "}
            <a
              href="tel:18002008899"
              style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}
            >
              1800-200-8899
            </a>{" "}
            (Toll-Free)
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid-wrapper">
          {displayedEvents.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {displayedEvents.map((event) => (
                <div key={event.id} className="event-card-item">
                  <EventCard
                    title={event.title}
                    slug={event.slug}
                    description={event.description}
                    eventDate={event.eventDate}
                    location={event.location}
                    status={event.status}
                    coverImage={event.gallery[0]?.media?.optimizedUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <Calendar size={40} style={{ color: "var(--color-primary)", margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                No Camps Found
              </h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
                New camps will be announced soon. You can call our toll-free number for more information.
              </p>
            </div>
          )}
        </div>

        {/* Request a Camp Banner for Rural Pradhans & Villagers */}
        <div
          style={{
            marginTop: "4rem",
            background: "var(--color-primary)",
            color: "#ffffff",
            padding: "2.5rem",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#93c5fd",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Village Outreach Request
            </span>
            <h3
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                fontWeight: 800,
                marginTop: "0.4rem",
                marginBottom: "0.5rem",
              }}
            >
              Does your village need a medical camp?
            </h3>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
                maxWidth: "600px",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Village heads, social organizations, or local citizens can directly contact us to organize a free Aayu Sanjeevni medical camp in their village or settlement.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-secondary)",
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Request Camp
            </Link>
            <a
              href="tel:18002008899"
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Phone size={15} /> 1800-200-8899
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
