import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans, Kaushan_Script } from "next/font/google";
import { ArrowRight, Compass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./activities.module.css";
import ActivitiesGrid from "./ActivitiesGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Things to Do in Sri Lanka | Activities & Experiences",
  description:
    "Discover the best things to do in Sri Lanka with Ceylon Compass. Enjoy wildlife safaris, surfing, scenic train journeys, hiking, cultural experiences and unforgettable island adventures.",

  alternates: {
    canonical: "/activities",
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
    title: "Things to Do in Sri Lanka | Activities & Experiences",
    description:
      "Explore exciting Sri Lanka activities, including wildlife safaris, water sports, scenic journeys, hiking and cultural experiences.",
    url: "/activities",
    
  },

  twitter: {
    card: "summary_large_image",
    title: "Things to Do in Sri Lanka | Ceylon Compass",
    description:
      "Discover wildlife safaris, water sports, scenic journeys and unforgettable experiences in Sri Lanka.",

  },
};

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

export default async function ActivitiesPage() {
  // Rename `activity` / fields if your schema differs.
  const rows = await prisma.activity.findMany({ orderBy: { name: "asc" } });

  const activities = rows.map((a) => {
    const category = (a as Record<string, unknown>).category;
    return {
      id: String(a.id),
      name: a.name,
      imageUrl: a.imageUrl ?? null,
      description: a.description ?? null,
      category: typeof category === "string" && category ? category : null,
    };
  });

  // Duplicate names so the ribbon loops seamlessly
  const ribbon = [...activities, ...activities];

  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
     <header className={styles.hero}>
  <div className={styles.heroImg} aria-hidden="true">
    <Image
      src="/images/activity-web-banner.jpg"
      alt=""
      fill
      priority
      sizes="100vw"
    />
  </div>
  <div className={styles.heroShade} aria-hidden="true" />
  <div className={styles.container}>
    <span className={styles.scribble}>Ready for an adventure?</span>
    <h1>
      Things to <em>do</em> in Sri Lanka
    </h1>
    <p>
      Safaris at sunrise, waves at noon, train rides through tea country.
      Pick the moments you want and we&apos;ll weave them into your tour.
    </p>
    {activities.length > 0 && (
      <span className={styles.count}>
        <Compass size={16} aria-hidden="true" />
        {activities.length} experiences
      </span>
    )}
  </div>

  {activities.length > 0 && (
    <div className={styles.ribbon} aria-hidden="true">
      <div className={styles.ribbonTrack}>
        {ribbon.map((a, i) => (
          <span key={`${a.id}-${i}`}>{a.name}</span>
        ))}
      </div>
    </div>
  )}
</header>

      {activities.length > 0 ? (
        <ActivitiesGrid activities={activities} />
      ) : (
        <section className={`${styles.container} ${styles.empty}`}>
          <Compass size={40} aria-hidden="true" />
          <h2>Activities are coming soon</h2>
          <p>We&apos;re curating the best experiences. Meanwhile, browse our tours.</p>
          <Link href="/tour-packages" className={styles.btnPrimary}>
            Explore tour packages
          </Link>
        </section>
      )}

      <section className={`${styles.container} ${styles.banner}`}>
        <div>
          <span className={styles.bannerScript}>Can&apos;t decide?</span>
          <p>Tell us your vibe and we&apos;ll build a custom itinerary.</p>
        </div>
        <Link href="/contact" className={styles.btnPrimary}>
          Plan your trip <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <div className={styles.dock}>
        <Link href="/contact" className={styles.btnPrimary}>
          Plan your trip <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}