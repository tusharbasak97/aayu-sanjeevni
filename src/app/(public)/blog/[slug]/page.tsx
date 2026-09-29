import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { seo: true },
  });

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.seo?.metaTitle || blog.title,
    description:
      blog.seo?.metaDescription || blog.excerpt || blog.content.slice(0, 160),
    keywords: blog.seo?.focusKeywords?.split(",").map((k) => k.trim()),
    alternates: blog.seo?.canonicalUrl
      ? { canonical: blog.seo.canonicalUrl }
      : undefined,
    openGraph: {
      title: blog.seo?.metaTitle || blog.title,
      description:
        blog.seo?.metaDescription || blog.excerpt || blog.content.slice(0, 160),
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      images: blog.coverImageUrl ? [{ url: blog.coverImageUrl }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      seo: true,
    },
  });

  if (!blog || blog.status !== "PUBLISHED") notFound();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || blog.content.slice(0, 160),
    image: blog.coverImageUrl,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: blog.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Aayu Sanjeevni",
    },
  };

  return (
    <div style={{ paddingTop: "72px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Cover Image */}
        {blog.coverImageUrl && (
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "50%",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            <Image
              src={blog.coverImageUrl}
              alt={blog.coverImageAlt || blog.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          {blog.publishedAt && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={15} />
              {formatDate(blog.publishedAt)}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <User size={15} />
            {blog.author.name}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            marginBottom: "2rem",
            lineHeight: 1.2,
          }}
        >
          {blog.title}
        </h1>

        {/* Content */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
        />
      </article>
    </div>
  );
}
