import { z } from "zod";
import { imageUrlSchema } from "@/lib/image-url";

const itineraryActivitySchema = z.object({
  timeLabel: z.string().trim().max(80).default(""),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).default(""),
  imageUrl: imageUrlSchema.default(""),
});

const itineraryDaySchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(5000).default(""),
  distanceKm: z.preprocess(
    (value) => value === "" || value == null ? null : Number(value),
    z.number().finite().min(0).nullable(),
  ),
  drivingMinutes: z.preprocess(
    (value) => value === "" || value == null ? null : Number(value),
    z.number().finite().int().min(0).nullable(),
  ),
  overnightAt: z.string().trim().max(160).default(""),
  accommodation: z.string().trim().max(160).default(""),
  meals: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  activities: z.array(itineraryActivitySchema).max(30).default([]),
});

export const itineraryDaysSchema = z.string().default("[]").transform((value, context) => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    context.addIssue({ code: "custom", message: "Invalid itinerary data." });
    return z.NEVER;
  }
}).pipe(z.array(itineraryDaySchema).max(60));

export const createTourSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().min(10).max(500),
  description: z.string().default(""),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  durationLabel: z.string().trim().max(80).optional().default(""),
  basePrice: z.coerce.number().positive(),
  currency: z.string().length(3).default("USD"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  showPrice: z.boolean().default(true),
  itineraryDays: itineraryDaysSchema,
  coverImageUrl: imageUrlSchema.optional(),
  destinationIds: z.array(z.string().min(1).max(200)).max(100).default([]),
  attractionIds: z.array(z.string().min(1).max(200)).max(100).default([]),
  activityIds: z.array(z.string().min(1).max(200)).max(100).default([]),
}).superRefine(({ destinationIds, attractionIds, activityIds }, context) => {
  for (const [field, ids] of Object.entries({
    destinationIds,
    attractionIds,
    activityIds,
  })) {
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        path: [field],
        message: "An item can only be selected once.",
      });
    }
  }
});
