"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface VoiceReaderProps {
  text: string;
  label?: string;
  lang?: string; // Optional BCP-47 language tag (e.g. 'en-IN', 'hi-IN', 'bn-IN')
  size?: "sm" | "md";
  variant?: "default" | "hero";
}

let heartbeatInterval: NodeJS.Timeout | null = null;

export default function VoiceReader({
  text,
  label = "Listen",
  lang,
  size = "md",
  variant = "default",
}: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [hasError, setHasError] = useState(false);
  const instanceId = useId();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Detect and return the appropriate language tag
  const getActiveLangTag = useCallback(() => {
    if (lang) return lang;
    if (typeof document === "undefined") return "en-IN";

    // 1. Check localStorage
    const saved = localStorage.getItem("aayu_selected_language");
    // 2. Check googtrans cookie
    const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
    const code = saved || (cookieMatch ? cookieMatch[1] : null);

    const mapping: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      bn: "bn-IN",
      mr: "mr-IN",
      te: "te-IN",
      ta: "ta-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      pa: "pa-IN",
      or: "or-IN",
      ur: "ur-IN",
    };

    if (code && mapping[code]) {
      return mapping[code];
    }

    // Default to Indian English / English when no Indian regional language selected
    return "en-IN";
  }, [lang]);

  // Clean up on unmount or when another player starts
  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    utteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      const timer = setTimeout(() => setIsSupported(false), 0);
      return () => clearTimeout(timer);
    }

    // Pre-warm voices
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
      }
    } catch {
      // ignore
    }

    // Listen for other TTS instances starting
    const handleOtherPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id !== instanceId) {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    window.addEventListener("aayu_tts_play", handleOtherPlay);

    return () => {
      window.removeEventListener("aayu_tts_play", handleOtherPlay);
      stopSpeech();
    };
  }, [instanceId, stopSpeech]);

  if (!isSupported) return null;

  const handleTogglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    // If currently playing, toggle pause / resume
    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
      return;
    }

    // Stop any existing playback and notify other instances
    stopSpeech();
    setHasError(false);

    window.dispatchEvent(
      new CustomEvent("aayu_tts_play", { detail: { id: instanceId } })
    );

    // Cancel pending and resume before starting fresh utterance
    synth.cancel();
    if (synth.paused) {
      synth.resume();
    }

    // Clean text: strip HTML tags and excessive symbols
    const cleanText = text
      .replace(/<[^>]*>?/gm, " ")
      .replace(/[*#_~`]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = getActiveLangTag();
    utterance.lang = targetLang;
    utterance.rate = 0.92; // Empathetic, clear, accessible speaking rate
    utterance.pitch = 1.0;

    // Select the best voice available
    const voices = synth.getVoices();
    if (voices.length > 0) {
      let voice = voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase());
      if (!voice) {
        const prefix = targetLang.split("-")[0].toLowerCase();
        voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      }
      if (!voice) {
        voice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      }
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);

      if (heartbeatInterval) clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(() => {
        if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    };

    utterance.onend = () => {
      stopSpeech();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e.error);
      stopSpeech();
      if (e.error === "synthesis-failed" || e.error === "not-allowed") {
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }
    };

    utteranceRef.current = utterance;
    if (typeof window !== "undefined") {
      (window as unknown as { __aayu_tts?: SpeechSynthesisUtterance }).__aayu_tts = utterance;
    }

    setTimeout(() => {
      try {
        synth.speak(utterance);
        setIsPlaying(true);
      } catch (err) {
        console.warn("TTS speak exception:", err);
        stopSpeech();
      }
    }, 60);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopSpeech();
  };

  const isSmall = size === "sm";
  const isHero = variant === "hero";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        verticalAlign: "middle",
        position: "relative",
      }}
    >
      <button
        onClick={handleTogglePlay}
        type="button"
        title={
          hasError
            ? "Speech synthesizer not ready on this browser"
            : isPlaying
            ? isPaused
              ? "Click to resume audio reading"
              : "Click to pause audio reading"
            : "Listen to this content spoken aloud"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: isSmall ? "0.35rem 0.75rem" : "0.55rem 1.05rem",
          borderRadius: "var(--radius-full)",
          background: isPlaying
            ? "var(--color-primary)"
            : isHero
            ? "rgba(255, 255, 255, 0.12)"
            : "var(--color-nav-active-bg)",
          border: isPlaying
            ? "1.5px solid var(--color-primary-dark)"
            : isHero
            ? "1px solid rgba(255, 255, 255, 0.25)"
            : "1px solid var(--color-border)",
          color: isPlaying
            ? "#ffffff"
            : isHero
            ? "#ffffff"
            : "var(--color-primary)",
          fontSize: isSmall ? "0.8rem" : "0.88rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isPlaying ? "var(--shadow-glow)" : "none",
          backdropFilter: isHero ? "blur(8px)" : "none",
          minHeight: isSmall ? "36px" : "44px",
        }}
        aria-label="Listen to content spoken aloud"
      >
        {isPlaying ? (
          isPaused ? (
            <Play size={isSmall ? 15 : 17} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "2.5px" }}>
              <span
                style={{
                  width: "3px",
                  height: "12px",
                  background: "#ffffff",
                  borderRadius: "2px",
                  animation: "soundwave 0.8s ease-in-out infinite alternate",
                }}
              />
              <span
                style={{
                  width: "3px",
                  height: "16px",
                  background: "#ffffff",
                  borderRadius: "2px",
                  animation: "soundwave 0.6s ease-in-out infinite alternate 0.2s",
                }}
              />
              <span
                style={{
                  width: "3px",
                  height: "10px",
                  background: "#ffffff",
                  borderRadius: "2px",
                  animation: "soundwave 0.9s ease-in-out infinite alternate 0.4s",
                }}
              />
            </div>
          )
        ) : (
          <Volume2 size={isSmall ? 15 : 18} />
        )}
        <span>
          {hasError
            ? "Audio unavailable"
            : isPlaying
            ? isPaused
              ? "Resume"
              : "Reading..."
            : label}
        </span>
      </button>

      {isPlaying && (
        <button
          onClick={handleStop}
          type="button"
          aria-label="Stop audio reading"
          title="Stop reading"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: isSmall ? "28px" : "34px",
            height: isSmall ? "28px" : "34px",
            borderRadius: "50%",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#dc2626",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <VolumeX size={isSmall ? 14 : 16} />
        </button>
      )}

      <style jsx>{`
        @keyframes soundwave {
          0% {
            height: 4px;
          }
          100% {
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}
