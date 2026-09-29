import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import TiltCard from "@/components/ui/TiltCard";
import VoiceReader from "@/components/ui/VoiceReader";

interface EventCardProps {
  title: string;
  slug: string;
  description: string;
  eventDate: string | Date;
  location?: string | null;
  status: string;
  coverImage?: string | null;
}

export default function EventCard({
  title,
  slug,
  description,
  eventDate,
  location,
  status,
  coverImage,
}: EventCardProps) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    UPCOMING: { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" },
    ONGOING: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" },
    PAST: { bg: "rgba(100, 116, 139, 0.1)", text: "#64748b" },
  };

  const statusStyle = statusColors[status] || statusColors.UPCOMING;
  const plainDescription = description.replace(/<[^>]+>/g, "").trim();

  return (
    <TiltCard maxTilt={5}>
      <article
        className="card-hover"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
          height: "100%",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            background: "rgba(30, 58, 95, 0.1)",
          }}
        >
          {coverImage && (
            <Image
              src={coverImage}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <span
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              fontWeight: 600,
              background: statusStyle.bg,
              color: statusStyle.text,
              backdropFilter: "blur(8px)",
            }}
          >
            {status}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "0.75rem",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={14} />
              {formatDate(eventDate)}
            </span>
            {location && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <MapPin size={14} />
                {location}
              </span>
            )}
          </div>

          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            <Link
              href={`/events/${slug}`}
              style={{
                color: "var(--color-text)",
                textDecoration: "none",
              }}
            >
              {title}
            </Link>
          </h3>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              marginBottom: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {plainDescription}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/events/${slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                transition: "gap 0.2s",
              }}
            >
              View Details <ArrowRight size={14} />
            </Link>

            <VoiceReader
              size="sm"
              text={`${title}. Location: ${location || "To be announced"}. Date: ${formatDate(eventDate)}. ${plainDescription}`}
              label="Listen"
            />
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
