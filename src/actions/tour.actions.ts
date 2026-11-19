"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { requirePermission } from "@/lib/permissions";
import { createTour } from "@/modules/tours/tour.service";

export async function createTourAction(formData: FormData) {
  await requirePermission("TOURS_CREATE");

  const featuredValue = formData.get("featured") === "true";
  const showPriceValue = formData.get("showPrice");
  if (showPriceValue !== "true" && showPriceValue !== "false") {
    throw new Error("Choose whether the tour price should be shown publicly.");
  }
  try {
    await createTour({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      durationDays: formData.get("durationDays"),
      durationNights: formData.get("durationNights"),
      durationLabel: String(formData.get("durationLabel") ?? ""),
      basePrice: formData.get("basePrice"),
      currency: String(formData.get("currency") ?? "USD"),
      status: String(formData.get("status") ?? "DRAFT"),
      featured: featuredValue,
      showPrice: showPriceValue === "true",
      itineraryDays: String(formData.get("itineraryDays") ?? "[]"),
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
      destinationIds: formData.getAll("destinationIds").map(String),
      attractionIds: formData.getAll("attractionIds").map(String),
      activityIds: formData.getAll("activityIds").map(String),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      redirect("/admin/tours/new?error=validation");
    }
    throw error;
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tour-packages");
  redirect("/admin/tours");
}
