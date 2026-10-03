import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          marginBottom: "0.5rem",
        }}
      >
        Media Library
      </h1>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--color-text-muted)",
          marginBottom: "2rem",
        }}
      >
        All uploaded media is automatically optimized. Upload new media from the Blog or Event editors.
      </p>

      {media.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              className="card-hover"
              style={{
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "75%",
                  background: "var(--color-bg)",
                }}
              >
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.optimizedUrl}
                    alt={item.altText || item.originalName}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="200px"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(13, 148, 136, 0.1))",
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    🎬 Video
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: "0.4rem",
                    right: "0.4rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  {item.format}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: "0.75rem" }}>
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.originalName}
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-light)",
                  }}
                >
                  {item.sizeBytes
                    ? `${(item.sizeBytes / 1024).toFixed(1)} KB`
                    : ""}{" "}
                  · {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            No media uploaded yet.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
            Upload images and videos through the Blog or Event editors.
          </p>
        </div>
      )}
    </div>
  );
}
