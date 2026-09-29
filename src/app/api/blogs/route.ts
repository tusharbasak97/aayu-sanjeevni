import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  coverImageAlt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeywords: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
});

// GET /api/blogs — List all blogs (public: only published, admin: all)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const status = searchParams.get("status");

    const where = session
      ? status
        ? { status: status as "DRAFT" | "PUBLISHED" }
        : {}
      : { status: "PUBLISHED" as const };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
          seo: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs — Create a new blog (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = blogSchema.parse(body);

    const slug = slugify(validated.title);

    // Check for duplicate slug
    const existing = await prisma.blog.findUnique({ where: { slug } });
    const finalSlug = existing
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const blog = await prisma.blog.create({
      data: {
        title: validated.title,
        slug: finalSlug,
        content: validated.content,
        excerpt: validated.excerpt,
        coverImageUrl: validated.coverImageUrl,
        coverImageAlt: validated.coverImageAlt,
        status: validated.status,
        authorId: session.user.id,
        publishedAt:
          validated.status === "PUBLISHED" ? new Date() : null,
        seo: validated.seo
          ? {
              create: {
                metaTitle: validated.seo.metaTitle,
                metaDescription: validated.seo.metaDescription,
                focusKeywords: validated.seo.focusKeywords,
                canonicalUrl: validated.seo.canonicalUrl,
              },
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        seo: true,
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
