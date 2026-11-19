"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { imageUrlSchema } from "@/lib/image-url";
import { itineraryDaysSchema } from "@/modules/tours/tour.validation";

export type AdminMutationResult = { error?: string; success?: boolean };

type Values = Record<string, string>;

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max);
const numberValue = (min: number, max = Number.MAX_SAFE_INTEGER) =>
  z.string().trim().min(1).transform(Number).pipe(z.number().finite().min(min).max(max));
const integerValue = (min: number, max = Number.MAX_SAFE_INTEGER) =>
  z.string().trim().min(1).transform(Number).pipe(z.number().finite().int().min(min).max(max));
const booleanValue = z.enum(["true", "false"]).transform((value) => value === "true");
const optionalNumber = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number().finite().min(0).nullable());
const optionalInteger = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number().finite().int().min(0).nullable());
const destinationIdsValue = z.string().transform((value, context) => {
  let destinationIds: unknown;
  try {
    destinationIds = JSON.parse(value);
  } catch {
    context.addIssue({ code: "custom", message: "Invalid destination list." });
    return z.NEVER;
  }
  const parsed = z.array(z.string().min(1).max(200)).max(100).safeParse(destinationIds);
  if (!parsed.success || new Set(parsed.data).size !== parsed.data.length) {
    context.addIssue({ code: "custom", message: "Choose valid, unique destinations." });
    return z.NEVER;
  }
  return parsed.data;
});
const attractionIdsValue = destinationIdsValue;
const activityIdsValue = destinationIdsValue;

