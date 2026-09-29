"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SEOFields from "@/components/admin/SEOFields";
import MediaUploader from "@/components/admin/MediaUploader";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!form.title || !form.content) return;
    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
          seo: seo.metaTitle || seo.metaDescription ? seo : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

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

      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          marginBottom: "2rem",
        }}
      >
        Create New Blog Post
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Title */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter blog title"
            style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }}
          />
        </div>

        {/* Cover Image */}
        <MediaUploader
          label="Cover Image"
          accept="image/*"
          currentUrl={form.coverImageUrl}
          onUpload={(url) => setForm({ ...form, coverImageUrl: url })}
        />

        {/* Cover Image Alt */}
        {form.coverImageUrl && (
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
              Image Alt Text
            </label>
            <input
              type="text"
              value={form.coverImageAlt}
              onChange={(e) => setForm({ ...form, coverImageAlt: e.target.value })}
              placeholder="Describe the image for accessibility & SEO"
              style={inputStyle}
            />
          </div>
        )}

        {/* Excerpt */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
            Excerpt
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Short summary for blog cards and SEO"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Content */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
            Content * (HTML supported)
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your blog content here... HTML tags are supported for formatting."
            rows={15}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: "0.88rem" }}
          />
        </div>

        {/* SEO Fields */}
        <SEOFields values={seo} onChange={setSeo} />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading || !form.title || !form.content}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.7rem 1.5rem",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={loading || !form.title || !form.content}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.7rem 1.5rem",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              border: "none",
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
