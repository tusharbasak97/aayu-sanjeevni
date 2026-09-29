"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface GsapScrollRevealProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GsapScrollReveal({
  children,
  stagger = 0.12,
  delay = 0,
  direction = "up",
  distance = 35,
  className = "",
  style = {},
}: GsapScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const childrenElements = Array.from(container.children) as HTMLElement[];
    if (childrenElements.length === 0) return;

    // Initial state
    const offsetAxis = direction === "left" || direction === "right" ? "x" : "y";
    const offsetVal =
      direction === "up" || direction === "left" ? distance : -distance;

    gsap.set(childrenElements, {
      opacity: 0,
      [offsetAxis]: offsetVal,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(childrenElements, {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              stagger,
              delay,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [direction, distance, stagger, delay]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
