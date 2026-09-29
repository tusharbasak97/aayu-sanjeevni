import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  processImage,
  processVideo,
  getMediaType,
} from "@/lib/media-pipeline";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const maxDuration = 300; // 5 minutes for video processing

// POST /api/upload — Upload and optimize media (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const mediaType = getMediaType(file.type);
    if (mediaType === "UNKNOWN") {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use images or videos." },
        { status: 400 }
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    if (mediaType === "IMAGE") {
      // Process image through Sharp pipeline
      const processed = await processImage(inputBuffer);

      // Upload optimized image to Cloudinary
      const result = await uploadToCloudinary(processed.buffer, {
        folder: "aayu-sanjeevni/images",
        format: "webp",
      });

      // Save to database
      const media = await prisma.media.create({
        data: {
          originalName: file.name,
          originalUrl: result.secure_url,
          optimizedUrl: result.secure_url,
          format: "webp",
          type: "IMAGE",
          sizeBytes: processed.sizeBytes,
          width: processed.width,
          height: processed.height,
          altText: altText || file.name,
        },
      });

      return NextResponse.json({
        success: true,
        data: media,
      });
    } else {
      // Process video through FFmpeg pipeline
      const { webm, mp4 } = await processVideo(inputBuffer);

      // Upload both formats to Cloudinary
      const [webmResult, mp4Result] = await Promise.all([
        uploadToCloudinary(webm.buffer, {
          folder: "aayu-sanjeevni/videos",
          resourceType: "video",
          format: "webm",
        }),
        uploadToCloudinary(mp4.buffer, {
          folder: "aayu-sanjeevni/videos",
          resourceType: "video",
          format: "mp4",
        }),
      ]);

      // Save primary (WebM) to database, store MP4 as fallback
      const media = await prisma.media.create({
        data: {
          originalName: file.name,
          originalUrl: webmResult.secure_url,
          optimizedUrl: mp4Result.secure_url, // MP4 fallback
          format: "webm",
          type: "VIDEO",
          sizeBytes: webm.sizeBytes,
          altText: altText || file.name,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          ...media,
          mp4Url: mp4Result.secure_url,
          webmUrl: webmResult.secure_url,
        },
      });
    }
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process and upload media" },
      { status: 500 }
    );
  }
}
