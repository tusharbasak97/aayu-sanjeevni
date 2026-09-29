import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventEndDate: z.string().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "PAST"]).default("UPCOMING"),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeywords: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
});

// GET /api/events — List all events
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const status = searchParams.get("status");

    const where = session
      ? status
        ? { status: status as "UPCOMING" | "ONGOING" | "PAST" }
        : {}
      : { status: { in: ["UPCOMING" as const, "ONGOING" as const] } };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          author: { select: { id: true, name: true } },
          seo: true,
          gallery: {
            include: { media: true },
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
        orderBy: { eventDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events — Create a new event (admin only)
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
    const validated = eventSchema.parse(body);

    const slug = slugify(validated.title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    const finalSlug = existing
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const event = await prisma.event.create({
      data: {
        title: validated.title,
        slug: finalSlug,
        description: validated.description,
        location: validated.location,
        eventDate: new Date(validated.eventDate),
        eventEndDate: validated.eventEndDate
          ? new Date(validated.eventEndDate)
          : null,
        status: validated.status,
        authorId: session.user.id,
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

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}
