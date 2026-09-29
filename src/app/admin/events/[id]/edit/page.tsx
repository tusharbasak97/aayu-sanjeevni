"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SEOFields from "@/components/admin/SEOFields";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data.success) {
          const event = data.data;
          setForm({
            title: event.title,
            description: event.description,
            location: event.location || "",
            eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
            eventEndDate: event.eventEndDate ? new Date(event.eventEndDate).toISOString().slice(0, 16) : "",
            status: event.status,
          });
          if (event.seo) {
            setSeo({
              metaTitle: event.seo.metaTitle || "",
              metaDescription: event.seo.metaDescription || "",
              focusKeywords: event.seo.focusKeywords || "",
              canonicalUrl: event.seo.canonicalUrl || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
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
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error("Error deleting event:", error);
      setDeleting(false);
    }
  };

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

  if (fetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={32} style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <Link href="/admin/events" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>Edit Event</h1>
        <button onClick={handleDelete} disabled={deleting} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.08)", border: "none", color: "#ef4444", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
          <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }} />
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
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} />
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
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={12} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <SEOFields values={seo} onChange={setSeo} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)" }}>
          <button onClick={handleSubmit} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.5rem", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", border: "none", color: "white", fontWeight: 600, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)" }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
}
