"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { Globe, Check, Volume2 } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  voiceLang: string; // BCP 47 language tag for SpeechSynthesis
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", region: "All India", voiceLang: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "उत्तर भारत (North India)", voiceLang: "hi-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "পশ্চিমবঙ্গ (West Bengal)", voiceLang: "bn-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", region: "महाराष्ट्र (Maharashtra)", voiceLang: "mr-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "ఆంధ్రప్రదేశ్ / తెలంగాణ", voiceLang: "te-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "தமிழ்நாடு (Tamil Nadu)", voiceLang: "ta-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "ગુજરાત (Gujarat)", voiceLang: "gu-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "ಕರ್ನಾಟಕ (Karnataka)", voiceLang: "kn-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "കേരളം (Kerala)", voiceLang: "ml-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "ਪੰਜਾਬ (Punjab)", voiceLang: "pa-IN" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "ଓଡ଼ିଶା (Odisha)", voiceLang: "or-IN" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "اردو बोलने वाले", voiceLang: "ur-IN" },
];

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Function to safely set translation cookies
function setTranslationCookie(langCode: string) {
  if (typeof document === "undefined") return;
  if (langCode === "en") {
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    if (window.location.hostname && !window.location.hostname.includes("localhost")) {
      document.cookie = `googtrans=; domain=.${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  } else {
    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    if (window.location.hostname && !window.location.hostname.includes("localhost")) {
      document.cookie = `googtrans=${val}; domain=.${window.location.hostname}; path=/;`;
    }
  }
}

export default function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Helper to re-trigger Google Translate on demand
  const triggerTranslation = useCallback((langCode: string) => {
    if (!langCode || langCode === "en") return;
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      if (combo.value !== langCode) {
        combo.value = langCode;
      }
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  // 1. Initialize script and restore language preference
  useEffect(() => {
    // Read from localStorage first, then cookie
    let activeLang = "en";
    const saved = localStorage.getItem("aayu_selected_language");
    if (saved && saved !== "en") {
      activeLang = saved;
    } else {
      const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
      if (match && match[1] && match[1] !== "en") {
        activeLang = match[1];
      }
    }

    if (activeLang !== "en") {
      setTimeout(() => setSelectedLang(activeLang), 0);
      setTranslationCookie(activeLang);
    }

    // Initialize Google Translate Script
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: INDIAN_LANGUAGES.map((l) => l.code).join(","),
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // Apply saved language after init
          if (activeLang !== "en") {
            setTimeout(() => triggerTranslation(activeLang), 600);
          }
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (activeLang !== "en") {
      setTimeout(() => triggerTranslation(activeLang), 300);
    }
  }, [triggerTranslation]);

  // 2. Fix Issue #5: When ANY button or link is clicked, or pathname changes,
  // ensure the selected language NEVER reverts to English!
  useEffect(() => {
    if (selectedLang === "en") return;

    let timer: NodeJS.Timeout;

    // A. Re-translate on route change
    timer = setTimeout(() => {
      triggerTranslation(selectedLang);
    }, 250);

    // B. Re-translate on interactive button/link clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // If clicked inside language selector, do nothing
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;

      // If a button, link, tab, or card was clicked
      const isInteractive = target.closest("button, a, [role='button'], [role='tab'], input, select");
      if (isInteractive) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          triggerTranslation(selectedLang);
        }, 180);
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [selectedLang, pathname, triggerTranslation]);

  const handleLanguageChange = useCallback((langCode: string) => {
    setIsTranslating(true);
    setSelectedLang(langCode);
    localStorage.setItem("aayu_selected_language", langCode);
    setTranslationCookie(langCode);

    // Notify speech synthesis & other components
    window.dispatchEvent(
      new CustomEvent("aayu_language_change", { detail: { lang: langCode } })
    );

    if (langCode === "en") {
      // Clear cookies and reload for pure clean English
      setTimeout(() => window.location.reload(), 150);
      return;
    }

    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      setTimeout(() => {
        setIsTranslating(false);
        setIsOpen(false);
      }, 500);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }, []);

  const currentOption = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  return (
    <div ref={dropdownRef} style={{ position: "relative", zIndex: 60 }}>
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Language Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current language: ${currentOption.name}. Click to change.`}
        aria-expanded={isOpen}
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.45rem 0.85rem",
          borderRadius: "var(--radius-full)",
          background: isOpen ? "var(--color-nav-active-bg)" : "rgba(255, 255, 255, 0.08)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "var(--shadow-sm)",
          minHeight: "36px",
        }}
        title="Choose Indian Language"
      >
        <Globe size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.01em" }}>
          {currentOption.name}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--color-text-muted)",
            fontWeight: 500,
          }}
        >
          ({currentOption.code.toUpperCase()})
        </span>
      </button>

      {/* Modal / Dropdown Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 998,
          }}
        />
      )}

      {/* Language Picker Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: "clamp(290px, 92vw, 420px)",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            padding: "1.25rem",
            zIndex: 999,
            animation: "fadeInUp 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              paddingBottom: "0.85rem",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--color-border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Globe size={18} style={{ color: "var(--color-primary)" }} />
                <h4
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--color-text)",
                  }}
                >
                  Choose Language
                </h4>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-text-muted)",
                  margin: "0.2rem 0 0",
                }}
              >
                Select your Indian regional language
              </p>
            </div>
          </div>

          {/* Quick Notice for illiterate / poor patients */}
          <div
            style={{
              background: "var(--color-surface-hover)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Volume2 size={15} />
            </div>
            <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--color-text)", lineHeight: 1.4 }}>
              <strong>Can&apos;t read?</strong> Click the &apos;Listen&apos; button available on the website to hear all information spoken aloud!
            </p>
          </div>

          {/* Languages Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "0.6rem",
            }}
          >
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isTranslating}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: isSelected
                      ? "1.5px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                    background: isSelected
                      ? "var(--color-nav-active-bg)"
                      : "var(--color-surface)",
                    cursor: isTranslating ? "wait" : "pointer",
                    textAlign: "left",
                    transition: "all 0.18s ease",
                    boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                    opacity: isTranslating ? 0.6 : 1,
                    minHeight: "44px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: isSelected ? "var(--color-primary)" : "var(--color-text)",
                        lineHeight: 1.2,
                      }}
                    >
                      {lang.nativeName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--color-text-muted)",
                        marginTop: "0.15rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {lang.region}
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "var(--color-primary)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: "0.5rem",
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isTranslating && (
            <div
              style={{
                marginTop: "0.75rem",
                textAlign: "center",
                fontSize: "0.8rem",
                color: "var(--color-primary)",
                fontWeight: 600,
              }}
            >
              Translating website...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
