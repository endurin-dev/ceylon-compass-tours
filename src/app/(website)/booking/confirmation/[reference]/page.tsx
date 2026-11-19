import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Check,
  CreditCard,
  Headphones,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { contactDetails } from "@/lib/contact";
import { PrintBookingButton } from "./print-booking-button";
import styles from "./confirmation.module.css";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "To be arranged";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatMoney(amount: unknown, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function bookingOptionLabel(option: string) {
  if (option.startsWith("PAY_LATER")) return "Pay Later";
  if (option.startsWith("REQUEST_BOOKING")) return "Request Booking";
  return "Booking request";
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: {
      customer: true,
      tour: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          tourDestinations: {
            include: { destination: { select: { name: true } } },
            orderBy: { sortOrder: "asc" },
          },
          inclusions: { orderBy: { sortOrder: "asc" }, take: 6 },
        },
      },
      travellers: { orderBy: { id: "asc" } },
    },
  });
  if (!booking) notFound();
  const showPrices = booking.tour.showPrice;

  const tourImage =
    booking.tour.heroImageUrl ??
    booking.tour.coverImageUrl ??
    booking.tour.images[0]?.url ??
    "/images/hero-sigiriya.jpg";
  const tourType = booking.bookingOption.includes("_PRIVATE") ? "Private Tour" : "Shared Tour";
  const travellerCount = booking.adults + booking.children + booking.infants;
  const travellerLabel = [
    booking.adults > 0 ? `${booking.adults} Adult${booking.adults === 1 ? "" : "s"}` : null,
    booking.children > 0 ? `${booking.children} Child${booking.children === 1 ? "" : "ren"}` : null,
    booking.infants > 0 ? `${booking.infants} Infant${booking.infants === 1 ? "" : "s"}` : null,
  ].filter(Boolean).join(", ");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.successIcon}><Check size={34} strokeWidth={3} /></span>
          <h1>Booking <span>Request Received!</span></h1>
          <p>Thank you for choosing Superstar Travels Tours.</p>
          <p className={styles.heroNote}>
            Our travel team will review your details and contact you to confirm availability and next steps.
          </p>
        </div>
        <div className={styles.referenceCard}>
          <div><small>Booking Reference</small><strong>{booking.reference}</strong></div>
          <div><small>Request Date</small><strong>{formatDate(booking.createdAt)}</strong></div>
          <div><small>Status</small><strong className={styles.status}><span />Pending confirmation</strong></div>
        </div>
      </section>

      <div className={styles.detailsGrid}>
        <section className={styles.card}>
          <h2><CalendarDays size={20} /> Your Tour Details</h2>
          <div className={styles.tourDetail}>
            <div className={styles.tourImage}>
              <Image src={tourImage} alt={booking.tourTitleSnapshot} fill sizes="(max-width: 700px) 100vw, 220px" unoptimized />
            </div>
            <div className={styles.tourInfo}>
              <h3>{booking.tourTitleSnapshot}</h3>
              <p className={styles.tourFacts}>
                <span><CalendarDays size={15} /> {booking.tour.durationLabel ?? `${booking.tour.durationDays} Days / ${booking.tour.durationNights} Nights`}</span>
                <span><MapPin size={15} /> {booking.tour.tourDestinations.map(({ destination }) => destination.name).join(", ") || "Sri Lanka"}</span>
              </p>
              {booking.tour.inclusions.length > 0 && (
                <>
                  <h4>Tour Highlights</h4>
                  <ul className={styles.highlights}>
                    {booking.tour.inclusions.map((item) => (
                      <li key={item.id}><Check size={15} />{item.label}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className={styles.tripMeta}>
            <div><CalendarDays size={18} /><span><b>Your Travel Dates</b>{formatDate(booking.travelStartDate)} – {formatDate(booking.travelEndDate)}</span></div>
            <div><Users size={18} /><span><b>Travellers</b>{travellerLabel || `${travellerCount} travellers`}</span></div>
          </div>
          {showPrices && (
            <div className={styles.priceBox}>
              <span>Estimated Total</span>
              <strong>{formatMoney(booking.totalAmount, booking.currency)}</strong>
              <small>Final price will be confirmed by our travel team.</small>
            </div>
          )}
        </section>

        <section className={styles.card}>
          <h2><Users size={20} /> Customer Details</h2>
          <dl className={styles.customerDetails}>
            <div><dt>Name</dt><dd>{[booking.customer.firstName, booking.customer.lastName].filter(Boolean).join(" ")}</dd></div>
            <div><dt>Email</dt><dd>{booking.customer.email}</dd></div>
            <div><dt>Phone</dt><dd>{booking.customer.phone || "Not provided"}</dd></div>
            <div><dt>Country</dt><dd>{booking.customer.country || "Not provided"}</dd></div>
          </dl>
          <div className={styles.bookingPref}>
            <CreditCard size={19} />
            <div><strong>Booking Preference</strong><span>{bookingOptionLabel(booking.bookingOption)} · {tourType}</span></div>
          </div>
          {booking.specialRequests && (
            <div className={styles.specialRequests}>
              <strong>Special Requests</strong>
              <p>{booking.specialRequests}</p>
            </div>
          )}
          {booking.travellers.length > 0 && (
            <div className={styles.travellerList}>
              <strong>Traveller Names</strong>
              {booking.travellers.map((traveller) => (
                <span key={traveller.id}>{traveller.firstName} {traveller.lastName} ({traveller.travellerType.toLowerCase()})</span>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className={styles.contactBanner}>
        <Mail size={24} />
        <div>
          <h2>Your request is with our travel team</h2>
          <p>We’ll contact you at {booking.customer.email} with availability and booking details.</p>
        </div>
        <div className={styles.help}>
          <Headphones size={25} />
          <span>
            <b>Need Help?</b>
            {contactDetails.sriLankaPhones.map((phone) => (
              <a href={`tel:${phone.href}`} key={phone.href}>{phone.number}</a>
            ))}
            <a href={`tel:${contactDetails.francePhone.href}`}>{contactDetails.francePhone.number} (France)</a>
          </span>
        </div>
      </section>

      <div className={styles.actions}>
        <PrintBookingButton />
        <Link href="/" className={styles.secondaryButton}>Back to Homepage</Link>
        <Link href="/tour-packages" className={styles.secondaryButton}>Explore More Tours</Link>
      </div>
    </main>
  );
}
