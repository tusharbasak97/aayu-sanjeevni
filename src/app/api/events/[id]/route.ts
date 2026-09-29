import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "PAST"]).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeywords: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
});

// GET /api/events/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        seo: true,
        gallery: { include: { media: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id]
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
    const validated = eventUpdateSchema.parse(body);

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { seo: true },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    let slug = existingEvent.slug;
    if (validated.title && validated.title !== existingEvent.title) {
      slug = slugify(validated.title);
      const existing = await prisma.event.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(validated.title && { title: validated.title, slug }),
        ...(validated.description && {
          description: validated.description,
        }),
        ...(validated.location !== undefined && {
          location: validated.location,
        }),
        ...(validated.eventDate && {
          eventDate: new Date(validated.eventDate),
        }),
        ...(validated.eventEndDate !== undefined && {
          eventEndDate: validated.eventEndDate
            ? new Date(validated.eventEndDate)
            : null,
        }),
        ...(validated.status && { status: validated.status }),
        seo: validated.seo
          ? existingEvent.seo
            ? { update: validated.seo }
            : { create: validated.seo }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        seo: true,
      },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
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
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
