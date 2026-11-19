import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MapPin } from "lucide-react";
import { Kaushan_Script, Plus_Jakarta_Sans } from "next/font/google";
import { prisma } from "@/lib/prisma";
import styles from "@/app/(website)/destinations/destinations.module.css";

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

type CatalogKind = "attractions" | "activities";
type CatalogItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  tours: { id: string; title: string; slug: string }[];
};

const pageCopy = {
  attractions: {
    title: "Sri Lanka Attractions",
    heading: "Places worth discovering",
    intro: "From ancient landmarks to scenic viewpoints, explore the attractions featured across our Sri Lanka tours.",
    itemLabel: "attraction",
    pluralLabel: "attractions",
    icon: MapPin,
  },
  activities: {
    title: "Sri Lanka Activities",
    heading: "Make every day an adventure",
    intro: "Find memorable ways to experience the island, from wildlife encounters and water sports to mountain journeys.",
    itemLabel: "activity",
    pluralLabel: "activities",
    icon: Compass,
  },
} satisfies Record<CatalogKind, {
  title: string;
  heading: string;
  intro: string;
  itemLabel: string;
  pluralLabel: string;
  icon: typeof MapPin;
}>;

async function getCatalogItems(kind: CatalogKind): Promise<CatalogItem[]> {
  if (kind === "attractions") {
    const items = await prisma.attraction.findMany({
      include: {
        tourAttractions: {
          where: { tour: { status: "PUBLISHED" } },
          include: { tour: { select: { id: true, title: true, slug: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return items.map(({ tourAttractions, ...item }) => ({
      ...item,
      tours: tourAttractions.map(({ tour }) => tour),
    }));
  }

  const items = await prisma.activity.findMany({
    include: {
      tourActivities: {
        where: { tour: { status: "PUBLISHED" } },
        include: { tour: { select: { id: true, title: true, slug: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return items.map(({ tourActivities, ...item }) => ({
    ...item,
    tours: tourActivities.map(({ tour }) => tour),
  }));
}

export async function ExperienceCatalog({ kind }: { kind: CatalogKind }) {
  const items = await getCatalogItems(kind);
  const copy = pageCopy[kind];
  const featured = items.find(
    (item): item is CatalogItem & { imageUrl: string } => Boolean(item.imageUrl),
  ) ?? null;
  const others = featured ? items.filter((item) => item.id !== featured.id) : items;
  const Icon = copy.icon;

  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <span className={styles.scribble}>Experience the island</span>
          <h1>{copy.heading}</h1>
          <p>{copy.intro}</p>
          {items.length > 0 && (
            <span className={styles.count}>
              <Icon size={14} aria-hidden="true" />
              {items.length} {items.length === 1 ? copy.itemLabel : copy.pluralLabel}
            </span>
          )}
        </header>

        {items.length > 0 ? (
          <>
            {featured ? (
              <article className={styles.featured}>
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 1180px"
                  unoptimized
                />
                <span className={styles.stamp} aria-hidden="true">
                  <Icon size={22} />
                  <b>Island highlight</b>
                </span>
                <div className={styles.featuredBody}>
                  <h2>{featured.name}</h2>
                  <p>{featured.description || copy.intro}</p>
                  <Link href="/tour-packages" className={styles.btnLight}>
                    Explore packages <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ) : null}

            {others.length > 0 && (
              <section aria-label={`More ${copy.pluralLabel}`}>
                <div className={styles.grid}>
                  {others.map((item) => (
                    <article className={styles.card} key={item.id}>
                      <div className={styles.cardImage}>
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <span className={styles.placeholder} aria-hidden="true">
                            <Icon size={36} />
                          </span>
                        )}
                        <span className={styles.arrow} aria-hidden="true">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <h3>{item.name}</h3>
                        <p>{item.description || `Discover ${item.name} as part of a Sri Lanka tour.`}</p>
                        {item.tours.length > 0 ? (
                          <div className={styles.relatedTours}>
                            <span>Featured in</span>
                            {item.tours.map((tour) => (
                              <Link href={`/tour-packages/${tour.slug}`} key={tour.id}>
                                {tour.title} <ArrowRight size={13} aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className={styles.comingSoon}>Ask us to include this in your trip.</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className={styles.empty}>
            <span className={styles.emptyIcon}><Icon size={30} aria-hidden="true" /></span>
            <h2>{copy.pluralLabel} are coming soon</h2>
            <p>We&apos;re preparing more ways to explore Sri Lanka. Browse our tours or tell us what you&apos;d like to experience.</p>
            <div className={styles.emptyActions}>
              <Link href="/tour-packages" className={styles.btnPrimary}>
                Explore tour packages <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/contact" className={styles.btnOutline}>Contact us</Link>
            </div>
          </section>
        )}

        <section className={styles.banner}>
          <div>
            <span className={styles.bannerScript}>Your kind of Sri Lanka</span>
            <p>Tell us what you want to see and do, and we&apos;ll help create a trip around it.</p>
          </div>
          <Link href="/contact" className={styles.btnPrimary}>
            Plan your trip <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <div className={styles.dock}>
        <Link href="/contact" className={styles.btnPrimary}>Plan your trip <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
