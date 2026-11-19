import { notFound } from "next/navigation";
import { BookingForm } from "@/components/website/booking-form";
import styles from "@/components/website/booking-form.module.css";
import { countries } from "@/lib/countries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ tourSlug: string }>;
}) {
  const { tourSlug } = await params;
  const tour = await prisma.tour.findFirst({
    where: { slug: tourSlug, status: "PUBLISHED" },
    include: {
      tourDestinations: {
        include: { destination: { select: { name: true } } },
        orderBy: { sortOrder: "asc" },
      },
      inclusions: { orderBy: { sortOrder: "asc" }, take: 4 },
      prices: { orderBy: { validFrom: "desc" }, take: 1 },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  if (!tour) notFound();
  const showPrices = tour.showPrice;

  const adultPrice = Number(tour.basePrice);
  const childPrice =
    tour.prices[0]?.childPrice == null
      ? adultPrice
      : Number(tour.prices[0].childPrice);
  const infantPrice =
    tour.prices[0]?.infantPrice == null
      ? 0
      : Number(tour.prices[0].infantPrice);

  return (
    <main className={`${styles.page} container section`}>
      <BookingForm
        countries={countries}
        showPrices={showPrices}
        tour={{
          slug: tour.slug,
          title: tour.title,
          imageUrl:
            tour.heroImageUrl ??
            tour.coverImageUrl ??
            tour.images[0]?.url ??
            "/images/hero-sigiriya.jpg",
          days: tour.durationDays,
          nights: tour.durationNights,
          durationLabel: tour.durationLabel,
          currency: tour.currency,
          adultPrice: showPrices ? adultPrice : 0,
          childPrice: showPrices ? childPrice : 0,
          infantPrice: showPrices ? infantPrice : 0,
          destinations: tour.tourDestinations.map(({ destination }) => destination.name),
          highlights:
            tour.inclusions.length > 0
              ? tour.inclusions.map((inclusion) => inclusion.label)
              : tour.tourDestinations.map(({ destination }) => destination.name).slice(0, 4),
        }}
      />
    </main>
  );
}
