import { prisma } from "@/lib/prisma";
import { createTourSchema } from "./tour.validation";

export async function createTour(input: unknown) {
  const data = createTourSchema.parse(input);
  const { destinationIds, attractionIds, activityIds, ...tourData } = data;
  const [destinations, attractions, activities] = await Promise.all([
    prisma.destination.findMany({ where: { id: { in: destinationIds } }, select: { id: true } }),
    prisma.attraction.findMany({ where: { id: { in: attractionIds } }, select: { id: true } }),
    prisma.activity.findMany({ where: { id: { in: activityIds } }, select: { id: true } }),
  ]);
  if (
    destinations.length !== destinationIds.length ||
    attractions.length !== attractionIds.length ||
    activities.length !== activityIds.length
  ) {
    throw new Error("One or more selected package items could not be found. Refresh and try again.");
  }

  return prisma.tour.create({
    data: {
      ...tourData,
      durationLabel: tourData.durationLabel || null,
      coverImageUrl: tourData.coverImageUrl || null,
      tourDestinations: {
        create: destinationIds.map((destinationId, sortOrder) => ({
          destinationId,
          sortOrder,
        })),
      },
      tourAttractions: {
        create: attractionIds.map((attractionId, sortOrder) => ({
          attractionId,
          sortOrder,
        })),
      },
      tourActivities: {
        create: activityIds.map((activityId, sortOrder) => ({
          activityId,
          sortOrder,
        })),
      },
    }
  });
}

export async function getPublishedTours() {
  return prisma.tour.findMany({
    where: { status: "PUBLISHED" },
    include: { images: { orderBy: { sortOrder: "asc" } }, tourDestinations: { include: { destination: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });
}