function invalidateAdminAndPublic(section: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/${section}`);
  if (section === "tours") {
    revalidatePath("/");
    revalidatePath("/tour-packages");
    revalidatePath("/tour-packages/[slug]", "page");
    revalidatePath("/booking/[tourSlug]", "page");
    revalidatePath("/booking/confirmation/[reference]", "page");
  }
  if (section === "destinations") revalidatePath("/destinations");
  if (section === "attractions" || section === "activities") revalidatePath("/tour-packages");
}

export async function updateAdminRecord(
  section: string,
  recordId: string,
  recordType: string,
  values: Values,
): Promise<AdminMutationResult> {
  const actor = await requirePermission("admin");
  if (!recordId || recordId.length > 200) return { error: "Select a valid record." };

  switch (section) {
    case "tours": {
      const parsed = z.object({
        title: requiredText(160),
        slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        shortDescription: requiredText(320),
        description: requiredText(10000),
        durationDays: integerValue(1, 365),
        durationNights: integerValue(0, 364),
        durationLabel: optionalText(80),
        basePrice: numberValue(0),
        currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
        featured: booleanValue,
        showPrice: booleanValue,
        itineraryDays: itineraryDaysSchema,
        coverImageUrl: imageUrlSchema,
        destinationIds: destinationIdsValue,
        attractionIds: attractionIdsValue,
        activityIds: activityIdsValue,
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the tour details and try again." };
      const { destinationIds, attractionIds, activityIds, itineraryDays, ...tourData } = parsed.data;
      const [destinations, attractions, activities, existingTour, slugConflict] = await Promise.all([
        prisma.destination.findMany({
          where: { id: { in: destinationIds } },
          select: { id: true },
        }),
        prisma.attraction.findMany({
          where: { id: { in: attractionIds } },
          select: { id: true },
        }),
        prisma.activity.findMany({
          where: { id: { in: activityIds } },
          select: { id: true },
        }),
        prisma.tour.findUnique({
          where: { id: recordId },
          select: { slug: true },
        }),
        prisma.tour.findFirst({
          where: { slug: parsed.data.slug, id: { not: recordId } },
          select: { id: true },
        }),
      ]);
      if (
        destinations.length !== destinationIds.length ||
        attractions.length !== attractionIds.length ||
        activities.length !== activityIds.length
      ) {
        return { error: "One or more selected package items no longer exist. Refresh and try again." };
      }
      if (!existingTour) return { error: "Tour package not found." };
      if (slugConflict) return { error: "That tour URL slug is already in use." };
      await prisma.$transaction(async (transaction) => {
        await transaction.tour.update({
          where: { id: recordId },
          data: {
            ...tourData,
            durationLabel: tourData.durationLabel || null,
            coverImageUrl: tourData.coverImageUrl || null,
          },
        });
        await transaction.tourDestination.deleteMany({ where: { tourId: recordId } });
        if (destinationIds.length) {
          await transaction.tourDestination.createMany({
            data: destinationIds.map((destinationId, sortOrder) => ({
              tourId: recordId,
              destinationId,
              sortOrder,
            })),
          });
        }
        await transaction.tourAttraction.deleteMany({ where: { tourId: recordId } });
        if (attractionIds.length) {
          await transaction.tourAttraction.createMany({
            data: attractionIds.map((attractionId, sortOrder) => ({
              tourId: recordId,
              attractionId,
              sortOrder,
            })),
          });
        }
        await transaction.tourActivity.deleteMany({ where: { tourId: recordId } });
        if (activityIds.length) {
          await transaction.tourActivity.createMany({
            data: activityIds.map((activityId, sortOrder) => ({
              tourId: recordId,
              activityId,
              sortOrder,
            })),
          });
        }
        await transaction.itineraryDay.deleteMany({ where: { tourId: recordId } });
        for (const [dayIndex, day] of itineraryDays.entries()) {
          await transaction.itineraryDay.create({
            data: {
              tourId: recordId,
              dayNumber: dayIndex + 1,
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
            },
          });
        }
      });
      revalidatePath(`/tour-packages/${existingTour.slug}`);
      revalidatePath(`/tour-packages/${tourData.slug}`);
      revalidatePath("/admin/tours");
      break;
    }
    case "destinations": {
      const parsed = z.object({
        name: requiredText(120),
        slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        imageUrl: imageUrlSchema,
        description: optionalText(2000),
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the destination details and try again." };
      await prisma.destination.update({
        where: { id: recordId },
        data: {
          ...parsed.data,
          imageUrl: parsed.data.imageUrl || null,
          description: parsed.data.description || null,
        },
      });
      break;
    }
    case "attractions":
    case "activities": {
      const parsed = z.object({
        name: requiredText(120),
        slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        imageUrl: imageUrlSchema,
        description: optionalText(5000),
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the catalogue item details and try again." };
      const data = {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        description: parsed.data.description || null,
      };
      if (section === "attractions") {
        await prisma.attraction.update({ where: { id: recordId }, data });
      } else {
        await prisma.activity.update({ where: { id: recordId }, data });
      }
      break;
    }
    case "itineraries": {
      const parsed = z.object({
        dayNumber: integerValue(1, 100),
        title: requiredText(160),
        description: requiredText(5000),
        overnightAt: optionalText(160),
        accommodation: optionalText(300),
        meals: optionalText(500),
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the itinerary details and try again." };
      await prisma.itineraryDay.update({
        where: { id: recordId },
        data: {
          ...parsed.data,
          meals: parsed.data.meals
            .split(/[\n,]/)
            .map((meal) => meal.trim())
            .filter(Boolean),
          overnightAt: parsed.data.overnightAt || null,
          accommodation: parsed.data.accommodation || null,
        },
      });
      break;
    }
    case "departures": {
      if (recordType === "prices") {
        const parsed = z.object({
          label: requiredText(120),
          adultPrice: numberValue(0),
          childPrice: optionalNumber,
          infantPrice: optionalNumber,
          currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
        }).safeParse(values);
        if (!parsed.success) return { error: "Check the price details and try again." };
        await prisma.tourPrice.update({ where: { id: recordId }, data: parsed.data });
        break;
      }

      const parsed = z.object({
        startDate: z.string().date(),
        endDate: z.string().date(),
        capacity: optionalInteger,
        active: booleanValue,
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the departure dates and capacity." };
      const startDate = new Date(`${parsed.data.startDate}T00:00:00.000Z`);
      const endDate = new Date(`${parsed.data.endDate}T00:00:00.000Z`);
      const current = await prisma.tourDeparture.findUnique({
        where: { id: recordId },
        select: { bookedSeats: true, startDate: true, endDate: true, _count: { select: { bookings: true } } },
      });
      if (!current) return { error: "Departure not found." };
      if (endDate < startDate) return { error: "The end date must be on or after the start date." };
      if (parsed.data.capacity !== null && parsed.data.capacity < current.bookedSeats) {
        return { error: "Capacity cannot be lower than the seats already booked." };
      }
      if (
        current._count.bookings > 0 &&
        (startDate.getTime() !== current.startDate.getTime() || endDate.getTime() !== current.endDate.getTime())
      ) {
        return { error: "Departure dates cannot change after bookings are attached to this departure." };
      }
      await prisma.tourDeparture.update({
        where: { id: recordId },
        data: {
          startDate,
          endDate,
          capacity: parsed.data.capacity,
          active: parsed.data.active,
        },
      });
      break;
    }
    case "bookings": {
      const parsed = z.object({
        status: z.enum([
          "PENDING",
          "REQUESTED",
          "AWAITING_PAYMENT",
          "PARTIALLY_PAID",
          "CONFIRMED",
          "CANCELLED",
          "COMPLETED",
          "REFUNDED",
        ]),
      }).safeParse(values);
      if (!parsed.success) return { error: "Select a valid booking status." };
      const current = await prisma.booking.findUnique({
        where: { id: recordId },
        select: { status: true },
      });
      if (!current) return { error: "Booking not found." };
      if (current.status !== parsed.data.status) {
        await prisma.$transaction([
          prisma.booking.update({ where: { id: recordId }, data: { status: parsed.data.status } }),
          prisma.bookingStatusHistory.create({
            data: {
              bookingId: recordId,
              fromStatus: current.status,
              toStatus: parsed.data.status,
              note: "Status updated by an administrator.",
            },
          }),
        ]);
      }
      break;
    }
    case "customers": {
      const parsed = z.object({
        firstName: requiredText(100),
        lastName: optionalText(100),
        email: z.string().trim().email().max(254),
        phone: optionalText(30),
        country: optionalText(100),
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the customer details and try again." };
      await prisma.customer.update({
        where: { id: recordId },
        data: {
          ...parsed.data,
          lastName: parsed.data.lastName || "",
          phone: parsed.data.phone || null,
          country: parsed.data.country || null,
        },
      });
      break;
    }
    case "enquiries": {
      const parsed = z.object({
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      }).safeParse(values);
      if (!parsed.success) return { error: "Select a valid enquiry status." };
      await prisma.enquiry.update({ where: { id: recordId }, data: parsed.data });
      break;
    }
    case "reviews": {
      const parsed = z.object({
        customerName: requiredText(160),
        rating: integerValue(1, 5),
        title: optionalText(200),
        body: requiredText(4000),
        approved: booleanValue,
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the review details and try again." };
      await prisma.review.update({
        where: { id: recordId },
        data: { ...parsed.data, title: parsed.data.title || null },
      });
      break;
    }
    case "media": {
      const parsed = z.object({
        altText: optionalText(300),
        folder: optionalText(160),
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the media details and try again." };
      const media = await prisma.media.update({
        where: { id: recordId },
        data: {
          altText: parsed.data.altText || null,
          folder: parsed.data.folder || null,
        },
        select: { url: true },
      });
      const linkedImages = await prisma.tourImage.findMany({
        where: { url: media.url },
        select: { tour: { select: { slug: true } } },
      });
      await prisma.tourImage.updateMany({
        where: { url: media.url },
        data: {
          altText: parsed.data.altText || null,
          caption: parsed.data.altText || null,
        },
      });
      for (const image of linkedImages) revalidatePath(`/tour-packages/${image.tour.slug}`);
      break;
    }
    case "website-content":
    case "settings": {
      const parsed = z.object({
        key: z.string().trim().min(1).max(120),
        value: z.string().min(1).max(10000),
      }).safeParse(values);
      if (!parsed.success) return { error: "Provide a setting name and value." };
      let value: Prisma.InputJsonValue;
      try {
        value = JSON.parse(parsed.data.value);
      } catch {
        value = parsed.data.value;
      }
      await prisma.siteSetting.update({
        where: { id: recordId },
        data: { key: parsed.data.key, value },
      });
      break;
    }
    case "team": {
      const parsed = z.object({
        name: requiredText(160),
        email: z.string().trim().email().max(254),
        role: z.enum([
          "SUPER_ADMIN",
          "TOUR_MANAGER",
          "BOOKING_MANAGER",
          "FINANCE_MANAGER",
          "CONTENT_MANAGER",
          "SUPPORT",
        ]),
        active: booleanValue,
      }).safeParse(values);
      if (!parsed.success) return { error: "Check the team account details and try again." };
      if (recordId === actor.id && (!parsed.data.active || parsed.data.role !== "SUPER_ADMIN")) {
        return { error: "You cannot deactivate or remove your own administrator access." };
      }
      await prisma.user.update({ where: { id: recordId }, data: parsed.data });
      break;
    }
    default:
      return { error: "This section is read-only." };
  }

  invalidateAdminAndPublic(section);
  return { success: true };
}

export async function deleteAdminRecord(
  section: string,
  recordId: string,
  recordType: string,
): Promise<AdminMutationResult> {
  const actor = await requirePermission("admin");
  if (!recordId || recordId.length > 200) return { error: "Select a valid record." };

  switch (section) {
    case "tours": {
      const count = await prisma.booking.count({ where: { tourId: recordId } });
      if (count > 0) return { error: "This tour has bookings. Archive it instead to preserve booking history." };
      await prisma.tour.delete({ where: { id: recordId } });
      break;
    }
    case "destinations":
      await prisma.destination.delete({ where: { id: recordId } });
      break;
    case "attractions":
      await prisma.attraction.delete({ where: { id: recordId } });
      break;
    case "activities":
      await prisma.activity.delete({ where: { id: recordId } });
      break;
    case "itineraries":
      await prisma.itineraryDay.delete({ where: { id: recordId } });
      break;
    case "departures": {
      if (recordType === "prices") {
        await prisma.tourPrice.delete({ where: { id: recordId } });
        break;
      }
      const count = await prisma.booking.count({ where: { departureId: recordId } });
      if (count > 0) return { error: "This departure has bookings and cannot be deleted." };
      await prisma.tourDeparture.delete({ where: { id: recordId } });
      break;
    }
    case "bookings": {
      const booking = await prisma.booking.findUnique({
        where: { id: recordId },
        select: { status: true, payments: { select: { id: true } } },
      });
      if (!booking) return { error: "Booking not found." };
      if (booking.payments.length > 0) {
        return { error: "This booking has payment records. Keep it for audit history and update its status instead." };
      }
      if (!["PENDING", "REQUESTED", "CANCELLED"].includes(booking.status)) {
        return { error: "Only pending, requested, or cancelled bookings can be deleted." };
      }
      await prisma.booking.delete({ where: { id: recordId } });
      break;
    }
    case "customers": {
      const customer = await prisma.customer.findUnique({
        where: { id: recordId },
        select: { _count: { select: { bookings: true } } },
      });
      if (!customer) return { error: "Customer not found." };
      if (customer._count.bookings > 0) {
        return { error: "This customer has bookings and cannot be deleted." };
      }
      await prisma.customer.delete({ where: { id: recordId } });
      break;
    }
    case "enquiries":
      await prisma.enquiry.delete({ where: { id: recordId } });
      break;
    case "reviews":
      await prisma.review.delete({ where: { id: recordId } });
      break;
    case "media": {
      return { error: "Use the media library controls to safely remove uploaded files." };
    }
    case "website-content":
    case "settings":
      await prisma.siteSetting.delete({ where: { id: recordId } });
      break;
    case "team": {
      const user = await prisma.user.findUnique({
        where: { id: recordId },
        select: { id: true, role: true, active: true },
      });
      if (!user) return { error: "Team account not found." };
      if (recordId === actor.id) return { error: "You cannot delete your own administrator account." };
      if (user.role === "SUPER_ADMIN" && user.active) {
        const activeAdmins = await prisma.user.count({
          where: { role: "SUPER_ADMIN", active: true },
        });
        if (activeAdmins <= 1) return { error: "The last active super administrator cannot be deleted." };
      }
      await prisma.user.delete({ where: { id: recordId } });
      break;
    }
    default:
      return { error: "This section is read-only." };
  }

  invalidateAdminAndPublic(section);
  return { success: true };
}
