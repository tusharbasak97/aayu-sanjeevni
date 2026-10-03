import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { seo: true },
  });

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.seo?.metaTitle || event.title,
    description:
      event.seo?.metaDescription || event.description.slice(0, 160),
    keywords: event.seo?.focusKeywords?.split(",").map((k) => k.trim()),
    alternates: event.seo?.canonicalUrl
      ? { canonical: event.seo.canonicalUrl }
      : undefined,
    openGraph: {
      title: event.seo?.metaTitle || event.title,
      description:
        event.seo?.metaDescription || event.description.slice(0, 160),
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({
      select: { slug: true },
    });
    return events.map((event) => ({ slug: event.slug }));
  } catch {
    // DB unavailable at build time — pages will be generated on-demand
    return [];
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      seo: true,
      gallery: { include: { media: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event) notFound();

  const statusColors: Record<string, { bg: string; text: string }> = {
    UPCOMING: { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" },
    ONGOING: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" },
    PAST: { bg: "rgba(100, 116, 139, 0.1)", text: "#64748b" },
  };
  const statusStyle = statusColors[event.status] || statusColors.UPCOMING;

  // JSON-LD structured data for Event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description.slice(0, 300),
    startDate: event.eventDate.toISOString(),
    endDate: event.eventEndDate?.toISOString(),
    location: event.location
      ? { "@type": "Place", name: event.location }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: "Aayu Sanjeevni",
    },
    isAccessibleForFree: true,
  };

  return (
    <div style={{ paddingTop: "72px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1.5rem 5rem",
        }}
      >
        {/* Back link */}
        <Link
          href="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {/* Status Badge */}
        <span
          style={{
            display: "inline-block",
            padding: "0.3rem 1rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.8rem",
            fontWeight: 600,
            background: statusStyle.bg,
            color: statusStyle.text,
            marginBottom: "1rem",
          }}
        >
          {event.status}
        </span>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            marginBottom: "1.5rem",
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </h1>

        {/* Meta Info */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            <Calendar size={16} style={{ color: "var(--color-primary)" }} />
            {formatDate(event.eventDate)}
          </div>
          {event.eventEndDate && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              <Clock size={16} style={{ color: "var(--color-primary)" }} />
              Until {formatDate(event.eventEndDate)}
            </div>
          )}
          {event.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              <MapPin size={16} style={{ color: "var(--color-primary)" }} />
              {event.location}
            </div>
          )}
        </div>

        {/* Description */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }}
          style={{ marginBottom: "3rem" }}
        />

        {/* Gallery */}
        {event.gallery.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Event Gallery
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {event.gallery.map((item) => (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    paddingTop: "75%",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    background: "var(--color-border-light)",
                  }}
                >
                  {item.media.type === "IMAGE" ? (
                    <Image
                      src={item.media.optimizedUrl}
                      alt={item.media.altText || "Event photo"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  ) : (
                    <video
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      controls
                      preload="metadata"
                    >
                      <source
                        src={item.media.originalUrl}
                        type="video/webm"
                      />
                      <source
                        src={item.media.optimizedUrl}
                        type="video/mp4"
                      />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
