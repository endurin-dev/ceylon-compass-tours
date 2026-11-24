import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { TourStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import styles from "./tour-detail.module.css";

export const dynamic = "force-dynamic";

const body = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const script = Caveat({ subsets: ["latin"], display: "swap", variable: "--font-script" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const FALLBACK_IMAGE = "/images/hero-sigiriya.jpg";

function money(amount: unknown, currency: string) {
  const n = Number(amount);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString("en-US")}`;
  }
}

async function getTour(slug: string) {
  return prisma.tour.findFirst({
    where: { slug, status: TourStatus.PUBLISHED },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      tourDestinations: {
        include: { destination: { select: { id: true, name: true, slug: true, imageUrl: true } } },
        orderBy: { sortOrder: "asc" },
      },
      tourAttractions: {
        include: { attraction: { select: { id: true, name: true, description: true, imageUrl: true } } },
        orderBy: { sortOrder: "asc" },
      },
      tourActivities: {
        include: { activity: { select: { id: true, name: true, description: true, imageUrl: true } } },
        orderBy: { sortOrder: "asc" },
      },
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
        include: { activities: { orderBy: { sortOrder: "asc" } } },
      },
      inclusions: { orderBy: { sortOrder: "asc" } },
      exclusions: { orderBy: { sortOrder: "asc" } },
    },
  });
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return {
      title: "Tour Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const image =
    tour.heroImageUrl ??
    tour.coverImageUrl ??
    tour.images[0]?.url ??
    FALLBACK_IMAGE;

  const rawDescription =
    tour.shortDescription ??
    tour.description ??
    `Explore ${tour.title}, one of the Sri Lanka travel experiences offered by Ceylon Compass.`;

  const description = rawDescription
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  const title = `${tour.title} | ${tour.durationLabel ?? `${tour.durationDays}-Day`} Sri Lanka Tour`;

  const canonical = `/tour-packages/${tour.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Ceylon Compass",
      title,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${tour.title} - Sri Lanka tour by Ceylon Compass`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}


const I = {
  pin: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  cal: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  check: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>,
  x: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>,
  arrow: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  down: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>,
};

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();
  const showPrices = tour.showPrice;

  const imageUrl = tour.heroImageUrl ?? tour.coverImageUrl ?? tour.images[0]?.url ?? FALLBACK_IMAGE;
  const destinations = tour.tourDestinations.map(({ destination }) => destination);
  const attractions = tour.tourAttractions.map(({ attraction }) => attraction);
  const activities = tour.tourActivities.map(({ activity }) => activity);
  const route = destinations.map((d) => d.name).join(" → ");
  const price = money(tour.basePrice, tour.currency);
  const paragraphs = (tour.description ?? "").split(/\n{1,}/).filter(Boolean);
  const intro = tour.shortDescription ?? paragraphs[0] ?? "";

  const gallery = Array.from(
    new Set([
      ...destinations.map((destination) => destination.imageUrl),
      ...attractions.map((attraction) => attraction.imageUrl),
      ...activities.map((activity) => activity.imageUrl),
    ].filter((url): url is string => Boolean(url) && url !== imageUrl)),
  );
  const collage = gallery.slice(0, 3);

  const similar = await prisma.tour.findMany({
    where: {
      status: TourStatus.PUBLISHED,
      id: { not: tour.id },
      ...(destinations.length
        ? { tourDestinations: { some: { destinationId: { in: destinations.map((d) => d.id) } } } }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true, title: true, slug: true, coverImageUrl: true,
      durationDays: true, durationLabel: true, basePrice: true, currency: true,
      showPrice: true,
    },
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    tour.itineraryDays.length ? { id: "itinerary", label: "Itinerary" } : null,
    destinations.length ? { id: "destinations", label: "Destinations" } : null,
    attractions.length ? { id: "attractions", label: "Attractions" } : null,
    activities.length ? { id: "activities", label: "Activities" } : null,
    { id: "inclusions", label: "Inclusions" },
    similar.length ? { id: "similar", label: "Similar Tours" } : null,
  ].filter((t): t is { id: string; label: string } => t !== null);

 
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tour Packages",
            item: `${SITE_URL}/tour-packages`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tour.title,
            item: `${SITE_URL}/tour-packages/${tour.slug}`,
          },
        ],
      },
      {
        "@type": "TouristTrip",
        name: tour.title,
        description: intro,
        image: imageUrl.startsWith("http")
          ? imageUrl
          : `${SITE_URL}${imageUrl}`,
        url: `${SITE_URL}/tour-packages/${tour.slug}`,
        touristType: "Leisure",
        itinerary: {
          "@type": "ItemList",
          itemListElement: tour.itineraryDays.map((day) => ({
            "@type": "ListItem",
            position: day.dayNumber,
            name: `Day ${day.dayNumber}: ${day.title}`,
            description: day.description || undefined,
          })),
        },
        ...(destinations.length > 0
          ? {
              touristDestination: destinations.map((destination) => ({
                "@type": "TouristDestination",
                name: destination.name,
              })),
            }
          : {}),
        ...(showPrices
          ? {
              offers: {
                "@type": "Offer",
                price: Number(tour.basePrice),
                priceCurrency: tour.currency,
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}/booking/${tour.slug}`,
              },
            }
          : {}),
      },
    ],
  };


  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ---------- Hero ---------- */}
      <header className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.heroImg} src={imageUrl} alt={tour.title} fetchPriority="high" decoding="async" />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/tour-packages">Tour Packages</Link>
          </nav>
          <span className={styles.pill}>{I.pin} Sri Lanka</span>
          <h1 className={styles.title}>{tour.title}</h1>
          {intro && <p className={styles.heroText}>{intro}</p>}
          <ul className={styles.heroMeta}>
            <li>{I.cal} {tour.durationLabel ?? `${tour.durationDays} Days / ${tour.durationNights} Nights`}</li>
            {route && <li>{I.pin} {route}</li>}
          </ul>
          <p className={styles.heroScript} aria-hidden="true">Explore Sri Lanka</p>
        </div>
      </header>

      {/* ---------- Tabs ---------- */}
      <nav className={styles.tabs} aria-label="Tour sections">
        <ul>
          {tabs.map((t) => (
            <li key={t.id}><a href={`#${t.id}`}>{t.label}</a></li>
          ))}
        </ul>
      </nav>

      <div className={styles.layout}>
        {/* ---------- Main column ---------- */}
        <div className={styles.main}>
          <section id="overview" className={styles.section}>
            <p className={styles.kicker}>Tour Overview</p>
            <div className={styles.overview}>
              <div>
                <h2 className={styles.h2}>Discover the Best of Sri Lanka</h2>
                {paragraphs.length ? (
                  paragraphs.map((p, i) => <p key={i} className={styles.copy}>{p}</p>)
                ) : (
                  <p className={styles.copy}>Contact us for the full tour description.</p>
                )}
              </div>
              {collage.length > 0 && (
                <div className={styles.collage} aria-hidden="true">
                  {collage.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" loading="lazy" decoding="async" className={styles[`shot${i}` as "shot0"]} />
                  ))}
                </div>
              )}
            </div>

          </section>

          {destinations.length > 0 && (
            <section id="destinations" className={`${styles.section} ${styles.destinationsSection}`}>
              <div className={styles.destinationsHeader}>
                <div>
                  <p className={styles.kicker}>A route made for discovery</p>
                  <h2 className={styles.h2}>Every stop has a story</h2>
                  <p className={styles.copy}>From the first arrival to the final farewell, explore the places that make this journey unforgettable.</p>
                </div>
                <div className={styles.routeSummary}>
                  <span className={styles.routeSummaryIcon}>{I.pin}</span>
                  <strong>{String(destinations.length).padStart(2, "0")}</strong>
                  <span>destinations<br />one unforgettable journey</span>
                </div>
              </div>
              <ol className={`${styles.destinationGrid}${destinations.length >= 3 ? ` ${styles.hasFeaturedDestination}` : ""}`}>
                {destinations.map((destination, index) => (
                  <li className={styles.destinationCard} key={destination.id}>
                    {destination.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={destination.imageUrl} alt="" loading="lazy" decoding="async" />
                    ) : null}
                    <span className={styles.destinationShade} aria-hidden="true" />
                    <span className={styles.destinationNumber}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{index === 0 ? "The beginning" : index === destinations.length - 1 ? "The finale" : "Along the way"}</span>
                    </span>
                    <div className={styles.destinationTitle}>
                      <span>DISCOVER</span>
                      <h3>{destination.name}</h3>
                    </div>
                    <span className={styles.destinationArrow} aria-hidden="true">{I.arrow}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* ---------- Places to discover (attractions) ---------- */}
          {attractions.length > 0 && (
            <section id="attractions" className={`${styles.section} ${styles.stripsSection}`}>
              <div className={styles.stripsHead}>
                <div>
                  <p className={styles.kicker}>Places to discover</p>
                  <h2 className={styles.h2}>Landmarks on your route</h2>
                </div>
                <span className={styles.stripsCount}>
                  <strong>{String(attractions.length).padStart(2, "0")}</strong> included
                </span>
              </div>

              <ul className={styles.strips}>
                {attractions.map((attraction, index) => (
                  <li className={styles.strip} key={attraction.id}>
                    <div className={styles.stripText}>
                      <span className={styles.stripNo} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{attraction.name}</h3>
                        {attraction.description ? <p>{attraction.description}</p> : null}
                      </div>
                    </div>
                    <div className={styles.stripMedia}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attraction.imageUrl ?? imageUrl}
                        alt={attraction.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activities.length > 0 && (
            <section id="activities" className={`${styles.section} ${styles.experiencesSection}`}>
              <p className={styles.kicker}>Make it memorable</p>
              <h2 className={styles.h2}>Activities included</h2>
              <ul className={styles.experienceGrid}>
                {activities.map((activity) => (
                  <li className={styles.experienceCard} key={activity.id}>
                    {activity.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={activity.imageUrl} alt={activity.name} loading="lazy" decoding="async" />
                    ) : null}
                    <div>
                      <h3>{activity.name}</h3>
                      {activity.description ? <p>{activity.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tour.itineraryDays.length > 0 && (
            <section id="itinerary" className={`${styles.section} ${styles.itinerarySection}`}>
              <header className={styles.itineraryHeader}>
                <div>
                  <p className={styles.kicker}>The journey, day by day</p>
                  <h2 className={styles.h2}>Your {tour.durationLabel ?? `${tour.durationDays}-Day`} Journey</h2>
                  <p className={styles.itineraryIntro}>A thoughtfully paced adventure, with something memorable waiting around every turn.</p>
                </div>
                <div className={styles.itineraryLength}>
                  <span>{tour.durationLabel ?? String(tour.durationDays).padStart(2, "0")}</span>
                  <span>{tour.durationLabel ? "tour duration" : <>days<br />of discovery</>}</span>
                </div>
              </header>
              {tour.itineraryDays.length > 0 && (
                <ol className={styles.timeline}>
                  {tour.itineraryDays.map((day) => (
                    <li className={styles.dayCard} key={day.id}>
                      <div className={styles.dayMarker}>
                        <span>DAY</span>
                        <strong>{String(day.dayNumber).padStart(2, "0")}</strong>
                      </div>
                      <div className={styles.dayBody}>
                        <div className={styles.dayHeading}>
                          <h3>{day.title}</h3>
                          {day.overnightAt && <span className={styles.overnightTag}>Stay · {day.overnightAt}</span>}
                        </div>
                        {day.description && <p>{day.description}</p>}
                        {(day.accommodation || day.meals.length > 0 || day.distanceKm != null || day.drivingMinutes != null) && (
                          <p className={styles.dayMeta}>
                            {[
                              day.accommodation ? `Stay: ${day.accommodation}` : null,
                              day.meals.length ? `Meals: ${day.meals.join(", ")}` : null,
                              day.distanceKm != null ? `${day.distanceKm.toString()} km` : null,
                              day.drivingMinutes != null ? `${day.drivingMinutes} min drive` : null,
                            ].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        {day.activities.length > 0 && (
                          <ul>
                            {day.activities.map((a) => (
                              <li className={a.timeLabel ? styles.timedActivity : undefined} key={a.id}>
                                {a.timeLabel ? <span className={styles.activityTime}>{a.timeLabel}</span> : null}
                                <span>
                                  <strong>{a.title}</strong>
                                  {a.description && <small className={styles.activityDescription}>{a.description}</small>}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}

          {similar.length > 0 && (
            <section id="similar" className={`${styles.section} ${styles.similarSection}`}>
              <div className={styles.rowHead}>
                <h2 className={styles.similarTitle}>Similar Tours</h2>
                <Link href="/tour-packages" className={styles.textLink}>View All Tours {I.arrow}</Link>
              </div>
              <ul className={styles.similar}>
                {similar.map((s) => (
                  <li key={s.id} className={styles.simCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.coverImageUrl ?? FALLBACK_IMAGE} alt="" loading="lazy" decoding="async" />
                    <div>
                      <h3>
                        <Link href={`/tour-packages/${s.slug}`} className={styles.stretch}>
                          {s.title} ({s.durationLabel ?? `${s.durationDays} Days`})
                        </Link>
                      </h3>
                      {s.showPrice && <p>From {money(s.basePrice, s.currency)}</p>}
                    </div>
                    <span className={styles.go} aria-hidden="true">{I.arrow}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ---------- Sidebar ---------- */}
        <aside className={styles.side}>
          <div className={styles.book} id="book">
            <h2>Book This Tour</h2>
            <div className={styles.bookBody}>
              {showPrices ? (
                <>
                  <p className={styles.from}>From</p>
                  <p className={styles.priceRow}><strong>{price}</strong><span>per person</span></p>
                </>
              ) : (
                <p className={styles.from}>Contact us for a tailored quote</p>
              )}
              <ul className={styles.facts}>
                <li>{I.cal} {tour.durationLabel ?? `${tour.durationDays} Days / ${tour.durationNights} Nights`}</li>
                {route && <li>{I.pin} {route}</li>}
              </ul>
              <Link href={`/booking/${tour.slug}`} className={styles.cta}>Book Tour {I.arrow}</Link>
            </div>
          </div>

          <section id="inclusions" className={`${styles.panel} ${styles.included}`}>
            <h2>What&apos;s Included?</h2>
            {tour.inclusions.length ? (
              <ul className={styles.ticks}>
                {tour.inclusions.map((i) => <li key={i.id}>{I.check} {i.label}</li>)}
              </ul>
            ) : (
              <p className={styles.muted}>Contact us for inclusion details.</p>
            )}
            {tour.exclusions.length > 0 && (
              <>
                <h3 className={styles.sub}>Not Included</h3>
                <ul className={`${styles.ticks} ${styles.crosses}`}>
                  {tour.exclusions.map((i) => <li key={i.id}>{I.x} {i.label}</li>)}
                </ul>
              </>
            )}
          </section>
        </aside>
      </div>

      {/* ---------- Closing banner ---------- */}
      <section className={styles.banner}>
        <div>
          <p className={styles.bannerScript}>Ready to Explore Sri Lanka?</p>
          <p>Book your dream tour today and create unforgettable memories.</p>
        </div>
        <Link href={`/booking/${tour.slug}`} className={styles.cta}>Book Tour {I.arrow}</Link>
      </section>

      {/* ---------- Mobile sticky booking bar ---------- */}
      <div className={styles.mobileBar}>
        {showPrices && (
          <div>
            <small>From</small>
            <strong>{price}</strong>
          </div>
        )}
        <Link href={`/booking/${tour.slug}`} className={styles.cta}>Book Tour</Link>
      </div>
    </main>
  );
}