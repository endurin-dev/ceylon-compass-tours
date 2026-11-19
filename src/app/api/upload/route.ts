import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 12;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE * MAX_FILES_PER_REQUEST + 1024 * 1024;
const uploadDirectory = path.join(process.cwd(), "public", "uploads");

const imageTypes = [
  {
    mimeType: "image/jpeg",
    extension: ".jpg",
    matches: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    mimeType: "image/png",
    extension: ".png",
    matches: (bytes: Uint8Array) =>
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a,
  },
  {
    mimeType: "image/webp",
    extension: ".webp",
    matches: (bytes: Uint8Array) =>
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }
  const user = session.user as typeof session.user & { role?: string };
  if (user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "You do not have permission to upload images." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json({ error: "The upload is too large. Upload fewer or smaller images." }, { status: 413 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files");
  const requestedFolder = formData.get("folder");
  const folder = typeof requestedFolder === "string" &&
    ["tour-gallery", "tour-covers", "destinations", "attractions", "activities"].includes(requestedFolder)
    ? requestedFolder
    : "tour-gallery";
  if (files.length === 0 || files.some((file) => !(file instanceof File))) {
    return NextResponse.json({ error: "Choose one or more image files to upload." }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json({ error: `Upload no more than ${MAX_FILES_PER_REQUEST} images at a time.` }, { status: 400 });
  }

  const acceptedFiles: Array<{
    file: File;
    bytes: Uint8Array;
    mimeType: string;
    extension: string;
  }> = [];
  for (const entry of files) {
    if (!(entry instanceof File)) continue;
    if (entry.size === 0 || entry.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Each image must be between 1 byte and 8 MB." }, { status: 400 });
    }

    const bytes = new Uint8Array(await entry.arrayBuffer());
    const detectedType = imageTypes.find((type) => type.matches(bytes));
    if (!detectedType) {
      return NextResponse.json(
        { error: "Only valid JPEG, PNG, and WebP image files are supported." },
        { status: 415 },
      );
    }
    acceptedFiles.push({ file: entry, bytes, ...detectedType });
  }

  await mkdir(uploadDirectory, { recursive: true });
  const uploaded = [];
  for (const { file, bytes, mimeType, extension } of acceptedFiles) {
    const filenameOnDisk = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, filenameOnDisk);
    const url = `/uploads/${filenameOnDisk}`;
    await writeFile(filePath, bytes, { flag: "wx" });

    const originalName = file.name.replace(/[\\/\0-\x1f\x7f]/g, "").slice(0, 180) || filenameOnDisk;
    try {
      const media = await prisma.media.create({
        data: {
          url,
          filename: originalName,
          mimeType,
          sizeBytes: bytes.byteLength,
          folder,
        },
        select: {
          id: true,
          url: true,
          filename: true,
          mimeType: true,
          sizeBytes: true,
          altText: true,
          folder: true,
          createdAt: true,
        },
      });
      uploaded.push(media);
    } catch (error) {
      await unlink(filePath);
      throw error;
    }
  }

  return NextResponse.json({ files: uploaded }, { status: 201 });
}
