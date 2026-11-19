import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kaushan_Script } from "next/font/google";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Compass, Facebook, Headphones, Instagram, MapPin, Plane, Search, ShieldCheck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

const script = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

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
              Discover the
              <br />
              <span>Pearl</span> of the Indian
              <br />
              Ocean
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
              href="https://www.instagram.com/super_startravel?xtok=Zzlscmp4aGdkYXJj&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Superstar Travels Tours on Instagram (opens in a new tab)"
            >
              <span className={styles.socialIcon}><Instagram size={25} aria-hidden="true" /></span>
              <span><small className={styles.socialLabel}>PHOTO JOURNAL</small><strong>Instagram</strong><small>@super_startravel</small></span>
              <ArrowRight size={19} aria-hidden="true" />
            </a>
            <a
              className={`${styles.socialLink} ${styles.facebookLink}`}
              href="https://www.facebook.com/share/1E9Ba9MP6r/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Superstar Travels Tours on Facebook (opens in a new tab)"
            >
              <span className={styles.socialIcon}><Facebook size={25} aria-hidden="true" /></span>
              <span><small className={styles.socialLabel}>TRAVEL COMMUNITY</small><strong>Facebook</strong><small>Superstar Travels Tours</small></span>
              <ArrowRight size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection} aria-labelledby="reviews-title">
        <div className={styles.reviewsInner}>
          <div className={styles.reviewsHeading}>
            <p>Real journeys. Real travellers.</p>
            <h2 id="reviews-title">Sri Lanka looks better through their stories.</h2>
            <span>Discover why couples, families and solo travellers trust us to turn their Sri Lanka plans into unforgettable days.</span>
          </div>

          <div className={styles.reviewTrust}>
            <div>
              <strong>5-star</strong>
              <span>Guest experiences</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Personal planning</span>
            </div>
            <div>
              <strong>Local</strong>
              <span>Island expertise</span>
            </div>
          </div>

          <div className={styles.reviewPlatforms}>
            <a
              className={`${styles.reviewPlatform} ${styles.googlePlatform}`}
              href="https://www.google.com/search?q=Superstar+Travels+Tours+Sri+Lanka+reviews"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read Superstar Travels Tours reviews on Google"
            >
              <span className={styles.platformMark}>G</span>
              <span><strong>Google</strong><small>View guest reviews</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              className={`${styles.reviewPlatform} ${styles.tripadvisorPlatform}`}
              href="https://www.tripadvisor.com/Search?q=Superstar+Travels+Tours+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Find Superstar Travels Tours on Tripadvisor"
            >
              <span className={styles.platformMark}>T</span>
              <span><strong>Tripadvisor</strong><small>Explore traveller feedback</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              className={`${styles.reviewPlatform} ${styles.facebookPlatform}`}
              href="https://www.facebook.com/share/1E9Ba9MP6r/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read Superstar Travels Tours reviews on Facebook"
            >
              <span className={styles.platformMark}>f</span>
              <span><strong>Facebook</strong><small>See community stories</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          {approvedReviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {approvedReviews.map((review) => (
                <article className={styles.reviewCard} key={review.id}>
                  <div className={styles.reviewStars} aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={index < review.rating ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  {review.title && <h3>{review.title}</h3>}
                  <blockquote>{review.body}</blockquote>
                  <footer>
                    <strong>{review.customerName}</strong>
                    {review.tour?.title && <span>{review.tour.title}</span>}
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.reviewEmpty}>
              <span><Star size={22} fill="currentColor" aria-hidden="true" /></span>
              <p>Traveller reviews are coming soon.</p>
              <Link href="/contact">Plan your own Sri Lanka journey <ArrowRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}