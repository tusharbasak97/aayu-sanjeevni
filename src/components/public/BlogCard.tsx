import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, User } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import TiltCard from "@/components/ui/TiltCard";
import VoiceReader from "@/components/ui/VoiceReader";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  publishedAt?: string | Date | null;
  author?: { name: string } | null;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  content,
  coverImageUrl,
  coverImageAlt,
  publishedAt,
  author,
}: BlogCardProps) {
  const description = excerpt || truncateText(content.replace(/<[^>]+>/g, ""), 140);

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
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "52%",
            background: "rgba(30, 58, 95, 0.1)",
          }}
        >
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={coverImageAlt || title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
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
            {publishedAt && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={14} />
                {formatDate(publishedAt)}
              </span>
            )}
            {author && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <User size={14} />
                {author.name}
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
              href={`/blog/${slug}`}
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
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              marginTop: "auto",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/blog/${slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              Read More <ArrowRight size={14} />
            </Link>

            <VoiceReader
              size="sm"
              text={`${title}. ${description}`}
              label="Listen to Article"
            />
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
