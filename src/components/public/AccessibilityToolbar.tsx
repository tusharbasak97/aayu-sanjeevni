"use client";

import { useState, useEffect } from "react";
import { Type, Moon, Sun } from "lucide-react";

export default function AccessibilityToolbar() {
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Initial read from localStorage or system preference in next tick
    const timer = setTimeout(() => {
      const savedFontSize = localStorage.getItem("aayu_font_size");
      const initialLargeFont = savedFontSize === "large";
      setIsLargeFont(initialLargeFont);
      if (initialLargeFont) {
        document.documentElement.classList.add("font-size-large");
      } else {
        document.documentElement.classList.remove("font-size-large");
      }

      const savedTheme = localStorage.getItem("aayu_theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;
      setIsDark(initialDark);
      if (initialDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, 0);

    // 2. Synchronize across multiple toolbar instances
    const handleFontSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLarge: boolean }>;
      if (customEvent.detail !== undefined) {
        setIsLargeFont(customEvent.detail.isLarge);
      }
    };

    const handleThemeSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark: boolean }>;
      if (customEvent.detail !== undefined) {
        setIsDark(customEvent.detail.isDark);
      }
    };

    window.addEventListener("aayu_font_sync", handleFontSync);
    window.addEventListener("aayu_theme_sync", handleThemeSync);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("aayu_font_sync", handleFontSync);
      window.removeEventListener("aayu_theme_sync", handleThemeSync);
    };
  }, []);

  const toggleFontSize = () => {
    const nextState = !isLargeFont;
    setIsLargeFont(nextState);

    if (nextState) {
      document.documentElement.classList.add("font-size-large");
      localStorage.setItem("aayu_font_size", "large");
    } else {
      document.documentElement.classList.remove("font-size-large");
      localStorage.setItem("aayu_font_size", "normal");
    }

    // Notify other instances
    window.dispatchEvent(
      new CustomEvent("aayu_font_sync", { detail: { isLarge: nextState } })
    );
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aayu_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aayu_theme", "light");
    }

    // Notify other instances
    window.dispatchEvent(
      new CustomEvent("aayu_theme_sync", { detail: { isDark: nextDark } })
    );
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(30, 58, 95, 0.06)",
        padding: "0.25rem 0.5rem",
        borderRadius: "var(--radius-full)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.16)"
          : "1px solid rgba(30, 58, 95, 0.18)",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Accessibility options"
    >
      {/* Font Size button (Normal / Large toggle) */}
      <button
        onClick={toggleFontSize}
        type="button"
        title={isLargeFont ? "Reset text size to standard" : "Increase text size across entire website"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          background: isLargeFont ? "var(--color-primary)" : "none",
          border: "none",
          cursor: "pointer",
          color: isLargeFont ? "#ffffff" : "var(--color-text)",
          fontSize: "0.82rem",
          fontWeight: 700,
          padding: "0.25rem 0.5rem",
          borderRadius: "var(--radius-sm)",
          transition: "all 0.2s ease",
          minHeight: "32px",
        }}
        aria-label={isLargeFont ? "Reset to normal font size" : "Scale up font size globally"}
        aria-pressed={isLargeFont}
      >
        <Type size={14} />
        <span>{isLargeFont ? "A+" : "A"}</span>
      </button>

      {/* Dark / Light Mode button */}
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDark ? "rgba(255, 255, 255, 0.12)" : "none",
          color: isDark ? "#fde047" : "var(--color-text)",
          border: "none",
          cursor: "pointer",
          padding: "0.3rem",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
        }}
        aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
        aria-pressed={isDark}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  );
}
