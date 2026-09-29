"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
  style?: React.CSSProperties;
  glare?: boolean;
}

export default function TiltCard({
  children,
  maxTilt = 8,
  className = "",
  style = {},
  glare = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const rotXTo = gsap.quickTo(card, "rotationX", {
        duration: 0.35,
        ease: "power2.out",
      });
      const rotYTo = gsap.quickTo(card, "rotationY", {
        duration: 0.35,
        ease: "power2.out",
      });
      const zTo = gsap.quickTo(card, "z", {
        duration: 0.35,
        ease: "power2.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = -((y - centerY) / centerY) * maxTilt;
        const tiltY = ((x - centerX) / centerX) * maxTilt;

        rotXTo(tiltX);
        rotYTo(tiltY);
        zTo(15);

        if (glare && glareRef.current) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glareRef.current.style.opacity = "0.15";
          glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`;
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });

        if (glare && glareRef.current) {
          glareRef.current.style.opacity = "0";
        }
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <div
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={cardRef}
        className={className}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          position: "relative",
          ...style,
        }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.25s ease",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
}
