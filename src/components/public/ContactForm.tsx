"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setStatusMessage(data.message);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please try again.");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)" }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30, 58, 95, 0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)" }}>
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30, 58, 95, 0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)" }}>
          Phone (Optional)
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+91 XXXXX XXXXX"
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30, 58, 95, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)" }}>
          Message *
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us how we can help you..."
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30, 58, 95, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Status Message */}
      {status === "success" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "0.9rem" }}>
          <CheckCircle size={18} />
          {statusMessage}
        </div>
      )}
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontSize: "0.9rem" }}>
          <AlertCircle size={18} />
          {statusMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.85rem 2rem",
          borderRadius: "var(--radius-full)",
          background: status === "loading"
            ? "var(--color-text-light)"
            : "var(--color-primary)",
          color: "white",
          fontWeight: 600,
          fontSize: "1rem",
          border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          boxShadow: "0 4px 14px rgba(30, 58, 95, 0.3)",
          transition: "all 0.2s",
          fontFamily: "var(--font-body)",
          alignSelf: "flex-start",
        }}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
