"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle, X, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  label?: string;
}

export default function MediaUploader({
  onUpload,
  currentUrl,
  accept = "image/*,video/*",
  label = "Upload Media",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const url = data.data.optimizedUrl || data.data.originalUrl;
        setPreview(url);
        onUpload(url);
      } else {
        setError(data.error || "Upload failed");
        setPreview(currentUrl || null);
      }
    } catch {
      setError("Network error during upload");
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontSize: "0.85rem",
          fontWeight: 500,
        }}
      >
        {label}
      </label>

      {preview ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--color-border-light)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
          {uploading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          )}
          {!uploading && (
            <button
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "2rem",
            borderRadius: "var(--radius-md)",
            border: "2px dashed var(--color-border)",
            background: "var(--color-bg)",
            cursor: "pointer",
            transition: "border-color 0.2s",
            maxWidth: "400px",
          }}
        >
          {uploading ? (
            <Loader2 size={28} style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
          ) : (
            <>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(13, 148, 136, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                }}
              >
                {accept.includes("image") ? (
                  <ImageIcon size={22} />
                ) : (
                  <Upload size={22} />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--color-text)" }}>
                  Click to upload
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                  Images will be auto-optimized to WebP
                </p>
              </div>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
      )}

      {error && (
        <p style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {!uploading && preview && !error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginTop: "0.5rem",
            fontSize: "0.8rem",
            color: "#10b981",
          }}
        >
          <CheckCircle size={14} />
          Uploaded & optimized
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
