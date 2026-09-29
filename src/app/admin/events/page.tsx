import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>Events</h1>
        <Link href="/admin/events/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", color: "white", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}>
          <Plus size={18} /> New Event
        </Link>
      </div>

      {events.length > 0 ? (
        <div style={{ borderRadius: "var(--radius-lg)", background: "var(--color-surface)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border-light)" }}>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 500, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.title}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{
                        fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.7rem", borderRadius: "var(--radius-full)",
                        background: event.status === "UPCOMING" ? "rgba(16, 185, 129, 0.1)" : event.status === "ONGOING" ? "rgba(59, 130, 246, 0.1)" : "rgba(100, 116, 139, 0.1)",
                        color: event.status === "UPCOMING" ? "#10b981" : event.status === "ONGOING" ? "#3b82f6" : "#64748b",
                      }}>
                        {event.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-muted)" }}>{formatDate(event.eventDate)}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--color-text-muted)" }}>{event.location || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <Link href={`/admin/events/${event.id}/edit`} style={{ padding: "0.4rem", color: "var(--color-text-muted)", textDecoration: "none" }} title="Edit">
                          <Edit size={16} />
                        </Link>
                        <Link href={`/events/${event.slug}`} target="_blank" style={{ padding: "0.4rem", color: "var(--color-primary)", textDecoration: "none" }} title="View">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-light)" }}>
          <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>No events yet. Create your first one!</p>
          <Link href="/admin/events/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", background: "var(--color-primary)", color: "white", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            <Plus size={18} /> Create Event
          </Link>
        </div>
      )}
    </div>
  );
}
