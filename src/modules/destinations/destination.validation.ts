import { z } from "zod";
import { imageUrlSchema } from "@/lib/image-url";

export const createDestinationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(2000),
  imageUrl: imageUrlSchema.optional(),
});
