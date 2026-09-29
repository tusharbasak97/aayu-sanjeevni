import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogClient from "@/components/public/BlogClient";

export const metadata: Metadata = {
  title: "Blog & Healthcare Awareness | Aayu Sanjeevni",
  description:
    "Educational medical articles, preventive health tips, patient recovery stories, and updates on free health camps across India.",
};

export default async function BlogListPage() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return <BlogClient blogs={blogs} />;
}
