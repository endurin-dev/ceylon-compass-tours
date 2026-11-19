"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { countries } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

export type EnquiryActionState = {
  error?: string;
  success?: boolean;
};

const countryNames = new Set(countries.map(({ name }) => name));
const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(30).optional(),
  country: z.string().optional(),
  topic: z.enum(["Tour packages", "Custom itinerary", "Existing booking", "Other"]),
  message: z.string().trim().min(10, "Please tell us a little more about your enquiry.").max(4000),
  website: z.string().max(0).optional(),
});

export async function submitEnquiryAction(
  _previousState: EnquiryActionState,
  formData: FormData,
): Promise<EnquiryActionState> {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    country: formData.get("country") ?? "",
    topic: formData.get("topic"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const input = parsed.data;
  if (input.website) return { success: true };
  if (input.country && !countryNames.has(input.country)) {
    return { error: "Select a valid country." };
  }

  await prisma.enquiry.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      country: input.country || null,
      message: `Topic: ${input.topic}\n\n${input.message}`,
    },
  });

  revalidatePath("/admin/enquiries");
  return { success: true };
}
