import { prisma } from "@/lib/prisma";
import { createTourSchema } from "./tour.validation";

export async function createTour(input: unknown) {
  const data = createTourSchema.parse(input);
  const { destinationIds, attractionIds, activityIds, itineraryDays, ...tourData } = data;
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
      itineraryDays: {
        create: itineraryDays.map((day, index) => ({
          dayNumber: index + 1,
          title: day.title,
          description: day.description,
          distanceKm: day.distanceKm,
          drivingMinutes: day.drivingMinutes,
          overnightAt: day.overnightAt || null,
          accommodation: day.accommodation || null,
          meals: day.meals,
          activities: {
            create: day.activities.map((activity, sortOrder) => ({
              timeLabel: activity.timeLabel || null,
              title: activity.title,
              description: activity.description,
              imageUrl: activity.imageUrl || null,
              sortOrder,
            })),
          },
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
