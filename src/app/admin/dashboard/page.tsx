import { prisma } from "@/lib/prisma";
import { FileText, CalendarDays, Image as ImageIcon, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [blogCount, eventCount, mediaCount, publishedBlogs] =
    await Promise.all([
      prisma.blog.count(),
      prisma.event.count(),
      prisma.media.count(),
      prisma.blog.count({ where: { status: "PUBLISHED" } }),
    ]);

  const recentBlogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, createdAt: true },
  });

  const recentEvents = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, eventDate: true },
  });

  const stats = [
    {
      icon: <FileText size={24} />,
      label: "Blog Posts",
      value: blogCount,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.08)",
      href: "/admin/blogs",
    },
    {
      icon: <CalendarDays size={24} />,
      label: "Events",
      value: eventCount,
      color: "#0d9488",
      bg: "rgba(13, 148, 136, 0.08)",
      href: "/admin/events",
    },
    {
      icon: <ImageIcon size={24} />,
      label: "Media Files",
      value: mediaCount,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.08)",
      href: "/admin/media",
    },
    {
      icon: <TrendingUp size={24} />,
      label: "Published",
      value: publishedBlogs,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.08)",
      href: "/admin/blogs",
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          marginBottom: "2rem",
        }}
      >
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              className="card-hover"
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  marginBottom: "1rem",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-text)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Recent Blogs */}
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Recent Blogs</h2>
            <Link
              href="/admin/blogs/new"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                padding: "0.3rem 0.85rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(13, 148, 136, 0.08)",
              }}
            >
              + New
            </Link>
          </div>
          {recentBlogs.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {recentBlogs.map((blog) => (
                <li
                  key={blog.id}
                  style={{
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--color-border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text)",
                      textDecoration: "none",
                      fontWeight: 500,
                      flex: 1,
                      marginRight: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog.title}
                  </Link>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "var(--radius-full)",
                      background:
                        blog.status === "PUBLISHED"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      color:
                        blog.status === "PUBLISHED" ? "#10b981" : "#f59e0b",
                      flexShrink: 0,
                    }}
                  >
                    {blog.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", textAlign: "center", padding: "2rem 0" }}>
              No blog posts yet
            </p>
          )}
        </div>

        {/* Recent Events */}
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Recent Events</h2>
            <Link
              href="/admin/events/new"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                padding: "0.3rem 0.85rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(13, 148, 136, 0.08)",
              }}
            >
              + New
            </Link>
          </div>
          {recentEvents.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {recentEvents.map((event) => (
                <li
                  key={event.id}
                  style={{
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--color-border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text)",
                      textDecoration: "none",
                      fontWeight: 500,
                      flex: 1,
                      marginRight: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {event.title}
                  </Link>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "var(--radius-full)",
                      background:
                        event.status === "UPCOMING"
                          ? "rgba(16, 185, 129, 0.1)"
                          : event.status === "ONGOING"
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(100, 116, 139, 0.1)",
                      color:
                        event.status === "UPCOMING"
                          ? "#10b981"
                          : event.status === "ONGOING"
                          ? "#3b82f6"
                          : "#64748b",
                      flexShrink: 0,
                    }}
                  >
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", textAlign: "center", padding: "2rem 0" }}>
              No events yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
