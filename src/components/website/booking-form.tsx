"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Headphones,
  MapPin,
  Users,
} from "lucide-react";
import {
  createBookingAction,
  type BookingActionState,
} from "@/actions/booking.actions";
import { contactDetails } from "@/lib/contact";
import { countryFlag, type countries } from "@/lib/countries";
import styles from "./booking-form.module.css";

type Country = (typeof countries)[number];

type BookingFormProps = {
  tour: {
    slug: string;
    title: string;
    imageUrl: string;
    days: number;
    nights: number;
    durationLabel: string | null;
    currency: string;
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    destinations: string[];
    highlights: string[];
  };
  countries: Country[];
  showPrices: boolean;
};

const initialState: BookingActionState = {};

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className={styles.sectionTitle}>
      {icon}
      {children}
    </h2>
  );
}

export function BookingForm({ tour, countries, showPrices }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(createBookingAction, initialState);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("LK");
  const total =
    adults * tour.adultPrice +
    children * tour.childPrice +
    infants * tour.infantPrice;
  const nameCount = adults + children;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="tourSlug" value={tour.slug} />
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/tour-packages">Tour Packages</Link>
          <span>/</span>
          <Link href={`/tour-packages/${tour.slug}`}>{tour.title}</Link>
          <span>/</span>
          <span>Booking</span>
        </nav>
        <h1>
          Complete Your <span>Booking</span>
        </h1>
        <p>Review your trip details, select your preferences and send your booking request.</p>
        <ol className={styles.steps} aria-label="Booking steps">
          <li className={styles.activeStep}><span>1</span>Your Details</li>
          <li><span>2</span>Request Review</li>
          <li><span>3</span>Confirmation</li>
        </ol>
      </header>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <section className={styles.panel}>
            <SectionTitle icon={<Users size={20} />}>Traveller Information</SectionTitle>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="countryCode">Select Country <b>*</b></label>
                <select
                  id="countryCode"
                  name="countryCode"
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  required
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {countryFlag(country.code)}　{country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="fullName">Full Name <b>*</b></label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  minLength={3}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email Address <b>*</b></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className={`${styles.field} ${styles.phoneField}`}>
                <label htmlFor="phone">Phone Number <b>*</b></label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Include country dialing code"
                  required
                  minLength={7}
                  maxLength={30}
                />
              </div>
            </div>

            <div className={styles.divider} />

            <SectionTitle icon={<Users size={20} />}>Travellers</SectionTitle>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="adults">Adults (12+) <b>*</b></label>
                <select
                  id="adults"
                  name="adults"
                  value={adults}
                  onChange={(event) => setAdults(Number(event.target.value))}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="children">Children (2–11)</label>
                <select
                  id="children"
                  name="children"
                  value={children}
                  onChange={(event) => setChildren(Number(event.target.value))}
                >
                  {Array.from({ length: 13 }, (_, index) => index).map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="infants">Infants (0–1)</label>
                <select
                  id="infants"
                  name="infants"
                  value={infants}
                  onChange={(event) => setInfants(Number(event.target.value))}
                >
                  {Array.from({ length: 5 }, (_, index) => index).map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </div>
            <details className={styles.optionalNames}>
              <summary>Add traveller names (optional)</summary>
              <div className={styles.travellerNames}>
                {Array.from({ length: nameCount }, (_, index) => (
                  <input
                    key={index}
                    name="travellerName"
                    aria-label={`${index < adults ? "Adult" : "Child"} ${index < adults ? index + 1 : index - adults + 1} traveller name`}
                    placeholder={index < adults ? `Adult ${index + 1} full name` : `Child ${index - adults + 1} full name`}
                    autoComplete="off"
                  />
                ))}
              </div>
            </details>

            <div className={styles.divider} />

            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="departureDate">Preferred Departure Date <b>*</b></label>
                <input id="departureDate" name="departureDate" type="date" min={today} required />
              </div>
              <fieldset className={`${styles.field} ${styles.tourType}`}>
                <legend>Tour Type</legend>
                <label><input type="radio" name="tourType" value="SHARED" defaultChecked /> Shared Tour</label>
                <label><input type="radio" name="tourType" value="PRIVATE" /> Private Tour</label>
              </fieldset>
            </div>
            <div className={`${styles.field} ${styles.requests}`}>
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={3}
                maxLength={2000}
                placeholder="Tell us about any accessibility needs or special requests."
              />
            </div>
          </section>

        </div>

        <aside className={styles.summary}>
          <h2><CalendarDays size={20} /> Tour Summary</h2>
          <div className={styles.summaryImage}>
            <Image src={tour.imageUrl} alt={tour.title} fill sizes="(max-width: 900px) 100vw, 36vw" unoptimized />
          </div>
          <div className={styles.summaryBody}>
            <h3>{tour.title}</h3>
            <ul className={styles.facts}>
              <li><CalendarDays size={15} /> {tour.durationLabel ?? `${tour.days} Days / ${tour.nights} Nights`}</li>
              <li><MapPin size={15} /> {tour.destinations.length ? tour.destinations.join(" · ") : "Sri Lanka"}</li>
            </ul>
            {tour.highlights.length > 0 && (
              <>
                <h4>Tour Highlights</h4>
                <ul className={styles.highlights}>
                  {tour.highlights.map((highlight) => (
                    <li key={highlight}><Check size={15} /> {highlight}</li>
                  ))}
                </ul>
              </>
            )}
            {showPrices ? (
              <div className={styles.priceDetails}>
                <h4>Price Details</h4>
                <p><span>Adults ({adults})</span><span>{money(tour.adultPrice, tour.currency)} × {adults}</span><strong>{money(tour.adultPrice * adults, tour.currency)}</strong></p>
                {children > 0 && <p><span>Children ({children})</span><span>{money(tour.childPrice, tour.currency)} × {children}</span><strong>{money(tour.childPrice * children, tour.currency)}</strong></p>}
                {infants > 0 && <p><span>Infants ({infants})</span><span>{money(tour.infantPrice, tour.currency)} × {infants}</span><strong>{money(tour.infantPrice * infants, tour.currency)}</strong></p>}
                <div className={styles.total}><span>Estimated Total</span><strong>{money(total, tour.currency)}</strong></div>
                <small>Final price may be confirmed by our travel team.</small>
              </div>
            ) : (
              <p className={styles.priceDetails}>Contact our travel team for a tailored quote.</p>
            )}
          </div>
          <div className={styles.help}>
            <Headphones size={24} />
            <div>
              <strong>Need Help?</strong>
              <span>Our travel experts are here to assist you.</span>
              {contactDetails.sriLankaPhones.map((phone) => (
                <a href={`tel:${phone.href}`} key={phone.href}>{phone.number}</a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {state.error && <p className={styles.error} role="alert">{state.error}</p>}

      <footer className={styles.footer}>
        <Link href={`/tour-packages/${tour.slug}`} className={styles.back}><ArrowLeft size={17} /> Back to Tour Details</Link>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Submitting…" : "Submit Booking Request"}
          <ArrowRight size={17} />
        </button>
      </footer>
    </form>
  );
}
