import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const blogUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  coverImageAlt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeywords: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
});

// GET /api/blogs/[id] — Get a single blog
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        seo: true,
        media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/[id] — Update a blog (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validated = blogUpdateSchema.parse(body);

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      include: { seo: true },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (validated.title && validated.title !== existingBlog.title) {
      slug = slugify(validated.title);
      const existing = await prisma.blog.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.title && { slug }),
        ...(validated.content && { content: validated.content }),
        ...(validated.excerpt !== undefined && {
          excerpt: validated.excerpt,
        }),
        ...(validated.coverImageUrl !== undefined && {
          coverImageUrl: validated.coverImageUrl,
        }),
        ...(validated.coverImageAlt !== undefined && {
          coverImageAlt: validated.coverImageAlt,
        }),
        ...(validated.status && {
          status: validated.status,
          publishedAt:
            validated.status === "PUBLISHED" && !existingBlog.publishedAt
              ? new Date()
              : existingBlog.publishedAt,
        }),
        seo: validated.seo
          ? existingBlog.seo
            ? { update: validated.seo }
            : { create: validated.seo }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        seo: true,
      },
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] — Delete a blog (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
