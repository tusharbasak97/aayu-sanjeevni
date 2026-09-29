import { v2 as cloudinary } from "cloudinary";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    publicId?: string;
    format?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "aayu-sanjeevni",
          resource_type: options.resourceType || "auto",
          public_id: options.publicId,
          format: options.format,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve(result as unknown as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Local filesystem fallback when Cloudinary credentials are not set
  const subFolder = (options.folder || "media").replace(/^aayu-sanjeevni\/?/, "");
  const uploadDir = join(process.cwd(), "public", "uploads", subFolder);
  await mkdir(uploadDir, { recursive: true });

  const id = options.publicId || randomUUID();
  const ext = options.format ? `.${options.format}` : "";
  const fileName = `${id}${ext}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  const localUrl = `/uploads/${subFolder}/${fileName}`;
  return {
    public_id: fileName,
    secure_url: localUrl,
    format: options.format || "",
    width: 0,
    height: 0,
    bytes: buffer.length,
    resource_type: options.resourceType || "image",
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> {
  if (isCloudinaryConfigured) {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } else {
    // Delete local file if it exists
    const possiblePaths = [
      join(process.cwd(), "public", "uploads", "images", publicId),
      join(process.cwd(), "public", "uploads", "videos", publicId),
      join(process.cwd(), "public", "uploads", "media", publicId),
      join(process.cwd(), "public", publicId),
    ];
    for (const p of possiblePaths) {
      try {
        await unlink(p);
        break;
      } catch {
        // file doesn't exist at this location
      }
    }
  }
}

export { cloudinary };
