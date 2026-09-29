"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SEOFields from "@/components/admin/SEOFields";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    eventEndDate: "",
    status: "UPCOMING" as "UPCOMING" | "ONGOING" | "PAST",
  });
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    focusKeywords: "",
    canonicalUrl: "",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-body)",
    outline: "none",
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.eventDate) return;
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seo: seo.metaTitle || seo.metaDescription ? seo : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/events");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <Link href="/admin/events" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "2rem" }}>
        Create New Event
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Event Date *</label>
            <input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>End Date</label>
            <input type="datetime-local" value={form.eventEndDate} onChange={(e) => setForm({ ...form, eventEndDate: e.target.value })} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Event location" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "UPCOMING" | "ONGOING" | "PAST" })} style={inputStyle}>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="PAST">Past</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Description * (HTML supported)</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the event details..." rows={12} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <SEOFields values={seo} onChange={setSeo} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)" }}>
          <button onClick={handleSubmit} disabled={loading || !form.title || !form.description || !form.eventDate} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.5rem", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", border: "none", color: "white", fontWeight: 600, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)" }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
