"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "@/components/public/BlogCard";
import VoiceReader from "@/components/ui/VoiceReader";
import { BookOpen } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: Date | string | null;
  author: { id: string; name: string } | null;
}

interface BlogClientProps {
  blogs: BlogItem[];
}

export default function BlogClient({ blogs }: BlogClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance
      gsap.from(".blog-hero-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. Blog cards reveal
      gsap.from(".blog-card-item", {
        scrollTrigger: {
          trigger: ".blog-grid-container",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: "72px" }}>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          background: "rgba(30, 58, 95, 0.08)",
        }}
      >
        <span
          className="blog-hero-item"
          style={{
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.75rem",
            background: "rgba(30, 58, 95, 0.1)",
            padding: "0.3rem 0.85rem",
            borderRadius: "var(--radius-full)",
          }}
        >
          Health Awareness & Stories
        </span>

        <h1
          className="blog-hero-item"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          Stories, Updates & <span className="gradient-text">Health Awareness</span>
        </h1>

        <p
          className="blog-hero-item"
          style={{
            fontSize: "1.15rem",
            color: "var(--color-text-muted)",
            maxWidth: "680px",
            margin: "0 auto 1.5rem",
            lineHeight: 1.8,
          }}
        >
          Important health information in simple language, disease prevention methods, how to avail government health schemes, and true stories of transformation in patients&apos; lives.
        </p>

        {/* Voice Reader */}
        <div className="blog-hero-item">
          <VoiceReader
            text="Welcome to the Aayu Sanjeevni health blog. Here you can listen to disease prevention methods and true success stories of patients."
            label="Listen to Blog Details (Audio)"
          />
        </div>
      </section>

      {/* Blog Grid */}
      <section
        className="blog-grid-container"
        style={{
          padding: "3.5rem 1.5rem 5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {blogs.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card-item">
                <BlogCard
                  title={blog.title}
                  slug={blog.slug}
                  excerpt={blog.excerpt}
                  content={blog.content}
                  coverImageUrl={blog.coverImageUrl}
                  coverImageAlt={blog.coverImageAlt}
                  publishedAt={blog.publishedAt}
                  author={blog.author}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <BookOpen size={40} style={{ color: "var(--color-primary)", margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              New health articles coming soon
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
              Simple health consultations written by doctors will be available here soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
