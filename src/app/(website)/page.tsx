import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kaushan_Script, Playfair_Display } from "next/font/google";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Compass, Facebook, Headphones, Instagram, MapPin, Plane, Search, ShieldCheck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

const script = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const reviewDate = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  const [tours, destinations, destinationOptions, activities, approvedReviews] = await Promise.all([
    prisma.tour.findMany({
      where: { status: "PUBLISHED" },
      include: {
        tourDestinations: {
          include: { destination: { select: { name: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 6, // two rows of three
    }),
    prisma.destination.findMany({
      where: { imageUrl: { not: null } },
      orderBy: { name: "asc" },
      take: 4,
    }),
    prisma.destination.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.activity.findMany({
      where: { imageUrl: { not: null } },
      orderBy: { name: "asc" },
      take: 8,
    }),
    prisma.review.findMany({
      where: { approved: true },
      include: { tour: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const loop = activities.length >= 5; // marquee needs enough cards to fill the width
  const track = loop ? [...activities, ...activities] : activities;

  const reviewCount = approvedReviews.length;
  const reviewAvg = reviewCount
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  return (
    <main>
      <section className={styles.hero}>
        <Image
          src="/images/hero-sigiriya.jpg"
          alt="Sigiriya rock fortress rising above the Sri Lankan forest"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Explore Sri Lanka</p>
            <h1>
              Follow your compass
              <br />
              to the heart of
              <br />
              <span>Sri Lanka</span>
            </h1>
            <p className={styles.subtitle}>Unforgettable journeys. Lifelong memories.</p>

            <form action="/tour-packages" className={styles.searchForm}>
              <label className={styles.searchDestination}>
                <MapPin size={19} aria-hidden="true" />
                <span className={styles.srOnly}>Search tours or destinations</span>
                <input
                  type="search"
                  name="q"
                  placeholder="Where do you want to go?"
                />
              </label>
              <label className={styles.searchSelect}>
                <CalendarDays size={18} aria-hidden="true" />
                <span className={styles.srOnly}>Filter by trip length</span>
                <select name="duration" defaultValue="">
                  <option value="">Any duration</option>
                  <option value="short">Up to 3 days</option>
                  <option value="week">4–7 days</option>
                  <option value="long">8–14 days</option>
                </select>
              </label>
              <label className={styles.searchSelect}>
                <Compass size={18} aria-hidden="true" />
                <span className={styles.srOnly}>Filter by destination</span>
                <select name="destination" defaultValue="">
                  <option value="">All destinations</option>
                  {destinationOptions.map((destination) => (
                    <option value={destination.slug} key={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={styles.searchButton}>
                Search Tours <Search size={16} aria-hidden="true" />
              </button>
            </form>

            <ul className={styles.trustList}>
              <li><ShieldCheck size={19} /><span>Trusted Travel<br />Partner</span></li>
              <li><Headphones size={19} /><span>24/7 Support</span></li>
              <li><Plane size={19} /><span>Best Tour<br />Packages</span></li>
            </ul>
          </div>

          <div className={styles.heroSignature} aria-hidden="true">
            <span className={script.className}>Sri Lanka</span>
            <small>Explore · Experience · Enjoy</small>
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden="true" />
      </section>

      {destinations.length > 0 && (
        <section className={styles.inspiration}>
          <div className={styles.inspirationInner}>
            <div className={styles.inspirationHeader}>
              <div>
                <p className={styles.inspirationLabel}>
                  <Compass size={15} aria-hidden="true" />
                  Find your inspiration
                </p>
                <h2 className={styles.inspirationTitle}>
                  Places to <span className={script.className}>fall in love</span> with
                </h2>
              </div>
              <Link href="/destinations" className={styles.inspirationLink}>
                All destinations <ArrowRight size={17} />
              </Link>
            </div>
            <div className={styles.destinationGrid}>
              {destinations.map((destination, index) => (
                <Link
                  href="/destinations"
                  key={destination.id}
                  className={styles.destinationCard}
                >
                  {destination.imageUrl && (
                    <Image
                      src={destination.imageUrl}
                      alt={destination.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
                      className={styles.destinationImage}
                    />
                  )}
                  <span className={styles.destinationWash} aria-hidden="true" />
                  <span className={styles.destinationNumber} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className={styles.destinationName}>{destination.name}</span>
                  <span className={styles.destinationArrow} aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section className={styles.thingsSection}>
          <div className={styles.thingsInner}>
            <div className={styles.thingsHeader}>
              <div>
                <p className={styles.thingsLabel}>
                  <Compass size={15} aria-hidden="true" />
                  Things to do
                </p>
                <h2 className={styles.thingsTitle}>
                  Moments worth <span className={script.className}>travelling for</span>
                </h2>
              </div>
              <Link href="/activities" className={styles.thingsLink}>
                All activities <ArrowRight size={17} />
              </Link>
            </div>

            <div className={styles.thingsViewport}>
              <ul
                className={`${styles.thingsRail} ${loop ? styles.thingsLoop : ""}`}
                style={{ "--things-duration": `${activities.length * 6}s` } as CSSProperties}
              >
                {track.map((activity, i) => {
                  const index = i % activities.length;
                  const isCopy = i >= activities.length;
                  return (
                    <li
                      key={`${activity.id}-${i}`}
                      className={`${index % 2 ? styles.thingsOffset : ""} ${isCopy ? styles.thingsDup : ""}`}
                      aria-hidden={isCopy || undefined}
                    >
                      <Link
                        href="/activities"
                        className={styles.thingsCard}
                        tabIndex={isCopy ? -1 : undefined}
                      >
                        <span className={styles.thingsPhoto}>
                          {activity.imageUrl && (
                            <Image
                              src={activity.imageUrl}
                              alt={isCopy ? "" : activity.name}
                              fill
                              unoptimized
                              sizes="280px"
                            />
                          )}
                        </span>
                        <span className={styles.thingsNum} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className={styles.thingsInfo}>
                          <span className={styles.thingsIndex} aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.thingsText}>
                            <span className={styles.thingsName}>{activity.name}</span>
                            {activity.description && (
                              <span className={styles.thingsDesc}>{activity.description}</span>
                            )}
                          </span>
                          <span className={styles.thingsGo} aria-hidden="true">
                            <ArrowUpRight size={18} />
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {tours.length > 0 && (
        <section className={styles.toursSection}>
          <div className={styles.toursInner}>
            <div className={styles.toursHeader}>
              <div>
                <p className={styles.toursLabel}>
                  <Compass size={15} aria-hidden="true" />
                  Made for you
                </p>
                <h2 className={styles.toursTitle}>
                  Explore our <span className={script.className}>tours</span>
                </h2>
                <p className={styles.toursIntro}>
                  Ready-made itineraries you can book as they are or shape around your own plans.
                </p>
              </div>
              <Link href="/tour-packages" className={styles.toursLink}>
                View all tours <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <ul className={styles.toursGrid}>
              {tours.map((tour) => {
                const route = tour.tourDestinations
                  .map(({ destination }) => destination.name)
                  .join(" · ");
                return (
                  <li key={tour.id} className={styles.tourCard}>
                    {tour.coverImageUrl && (
                      <Image
                        src={tour.coverImageUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 760px"
                        className={styles.tourImage}
                      />
                    )}
                    <span className={styles.tourShade} aria-hidden="true" />

                    <div className={styles.tourTop}>
                      <span className={styles.tourDuration}>
                        <CalendarDays size={14} aria-hidden="true" />
                        {tour.durationLabel ?? `${tour.durationDays} days / ${tour.durationNights} nights`}
                      </span>
                      {tour.featured && <span className={styles.tourBadge}>★ Featured</span>}
                    </div>

                    <div className={styles.tourContent}>
                      {route && (
                        <p className={styles.tourRoute}>
                          <MapPin size={14} aria-hidden="true" />
                          <span>{route}</span>
                        </p>
                      )}
                      <h3 className={styles.tourTitle}>
                        <Link href={`/tour-packages/${tour.slug}`} className={styles.tourLink}>
                          {tour.title}
                        </Link>
                      </h3>
                      <div className={styles.tourFoot}>
                        {tour.showPrice && (
                          <span className={styles.tourPrice}>
                            <small>From</small>
                            <strong>{formatPrice(Number(tour.basePrice), tour.currency)}</strong>
                          </span>
                        )}
                        <span className={styles.tourGo} aria-hidden="true">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.toursMore}>
              <Link href="/tour-packages" className={styles.toursMoreBtn}>
                Browse all tour packages <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className={styles.confidenceSection}>
        <div className={styles.confidenceCopy}>
          <p className={styles.confidenceEyebrow}>Travel with confidence</p>
          <h2>A little more personal. A lot more memorable.</h2>
          <p className={styles.confidenceDescription}>
            Whether you want a ready-made tour or a journey designed around your
            own interests, our team can help you make the most of every day.
          </p>
          <ul className={styles.confidenceBenefits}>
            {["Thoughtful trip planning", "Local knowledge", "Options for every pace", "Support before you travel"].map((point) => (
              <li className="flex items-center gap-2" key={point}>
                <Check size={18} className="text-emerald-600" /> {point}
              </li>
            ))}
          </ul>
          <Link href="/about" className={styles.confidenceLink}>
            Get to know us <ArrowRight size={17} />
          </Link>
        </div>
        <div className={styles.storyCard}>
          <span className={styles.storyOrbit} aria-hidden="true" />
          <span className={styles.storyIcon}><Compass size={25} /></span>
          <p className={styles.storyEyebrow}>Made for your kind of journey</p>
          <h3>Your next story starts here</h3>
          <p className={styles.storyDescription}>
            Tell us what you want to see, when you plan to travel and who is coming.
            We&apos;ll help you find a trip that feels like yours.
          </p>
          <Link href="/contact" className={styles.storyLink}>
            Talk to our team <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className={styles.socialSection} aria-labelledby="social-title">
        <div className={styles.socialInner}>
          <div className={styles.socialHeading}>
            <p>Postcards, reels & island moments</p>
            <h2 id="social-title">A little Sri Lanka, wherever you scroll.</h2>
            <span>Come along for the views, stories and local moments that make every journey special.</span>
          </div>
          <div className={styles.socialLinks}>
            <a
              className={`${styles.socialLink} ${styles.instagramLink}`}
              href="https://www.ceyloncompass.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Ceylon Compass on Instagram (opens in a new tab)"
            >
              <span className={styles.socialIcon}><Instagram size={25} aria-hidden="true" /></span>
              <span><small className={styles.socialLabel}>PHOTO JOURNAL</small><strong>Instagram</strong><small>@ceyloncompass</small></span>
              <ArrowRight size={19} aria-hidden="true" />
            </a>
            <a
              className={`${styles.socialLink} ${styles.facebookLink}`}
              href="https://www.ceyloncompass.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Ceylon Compass on Facebook (opens in a new tab)"
            >
              <span className={styles.socialIcon}><Facebook size={25} aria-hidden="true" /></span>
              <span><small className={styles.socialLabel}>TRAVEL COMMUNITY</small><strong>Facebook</strong><small>Ceylon Compass</small></span>
              <ArrowRight size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className={`${styles.rvSection} ${serif.variable}`} aria-labelledby="reviews-title">
        <div className={styles.rvInner}>
          <div className={styles.rvHead}>
            <p className={styles.rvKicker}>Guest book</p>
            <h2 id="reviews-title" className={styles.rvTitle}>
              Postcards from
              <span className={`${styles.rvScript} ${script.className}`}>happy travellers</span>
            </h2>
            <p className={styles.rvLead}>
              Couples, families and solo explorers share how their days in Sri Lanka unfolded.
            </p>
          </div>

          <div className={styles.rvMeta}>
            {reviewCount > 0 && (
              <div className={styles.rvScore}>
                <strong>{reviewAvg.toFixed(1)}</strong>
                <div>
                  <div className={styles.rvScoreStars} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} fill={i < Math.round(reviewAvg) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span>
                    Average of our latest {reviewCount} review{reviewCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.rvPlatforms}>
              <a
                className={`${styles.rvPlatform} ${styles.rvGoogle}`}
                href="https://www.google.com/search?q=Ceylon+Compass+Sri+Lanka+reviews"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read Ceylon Compass reviews on Google (opens in a new tab)"
              >
                <span className={styles.rvPlatformMark}>G</span>
                Google
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                className={`${styles.rvPlatform} ${styles.rvTrip}`}
                href="https://www.tripadvisor.com/Search?q=Ceylon+Compass+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find Ceylon Compass on Tripadvisor (opens in a new tab)"
              >
                <span className={styles.rvPlatformMark}>T</span>
                Tripadvisor
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                className={`${styles.rvPlatform} ${styles.rvFb}`}
                href="https://www.ceyloncompass.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read Ceylon Compass reviews on Facebook (opens in a new tab)"
              >
                <span className={styles.rvPlatformMark}>f</span>
                Facebook
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          {reviewCount > 0 ? (
            <>
              <div className={styles.rvWall}>
                {approvedReviews.map((review, index) => (
                  <article
                    className={`${styles.rvCard} ${index === 0 ? styles.rvFeatured : ""}`}
                    key={review.id}
                  >
                    <span className={styles.rvPostmark} aria-hidden="true">
                      Sri Lanka
                      <br />
                      {reviewDate.format(review.createdAt)}
                    </span>
                    <span className={styles.rvStamp} aria-hidden="true">
                      <b>{review.rating}</b>
                      <Star size={12} fill="currentColor" />
                    </span>

                    <div className={styles.rvTop}>
                      <div className={styles.rvStars} aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={i < review.rating ? "currentColor" : "none"}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    {review.title && <h3 className={styles.rvCardTitle}>{review.title}</h3>}
                    <blockquote className={styles.rvText}>{review.body}</blockquote>

                    <footer className={styles.rvFooter}>
                      <span className={styles.rvAvatar} aria-hidden="true">
                        {review.customerName.trim().charAt(0).toUpperCase()}
                      </span>
                      <span className={styles.rvWho}>
                        <strong className={script.className}>{review.customerName}</strong>
                        {review.tour?.title && (
                          <small>
                            <MapPin size={12} aria-hidden="true" /> {review.tour.title}
                          </small>
                        )}
                      </span>
                    </footer>
                  </article>
                ))}
              </div>

              <div className={styles.rvFoot}>
                <p>Travelled with us?</p>
                <Link href="/contact">
                  Plan your own story <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.rvEmpty}>
              <span className={styles.rvEmptyIcon}>
                <Star size={22} fill="currentColor" aria-hidden="true" />
              </span>
              <h3>This postcard is waiting for your story</h3>
              <p>Traveller reviews are coming soon.</p>
              <Link href="/contact">
                Plan your own Sri Lanka journey <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}