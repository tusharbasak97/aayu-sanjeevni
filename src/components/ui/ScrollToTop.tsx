"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const hasAnimatedRef = useRef(false);

  const size = 46;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));

        // Direct DOM update avoids React re-renders on every scroll tick
        if (circleRef.current) {
          const offset = circumference - (progress / 100) * circumference;
          circleRef.current.style.strokeDashoffset = `${offset}`;
        }

        const shouldShow = currentScroll > 260;
        if (shouldShow !== isVisibleRef.current) {
          isVisibleRef.current = shouldShow;
          setIsVisible(shouldShow);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [circumference]);

  // GSAP Entrance & Exit animation
  useEffect(() => {
    if (!buttonRef.current) return;

    if (isVisible) {
      hasAnimatedRef.current = true;
      gsap.to(buttonRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    } else if (hasAnimatedRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.6,
        opacity: 0,
        y: 20,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={buttonRef}
      className="scroll-to-top-wrapper"
      style={{
        position: "fixed",
        bottom: "76px",
        right: "24px",
        zIndex: 89,
        opacity: 0,
        transform: "scale(0.6) translateY(20px)",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to top"
        type="button"
        style={{
          position: "relative",
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)",
          transition: "box-shadow 0.25s ease, transform 0.2s ease",
          outline: "none",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.55)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(37, 99, 235, 0.4)";
          e.currentTarget.style.transform = "none";
        }}
      >
        {/* SVG Circular Progress Track */}
        <svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(-90deg)",
            pointerEvents: "none",
          }}
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#93c5fd"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content: Arrow icon */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowUp size={19} strokeWidth={2.8} />
        </div>
      </button>

      <style jsx>{`
        @media (max-width: 640px) {
          .scroll-to-top-wrapper {
            bottom: 110px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
