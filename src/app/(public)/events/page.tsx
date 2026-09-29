import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventsClient from "@/components/public/EventsClient";

export const metadata: Metadata = {
  title: "Events & Free Medical Camps | Aayu Sanjeevni",
  description:
    "Explore upcoming and past free medical camps, cataract screening drives, and village healthcare programs across India.",
};

export default async function EventsListPage() {
  const events = await prisma.event.findMany({
    include: {
      author: { select: { id: true, name: true } },
      gallery: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: { eventDate: "desc" },
    take: 20,
  });

  return <EventsClient events={events} />;
}
