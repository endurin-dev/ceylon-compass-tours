import { z } from "zod";

export const imageUrlSchema = z.union([
  z.string().regex(/^\/uploads\/[A-Za-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i),
  z.literal(""),
]);
