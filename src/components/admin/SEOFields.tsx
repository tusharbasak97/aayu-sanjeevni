"use client";

import { Search } from "lucide-react";

export interface SEOValues {
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string;
  canonicalUrl?: string;
}

interface SEOFieldsProps {
  values: SEOValues;
  onChange: (values: {
    metaTitle: string;
    metaDescription: string;
    focusKeywords: string;
    canonicalUrl: string;
  }) => void;
}

export default function SEOFields({ values, onChange }: SEOFieldsProps) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.85rem",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const updateField = (field: keyof SEOValues, val: string) => {
    onChange({
      metaTitle: values.metaTitle || "",
      metaDescription: values.metaDescription || "",
      focusKeywords: values.focusKeywords || "",
      canonicalUrl: values.canonicalUrl || "",
      [field]: val,
    });
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <Search size={18} style={{ color: "var(--color-primary)" }} />
        <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>SEO Settings</h3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
            }}
          >
            Meta Title{" "}
            <span style={{ color: "var(--color-text-light)" }}>
              ({(values.metaTitle?.length || 0)}/60)
            </span>
          </label>
          <input
            type="text"
            value={values.metaTitle || ""}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            placeholder="SEO-optimized title (max 60 chars)"
            maxLength={60}
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
            }}
          >
            Meta Description{" "}
            <span style={{ color: "var(--color-text-light)" }}>
              ({(values.metaDescription?.length || 0)}/160)
            </span>
          </label>
          <textarea
            value={values.metaDescription || ""}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            placeholder="Compelling description for search results (max 160 chars)"
            maxLength={160}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
            }}
          >
            Focus Keywords
          </label>
          <input
            type="text"
            value={values.focusKeywords || ""}
            onChange={(e) => updateField("focusKeywords", e.target.value)}
            placeholder="healthcare, NGO, free medical camp (comma separated)"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
            }}
          >
            Canonical URL
          </label>
          <input
            type="url"
            value={values.canonicalUrl || ""}
            onChange={(e) => updateField("canonicalUrl", e.target.value)}
            placeholder="https://aayusanjeevni.org/blog/your-post"
            style={inputStyle}
          />
        </div>
      </div>

      {/* SEO Preview */}
      {(values.metaTitle || values.metaDescription) && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--color-text-light)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            Search Preview
          </p>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1a0dab",
              marginBottom: "0.15rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {values.metaTitle || "Page Title"}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#006621",
              marginBottom: "0.15rem",
            }}
          >
            {values.canonicalUrl || "https://aayusanjeevni.org/..."}
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#545454",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {values.metaDescription || "Meta description will appear here..."}
          </p>
        </div>
      )}
    </div>
  );
}
