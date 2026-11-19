"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { imageUrlSchema } from "@/lib/image-url";

const experienceSchema = z.object({
  kind: z.enum(["attractions", "activities"]),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(5000),
  imageUrl: imageUrlSchema,
});

export async function createExperienceAction(formData: FormData) {
  await requirePermission("CATALOGUE_MANAGE");
  const parsed = experienceSchema.parse({
    kind: String(formData.get("kind") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  });
  const data = {
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description || null,
    imageUrl: parsed.imageUrl || null,
  };

  if (parsed.kind === "attractions") {
    await prisma.attraction.create({ data });
  } else {
    await prisma.activity.create({ data });
  }

  revalidatePath(`/admin/${parsed.kind}`);
  revalidatePath("/tour-packages");
  redirect(`/admin/${parsed.kind}`);
}
