"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  strength = 25,
  className = "",
  style = {},
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(container, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(container, "y", {
        duration: 0.4,
        ease: "power3.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * (strength / 100);
        const deltaY = (e.clientY - centerY) * (strength / 100);

        xTo(deltaX);
        yTo(deltaY);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
        gsap.to(container, {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1.2, 0.4)",
        });
      };

      const handleMouseEnter = () => {
        gsap.to(container, {
          scale: 1.04,
          duration: 0.25,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseenter", handleMouseEnter);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseenter", handleMouseEnter);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
