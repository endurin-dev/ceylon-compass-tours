"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export type MediaActionResult = { error?: string; success?: boolean };

export async function attachMediaToTour(mediaId: string, tourId: string): Promise<MediaActionResult> {
  await requirePermission("MEDIA_MANAGE");
  if (!mediaId || mediaId.length > 200 || !tourId || tourId.length > 200) {
    return { error: "Choose a valid image and tour." };
  }

  const [media, tour, lastImage] = await Promise.all([
    prisma.media.findUnique({ where: { id: mediaId }, select: { url: true, altText: true } }),
    prisma.tour.findUnique({ where: { id: tourId }, select: { id: true, slug: true } }),
    prisma.tourImage.findFirst({ where: { tourId }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } }),
  ]);
  if (!media) return { error: "Image not found in the media library." };
  if (!tour) return { error: "Tour package not found." };

  const existing = await prisma.tourImage.findFirst({
    where: { tourId, url: media.url },
    select: { id: true },
  });
  if (existing) return { error: "This image is already in that tour gallery." };

  await prisma.tourImage.create({
    data: {
      tourId,
      url: media.url,
      altText: media.altText,
      caption: media.altText,
      sortOrder: (lastImage?.sortOrder ?? -1) + 1,
    },
  });
  revalidatePath("/admin/media");
  revalidatePath("/admin/tours");
  revalidatePath(`/tour-packages/${tour.slug}`);
  return { success: true };
}

export async function removeTourImage(imageId: string): Promise<MediaActionResult> {
  await requirePermission("MEDIA_MANAGE");
  if (!imageId || imageId.length > 200) return { error: "Choose a valid tour image." };

  const image = await prisma.tourImage.findUnique({
    where: { id: imageId },
    select: { tourId: true, tour: { select: { slug: true } } },
  });
  if (!image) return { error: "Tour image not found." };

  await prisma.tourImage.delete({ where: { id: imageId } });
  revalidatePath("/admin/media");
  revalidatePath(`/tour-packages/${image.tour.slug}`);
  return { success: true };
}

export async function deleteMediaItem(mediaId: string): Promise<MediaActionResult> {
  await requirePermission("MEDIA_MANAGE");
  if (!mediaId || mediaId.length > 200) return { error: "Choose a valid media item." };

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { url: true, publicId: true },
  });
  if (!media) return { error: "Media item not found." };
  if (media.publicId) {
    return { error: "This file is stored remotely. Delete it through its storage provider." };
  }
  const [linkedImages, linkedTours, linkedDestinations, linkedAttractions, linkedActivities] =
    await Promise.all([
      prisma.tourImage.findMany({
        where: { url: media.url },
        select: { id: true },
      }),
      prisma.tour.findFirst({
        where: { OR: [{ coverImageUrl: media.url }, { heroImageUrl: media.url }] },
        select: { id: true },
      }),
      prisma.destination.findFirst({ where: { imageUrl: media.url }, select: { id: true } }),
      prisma.attraction.findFirst({ where: { imageUrl: media.url }, select: { id: true } }),
      prisma.activity.findFirst({ where: { imageUrl: media.url }, select: { id: true } }),
    ]);
  if (
    linkedImages.length ||
    linkedTours ||
    linkedDestinations ||
    linkedAttractions ||
    linkedActivities
  ) {
    return {
      error: "Remove this image from its tour, destination, attraction, or activity before deleting it.",
    };
  }
  if (!media.url.startsWith("/uploads/") || media.url.includes("..") || media.url.includes("\\")) {
    return { error: "This media file is not managed by the local image library." };
  }

  const { unlink } = await import("node:fs/promises");
  const path = await import("node:path");
  const uploadDirectory = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.resolve(uploadDirectory, media.url.slice("/uploads/".length));
  if (!filePath.startsWith(`${uploadDirectory}${path.sep}`)) {
    return { error: "Invalid media file path." };
  }

  const deleted = await prisma.media.deleteMany({ where: { id: mediaId, url: media.url } });
  if (deleted.count !== 1) return { error: "Media item changed before it could be deleted. Refresh and try again." };
  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  revalidatePath("/admin/media");
  return { success: true };
}
