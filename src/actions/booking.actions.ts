"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCountryName } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

export type BookingActionState = { error?: string };

const bookingSchema = z.object({
  tourSlug: z.string().min(1),
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(160, "Name must be 160 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  countryCode: z.string().refine((code) => getCountryName(code) !== null, "Select a country."),
  adults: z.coerce.number().int().min(1).max(12),
  children: z.coerce.number().int().min(0).max(12),
  infants: z.coerce.number().int().min(0).max(4),
  departureDate: z.string().date("Select a valid departure date."),
  tourType: z.enum(["SHARED", "PRIVATE"]),
  specialRequests: z.string().trim().max(2000).optional(),
  travellerNames: z.array(z.string().trim().max(160)).max(24),
});

function splitName(name: string) {
  const [firstName, ...lastName] = name.trim().split(/\s+/);
  return { firstName, lastName: lastName.join(" ") };
}

export async function createBookingAction(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const parsed = bookingSchema.safeParse({
    tourSlug: formData.get("tourSlug"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    countryCode: formData.get("countryCode"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    infants: formData.get("infants"),
    departureDate: formData.get("departureDate"),
    tourType: formData.get("tourType"),
    specialRequests: formData.get("specialRequests") ?? "",
    travellerNames: formData.getAll("travellerName").map(String),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const input = parsed.data;
  const startDate = new Date(`${input.departureDate}T00:00:00.000Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (startDate < today) return { error: "Choose a future departure date." };

  const tour = await prisma.tour.findFirst({
    where: { slug: input.tourSlug, status: "PUBLISHED" },
    include: { prices: { orderBy: { validFrom: "desc" }, take: 1 } },
  });
  if (!tour) return { error: "This tour is no longer available. Please choose another tour." };

  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + tour.durationDays - 1);
  const adultPrice = Number(tour.basePrice);
  const childPrice = tour.prices[0]?.childPrice == null
    ? adultPrice
    : Number(tour.prices[0].childPrice);
  const infantPrice = tour.prices[0]?.infantPrice == null
    ? 0
    : Number(tour.prices[0].infantPrice);
  const subtotal =
    adultPrice * input.adults +
    childPrice * input.children +
    infantPrice * input.infants;
  const contactName = splitName(input.fullName);
  const country = getCountryName(input.countryCode);
  if (!country) return { error: "Select a valid country." };

  const travellerEntries = input.travellerNames
    .map((name, index) => ({ name, index }))
    .filter(({ name }) => name.length > 0)
    .map(({ name, index }) => ({
      ...splitName(name),
      travellerType: index < input.adults ? "ADULT" : "CHILD",
      nationality: country,
    }));

  const reference = `ST-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
  await prisma.$transaction(async (transaction) => {
    const customer = await transaction.customer.create({
      data: {
        ...contactName,
        email: input.email,
        phone: input.phone,
        country,
      },
    });

    await transaction.booking.create({
      data: {
        reference,
        tourId: tour.id,
        customerId: customer.id,
        status: "REQUESTED",
        paymentStatus: "PENDING",
        bookingOption: `REQUEST_BOOKING_${input.tourType}`,
        travelStartDate: startDate,
        travelEndDate: endDate,
        adults: input.adults,
        children: input.children,
        infants: input.infants,
        currency: tour.currency,
        subtotal,
        totalAmount: subtotal,
        tourTitleSnapshot: tour.title,
        priceSnapshot: {
          adultPrice,
          childPrice,
          infantPrice,
          adults: input.adults,
          children: input.children,
          infants: input.infants,
          tourType: input.tourType,
        },
        specialRequests: input.specialRequests || null,
        travellers: { create: travellerEntries },
        statusHistory: {
          create: {
            toStatus: "REQUESTED",
            note: "Booking request submitted from the website.",
          },
        },
      },
    });
  });

  revalidatePath("/admin/bookings");
  redirect(`/booking/confirmation/${reference}`);
}
