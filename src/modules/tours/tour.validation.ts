import { z } from "zod";
import { imageUrlSchema } from "@/lib/image-url";

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
