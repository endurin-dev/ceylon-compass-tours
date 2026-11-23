import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import { ArrowRight, Landmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import styles from "./attractions.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sri Lanka Attractions | Ceylon Compass",
  description:
    "Explore the landmarks, temples, gardens, and scenic places included in our Sri Lanka tour packages.",
};

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default async function AttractionsPage() {
  // Assumes an `Attraction` model with name, imageUrl, description.
  const rows = await prisma.attraction.findMany({ orderBy: { name: "asc" } });

  const attractions = rows.map((a) => ({
    id: String(a.id),
    name: a.name,
    imageUrl: a.imageUrl ?? null,
    description: a.description ?? null,
  }));

  return (
    <main className={`${styles.page} ${display.variable} ${body.variable}`}>
      <h1 className={styles.srOnly}>Sri Lanka attractions</h1>

      {attractions.length > 0 ? (
        <div className={`${styles.container} ${styles.grid}`}>
          {attractions.map((a, i) => (
            <article key={a.id} className={styles.card}>
              <div className={styles.photo}>
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt={a.name}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1000px) 380px, (min-width: 641px) 50vw, 100vw"
                    unoptimized
                  />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">
                    <Landmark size={48} />
                  </span>
                )}
              </div>
              <div className={styles.text}>
                <h2>{a.name}</h2>
                <p>{a.description || "More details coming soon."}</p>
                <Link href="/tour-packages" className={styles.textLink}>
                  See tours that visit {a.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className={`${styles.container} ${styles.empty}`}>
          <Landmark size={36} aria-hidden="true" />
          <h2>Attractions are coming soon</h2>
          <p>
            We&apos;re writing guides to the island&apos;s best sights. Browse
            our tour packages in the meantime.
          </p>
          <Link href="/tour-packages" className={styles.btn}>
            Explore tour packages
          </Link>
        </section>
      )}

      <section className={styles.closing}>
        <div className={`${styles.container} ${styles.closingInner}`}>
          <h2>Seen a place you love? We&apos;ll build the route around it.</h2>
          <Link href="/contact" className={styles.btnLight}>
            Plan your trip <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}