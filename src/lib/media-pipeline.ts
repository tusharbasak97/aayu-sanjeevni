import sharp from "sharp";
import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import os from "os";

const execFileAsync = promisify(execFile);

export interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export interface ProcessedVideo {
  buffer: Buffer;
  format: string;
  sizeBytes: number;
}

/**
 * Process an image using Sharp:
 * 1. Resize to max 2000px width (maintaining aspect ratio)
 * 2. Compress with high quality
 * 3. Convert to WebP format
 */
export async function processImage(
  inputBuffer: Buffer
): Promise<ProcessedImage> {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if wider than 2000px
  if (metadata.width && metadata.width > 2000) {
    pipeline = pipeline.resize(2000, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  // Convert to WebP with high quality
  const outputBuffer = await pipeline
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  const outputMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    format: "webp",
    width: outputMetadata.width || 0,
    height: outputMetadata.height || 0,
    sizeBytes: outputBuffer.length,
  };
}

/**
 * Generate a thumbnail version of an image
 */
export async function generateThumbnail(
  inputBuffer: Buffer,
  width: number = 400
): Promise<ProcessedImage> {
  const outputBuffer = await sharp(inputBuffer)
    .resize(width, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 75 })
    .toBuffer();

  const outputMetadata = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    format: "webp",
    width: outputMetadata.width || 0,
    height: outputMetadata.height || 0,
    sizeBytes: outputBuffer.length,
  };
}

/**
 * Process a video using FFmpeg:
 * 1. Compress with CRF 28
 * 2. Convert to WebM (primary) and MP4 (fallback)
 * OWASP A03: Uses execFile with structured argument arrays instead of shell command strings.
 */
export async function processVideo(
  inputBuffer: Buffer
): Promise<{ webm: ProcessedVideo; mp4: ProcessedVideo }> {
  const tmpDir = join(os.tmpdir(), "aayu-media-" + randomUUID());
  await mkdir(tmpDir, { recursive: true });

  const inputPath = join(tmpDir, "input");
  const webmPath = join(tmpDir, "output.webm");
  const mp4Path = join(tmpDir, "output.mp4");

  try {
    // Write input to temp file
    await writeFile(inputPath, inputBuffer);

    // Convert to WebM (VP9)
    await execFileAsync(
      "ffmpeg",
      [
        "-i",
        inputPath,
        "-c:v",
        "libvpx-vp9",
        "-crf",
        "28",
        "-b:v",
        "0",
        "-c:a",
        "libopus",
        "-b:a",
        "128k",
        "-vf",
        "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
        "-y",
        webmPath,
      ],
      { timeout: 300000 } // 5 minutes timeout
    );

    // Convert to MP4 (H.264 fallback)
    await execFileAsync(
      "ffmpeg",
      [
        "-i",
        inputPath,
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "medium",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        "-vf",
        "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
        "-y",
        mp4Path,
      ],
      { timeout: 300000 }
    );

    const webmBuffer = await readFile(webmPath);
    const mp4Buffer = await readFile(mp4Path);

    return {
      webm: {
        buffer: webmBuffer,
        format: "webm",
        sizeBytes: webmBuffer.length,
      },
      mp4: {
        buffer: mp4Buffer,
        format: "mp4",
        sizeBytes: mp4Buffer.length,
      },
    };
  } finally {
    // Cleanup temp files safely without shell invocation
    await Promise.allSettled([
      unlink(inputPath),
      unlink(webmPath),
      unlink(mp4Path),
    ]);
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Detect if a file is an image or video based on MIME type
 */
export function getMediaType(
  mimeType: string
): "IMAGE" | "VIDEO" | "UNKNOWN" {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  return "UNKNOWN";
}
