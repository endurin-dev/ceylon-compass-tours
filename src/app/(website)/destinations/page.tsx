import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Kaushan_Script } from "next/font/google";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./destinations.module.css";

export const dynamic = "force-dynamic";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const script = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
  });

  // Up to five photos for the postcard collage in the intro.
  const postcards = destinations.filter((d) => d.imageUrl).slice(0, 5);
  const anchor = (d: { slug: string | null; id: string | number }) =>
    String(d.slug || d.id);

  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
      <div className={styles.container}>
        {/* ───────── Intro ───────── */}
        <header className={styles.intro}>
          <div className={styles.introText}>
            <span className={styles.scribble} aria-hidden="true">
              Where will you go?
            </span>
            <h1>Find your place in Sri Lanka</h1>
            <p>
              Ancient kingdoms, misty hill country and golden coastline. Pick a
              destination and see the tours that go there.
            </p>
            {destinations.length > 0 && (
              <span className={styles.count}>
                <MapPin size={14} aria-hidden="true" />
                {destinations.length}{" "}
                {destinations.length === 1 ? "destination" : "destinations"}
              </span>
            )}
          </div>

          {postcards.length > 0 && (
            <div className={styles.postcards} aria-hidden="true">
              {postcards.map((d, i) => (
                <div
                  key={d.id}
                  className={`${styles.postcard} ${styles[`card${i}` as "card0"]}`}
                >
                  <Image
                    src={d.imageUrl as string}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 900px) 40vw, 200px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </header>

        {destinations.length > 0 ? (
          <>
            {/* ───────── Quick jump ───────── */}
            <nav className={styles.jump} aria-label="Jump to a destination">
              <ul>
                {destinations.map((d) => (
                  <li key={d.id}>
                    <a href={`#${anchor(d)}`}>{d.name}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ───────── Compact list ───────── */}
            <ol className={styles.trail}>
              {destinations.map((destination, index) => (
                <li
                  className={styles.stop}
                  id={anchor(destination)}
                  key={destination.id}
                >
                  <div className={styles.stopMedia}>
                    {destination.imageUrl ? (
                      <Image
                        src={destination.imageUrl}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 640px) 108px, 170px"
                        unoptimized
                      />
                    ) : (
                      <span className={styles.placeholder} aria-hidden="true">
                        <Compass size={32} />
                      </span>
                    )}
                  </div>

                  <div className={styles.stopBody}>
                    <span className={styles.stopNo} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2>{destination.name}</h2>
                    <p>
                      {destination.description || "More details coming soon."}
                    </p>
                    <Link
                      href="/tour-packages"
                      className={styles.stopLink}
                      aria-label={`See tours for ${destination.name}`}
                    >
                      See tours <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <section className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Compass size={30} aria-hidden="true" />
            </span>
            <h2>Destinations are coming soon</h2>
            <p>
              We&apos;re preparing guides to the island&apos;s best places. In
              the meantime, browse our tour packages or talk to our team.
            </p>
            <div className={styles.emptyActions}>
              <Link href="/tour-packages" className={styles.btnPrimary}>
                Explore tour packages <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/contact" className={styles.btnOutline}>
                Contact us
              </Link>
            </div>
          </section>
        )}

        {/* ───────── CTA ───────── */}
        <section className={styles.banner}>
          <div>
            <span className={styles.bannerScript}>Not sure where to start?</span>
            <p>
              Tell us what you enjoy and we&apos;ll suggest a route that fits.
            </p>
          </div>
          <Link href="/contact" className={styles.btnLight}>
            Plan your trip <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* Mobile-only sticky action bar */}
      <div className={styles.dock}>
        <Link href="/contact" className={styles.btnPrimary}>
          Plan your trip <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}