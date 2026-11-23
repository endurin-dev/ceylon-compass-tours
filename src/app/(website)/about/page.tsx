import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Kaushan_Script } from "next/font/google";
import {
  ArrowRight,
  Bus,
  Check,
  Compass,
  HeartHandshake,
  Landmark,
  MapPin,
  Mountain,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { contactDetails } from "@/lib/contact";
import { prisma } from "@/lib/prisma";
import styles from "./about.module.css";

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

const highlights = [
  { icon: Landmark, label: "Ancient Heritage" },
  { icon: Mountain, label: "Scenic Landscapes" },
  { icon: Route, label: "Iconic Train Rides" },
  { icon: Compass, label: "Hidden Corners" },
];

const services = [
  {
    icon: Compass,
    title: "Tour packages",
    text: "Ready-made journeys across the island, from the cultural triangle to the hill country and the south coast.",
  },
  {
    icon: Sparkles,
    title: "Custom itineraries",
    text: "Tell us your dates and interests and we build a private trip around them, at your pace.",
  },
  {
    icon: Bus,
    title: "Vehicles and transfers",
    text: "Comfortable vehicles with experienced drivers for airport transfers and the roads between destinations.",
  },
  {
    icon: Users,
    title: "Local guides",
    text: "Guides who know the stories behind the temples, towns and trails, so you see more than the postcard.",
  },
];

const values = [
  {
    icon: HeartHandshake,
    title: "Genuine hospitality",
    text: "We treat every guest the way Sri Lankans treat visitors to their home: warmly and without hurry.",
  },
  {
    icon: ShieldCheck,
    title: "Clear and honest planning",
    text: "You know what is included, who is looking after you and who to call at every step of the trip.",
  },
  {
    icon: MapPin,
    title: "Rooted in the island",
    text: "Our routes, drivers and guides come from people who live here and know it season by season.",
  },
];

const reasons = [
  "A friendly team you can speak to before and during your trip",
  "Itineraries that balance culture, nature and downtime",
  "Support in English and French",
  "Flexible plans that can be adjusted to your group",
  "One team handling stays, transport and guides",
];

const places = [
  { name: "Sigiriya", tag: "Rock Fortress", cls: "tileSigiriya" },
  { name: "Kandy", tag: "Temple of the Tooth Relic", cls: "tileKandy" },
  { name: "Ella", tag: "Tea country and train rides", cls: "tileElla" },
  { name: "Galle", tag: "Fort and golden beaches", cls: "tileGalle" },
] as const;

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const destinations = await prisma.destination.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
    take: 4,
  });
  const heroImage = destinations[0]?.imageUrl ?? "/images/hero-sigiriya.jpg";
  const collageImages = destinations.slice(0, 3);

  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
      {/* ───────── Hero ───────── */}
      <section className={styles.hero}>
        <div className={styles.heroPhoto}>
          <Image
            src={heroImage}
            alt={destinations[0] ? `${destinations[0].name}, Sri Lanka` : "Sri Lanka landscape"}
            fill
            priority
            unoptimized
            sizes="100vw"
          />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <span className={styles.locationPill}>
            <MapPin size={14} aria-hidden="true" /> Sri Lanka
          </span>
          <h1>
            Your guides to the
            <br />
            island we call home.
          </h1>
          <p>
            Ceylon Compass plans tours across Sri Lanka for travellers who
            want more than a checklist of sights.
          </p>
          <span className={styles.heroScript} aria-hidden="true">
            A journey to remember
          </span>
        </div>
      </section>

      <nav className={styles.tabs} aria-label="On this page">
        <a href="#story" className={styles.tabActive}>
          Our story
        </a>
        <a href="#services">What we do</a>
        <a href="#values">Our values</a>
        <a href="#why-us">Why travel with us</a>
        <a href="#places">Destinations</a>
      </nav>

      <div className={styles.container}>
        {/* ───────── Story ───────── */}
        <section id="story" className={`${styles.section} ${styles.story}`}>
          <div className={styles.storyText}>
            <p className={styles.eyebrow}>
              <i aria-hidden="true" /> Our story
            </p>
            <h2 className={styles.sectionTitle}>
              Discover the best of Sri Lanka with people who know it
            </h2>
            <p>
              Sri Lanka packs ancient kingdoms, misty tea country, wild
              national parks and warm coastlines into one small island. It is
              easy to see all of it and still miss what makes it special.
            </p>
            <p>
              We started Ceylon Compass to change that. Our team plans every
              route ourselves, so your days leave room for the unplanned
              moments: a roadside cup of tea, a temple ceremony, a view that
              earns a longer stop.
            </p>

            <ul className={styles.highlights}>
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <span className={styles.icon}>
                    <Icon size={26} aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.collage} aria-hidden="true">
            {collageImages.length > 0 ? (
              collageImages.map((destination, index) => (
                <div
                  className={`${styles.photo} ${styles[`photo${String.fromCharCode(65 + index)}` as "photoA"]}`}
                  key={destination.id}
                >
                  <Image
                    src={destination.imageUrl ?? heroImage}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
              ))
            ) : (
              <>
                <div className={`${styles.photo} ${styles.photoA}`} />
                <div className={`${styles.photo} ${styles.photoB}`} />
                <div className={`${styles.photo} ${styles.photoC}`} />
              </>
            )}
            <span className={styles.collageScript}>Explore Sri Lanka</span>
          </div>
        </section>

        {/* ───────── Services ───────── */}
        <section id="services" className={styles.section}>
          <p className={styles.eyebrow}>
            <i aria-hidden="true" /> What we do
          </p>
          <h2 className={styles.sectionTitle}>Everything for your trip, in one place</h2>
          <div className={styles.cards4}>
            {services.map(({ icon: Icon, title, text }) => (
              <article key={title} className={styles.card}>
                <span className={styles.icon}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── Values ───────── */}
        <section id="values" className={styles.section}>
          <p className={styles.eyebrow}>
            <i aria-hidden="true" /> Our values
          </p>
          <h2 className={styles.sectionTitle}>How we look after our guests</h2>
          <div className={styles.valueList}>
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className={styles.value}>
                <span className={styles.valueIcon}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── Why us ───────── */}
        <section id="why-us" className={`${styles.section} ${styles.split}`}>
          <div className={styles.helpCard}>
            <h2>Why travel with us?</h2>
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>
                  <Check size={18} aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h2>Find us</h2>
            <dl>
              <div>
                <dt>
                  <MapPin size={18} aria-hidden="true" />
                </dt>
                <dd>
                  <strong>Sri Lanka</strong>
                  <span>
                    {contactDetails.sriLankaPhones
                      .map((p) => p.number)
                      .join(" · ")}
                  </span>
                </dd>
              </div>
              <div>
                <dt>
                  <Compass size={18} aria-hidden="true" />
                </dt>
                <dd>
                  <strong>Online</strong>
                  <span>{contactDetails.email}</span>
                </dd>
              </div>
            </dl>
            <Link href="/contact" className={styles.btnOutline}>
              Contact our team <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ───────── Destinations ───────── */}
        <section id="places" className={styles.section}>
          <p className={styles.eyebrow}>
            <i aria-hidden="true" /> Destinations
          </p>
          <h2 className={styles.sectionTitle}>Places our guests love</h2>
          <div className={styles.tiles}>
            {destinations.length > 0
              ? destinations.map((destination) => (
                  <Link
                    key={destination.id}
                    href="/destinations"
                    className={styles.tile}
                  >
                    <Image
                      src={destination.imageUrl ?? heroImage}
                      alt={destination.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                    />
                    <span className={styles.tileLabel}>
                      <strong>{destination.name}</strong>
                      <small>
                        {places.find((place) => place.name.toLowerCase() === destination.name.toLowerCase())?.tag
                          ?? "Explore Sri Lanka"}
                      </small>
                    </span>
                  </Link>
                ))
              : places.map((place) => (
                  <Link
                    key={place.name}
                    href="/tour-packages"
                    className={`${styles.tile} ${styles[place.cls]}`}
                  >
                    <span className={styles.tileLabel}>
                      <strong>{place.name}</strong>
                      <small>{place.tag}</small>
                    </span>
                  </Link>
                ))}
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className={styles.banner}>
          <div>
            <span className={styles.bannerScript}>
              Ready to explore Sri Lanka?
            </span>
            <p>Book a tour or talk to us about a trip made just for you.</p>
          </div>
          <div className={styles.bannerActions}>
            <Link href="/tour-packages" className={styles.btnPrimary}>
              Explore tour packages <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/contact" className={styles.btnGhost}>
              Plan your trip
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}