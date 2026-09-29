"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SEOFields from "@/components/admin/SEOFields";
import MediaUploader from "@/components/admin/MediaUploader";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImageUrl: "",
    coverImageAlt: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    focusKeywords: "",
    canonicalUrl: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.success) {
          const blog = data.data;
          setForm({
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt || "",
            coverImageUrl: blog.coverImageUrl || "",
            coverImageAlt: blog.coverImageAlt || "",
            status: blog.status,
          });
          if (blog.seo) {
            setSeo({
              metaTitle: blog.seo.metaTitle || "",
              metaDescription: blog.seo.metaDescription || "",
              focusKeywords: blog.seo.focusKeywords || "",
              canonicalUrl: blog.seo.canonicalUrl || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (status?: "DRAFT" | "PUBLISHED") => {
    if (!form.title || !form.content) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: status || form.status,
          seo: seo.metaTitle || seo.metaDescription ? seo : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeleting(true);

    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog:", error);
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
    transition: "border-color 0.2s",
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
      <Link
        href="/admin/blogs"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.85rem",
          color: "var(--color-text-muted)",
          textDecoration: "none",
          marginBottom: "1.5rem",
        }}
      >
        <ArrowLeft size={16} /> Back to Blogs
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Edit Blog Post
        </h1>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(239, 68, 68, 0.08)",
            border: "none",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }} />
        </div>

        <MediaUploader label="Cover Image" accept="image/*" currentUrl={form.coverImageUrl} onUpload={(url) => setForm({ ...form, coverImageUrl: url })} />

        {form.coverImageUrl && (
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Image Alt Text</label>
            <input type="text" value={form.coverImageAlt} onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })} style={inputStyle} />
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>Content * (HTML)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={15} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "0.88rem" }} />
        </div>

        <SEOFields values={seo} onChange={setSeo} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)" }}>
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.5rem", borderRadius: "var(--radius-md)",
              background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-text)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={loading}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.5rem", borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", border: "none", color: "white", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Update & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
