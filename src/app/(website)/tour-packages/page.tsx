import Link from "next/link";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TourStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import styles from "./tour-packages.module.css";

export const dynamic = "force-dynamic";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

type Param = string | string[] | undefined;
type SearchParams = {
  q?: string;
  destination?: Param;
  duration?: Param;
  price?: string;
  sort?: string;
  page?: string;
};

const PAGE_SIZE = 9;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const DURATIONS = [
  { value: "short", label: "1 – 3 Days" },
  { value: "week", label: "4 – 7 Days" },
  { value: "long", label: "8 – 14 Days" },
  { value: "xl", label: "15+ Days" },
];
const PRICES = [
  { value: "", label: "Any Price" },
  { value: "0-500", label: "$0 – $500" },
  { value: "500-1000", label: "$500 – $1000" },
  { value: "1000+", label: "$1000+" },
];
const SORTS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Shortest Duration" },
];

const toArray = (v: Param) => (v ? (Array.isArray(v) ? v : [v]) : []);

function durationClause(v: string): Prisma.TourWhereInput | null {
  switch (v) {
    case "short": return { durationDays: { lte: 3 } };
    case "week": return { durationDays: { gte: 4, lte: 7 } };
    case "long": return { durationDays: { gte: 8, lte: 14 } };
    case "xl": return { durationDays: { gte: 15 } };
    default: return null;
  }
}

function priceClause(v?: string): Prisma.TourWhereInput {
  if (v === "0-500") return { basePrice: { lte: 500 } };
  if (v === "500-1000") return { basePrice: { gt: 500, lte: 1000 } };
  if (v === "1000+") return { basePrice: { gt: 1000 } };
  return {};
}

function orderBy(sort?: string): Prisma.TourOrderByWithRelationInput[] {
  switch (sort) {
    case "newest": return [{ createdAt: "desc" }];
    case "price-asc": return [{ basePrice: "asc" }];
    case "price-desc": return [{ basePrice: "desc" }];
    case "duration": return [{ durationDays: "asc" }];
    default: return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

function money(amount: unknown, currency: string) {
  const n = Number(amount);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString("en-US")}`;
  }
}

function buildHref(f: SearchParams, overrides: Partial<Record<keyof SearchParams, string | string[] | undefined>>) {
  const merged = { ...f, ...overrides };
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (!v || (k === "page" && v === "1")) continue;
    toArray(v as Param).forEach((item) => sp.append(k, item));
  }
  const qs = sp.toString();
  return qs ? `/tour-packages?${qs}` : "/tour-packages";
}


export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const f = await searchParams;

  const hasFilters = Boolean(
    f.q || f.destination || f.duration || f.price || f.sort
  );

  const currentPage = Math.max(
    1,
    Number.parseInt(f.page ?? "1", 10) || 1
  );

  const canonicalUrl =
    !hasFilters && currentPage > 1
      ? `/tour-packages?page=${currentPage}`
      : "/tour-packages";

  const title =
    "Sri Lanka Tour Packages | Private Tours & Holiday Packages";

  const description =
    "Discover Sri Lanka with Ceylon Compass. Explore private tours, cultural journeys, beach holidays, wildlife safaris and unforgettable Sri Lanka tour packages. Find your perfect island adventure.";

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: hasFilters
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "Ceylon Compass",
      title: "Sri Lanka Tour Packages | Ceylon Compass",
      description,
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Explore Sri Lanka with Ceylon Compass",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Sri Lanka Tour Packages | Ceylon Compass",
      description,
      images: ["/images/og-image.jpg"],
    },
  };
}


/* ---------- small inline icons ---------- */
const Icon = {
  search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 4h18l-7 8.5V20l-4-2v-5.5L3 4Z" /></svg>
  ),
};

export default async function TourPackagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const f = await searchParams;
  const query = f.q?.trim();
  const selectedDestinations = toArray(f.destination);
  const selectedDurations = toArray(f.duration);
  const page = Math.max(1, Number.parseInt(f.page ?? "1", 10) || 1);
  const sort = SORTS.some((s) => s.value === f.sort) ? f.sort! : "popular";
  const priceSensitiveResults = Boolean(
    f.price || sort === "price-asc" || sort === "price-desc",
  );

  const durationClauses = selectedDurations
    .map(durationClause)
    .filter((c): c is Prisma.TourWhereInput => c !== null);

  const where: Prisma.TourWhereInput = {
    status: TourStatus.PUBLISHED,
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } },
              {
                tourDestinations: {
                  some: { destination: { name: { contains: query, mode: "insensitive" } } },
                },
              },
            ],
          }
        : {},
      selectedDestinations.length
        ? { tourDestinations: { some: { destination: { slug: { in: selectedDestinations } } } } }
        : {},
      durationClauses.length ? { OR: durationClauses } : {},
      priceSensitiveResults
        ? { showPrice: true, ...priceClause(f.price) }
        : {},
    ],
  };

  const [total, tours, destinationRows] = await Promise.all([
    prisma.tour.count({ where }),
    prisma.tour.findMany({
      where,
      include: {
        tourDestinations: {
          include: { destination: { select: { name: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: orderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        _count: {
          select: { tourDestinations: { where: { tour: { status: TourStatus.PUBLISHED } } } },
        },
      },
    }),
  ]);

  const destinations = destinationRows
    .map((d) => ({ ...d, count: d._count.tourDestinations }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const topDestinations = destinations.slice(0, 8);
  const moreDestinations = destinations.slice(8);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(query || selectedDestinations.length || selectedDurations.length || f.price);
  const activeSort = SORTS.find((s) => s.value === sort)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Tour Packages", item: `${SITE_URL}/tour-packages` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Sri Lanka Tour Packages",
        numberOfItems: total,
        itemListElement: tours.map((t, i) => ({
          "@type": "ListItem",
          position: (page - 1) * PAGE_SIZE + i + 1,
          url: `${SITE_URL}/tour-packages/${t.slug}`, // adjust to your detail route
          name: t.title,
        })),
      },
    ],
  };

  const destinationCheckbox = (d: (typeof destinations)[number]) => (
    <label key={d.id} className={styles.check}>
      <input
        type="checkbox"
        name="destination"
        value={d.slug}
        defaultChecked={selectedDestinations.includes(d.slug)}
      />
      {d.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.destinationThumb} src={d.imageUrl} alt="" loading="lazy" />
      ) : (
        <span className={styles.destinationThumbFallback} aria-hidden="true">{d.name.slice(0, 1)}</span>
      )}
      <span>{d.name}</span>
      <em>({d.count})</em>
    </label>
  );

  return (
    <main className={`${styles.page} ${font.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className={styles.wrap}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Tour Packages</span>
        </nav>

        <header className={styles.head}>
          <h1 className={styles.title}>
            Explore <span>Sri Lanka</span> Tour Packages
          </h1>
          <p className={styles.lead}>Find and book the perfect tour for your Sri Lankan adventure</p>
        </header>

        <div className={styles.layout}>
          {/* ---------- Sidebar ---------- */}
          <aside className={styles.aside} aria-label="Filter tours">
            <input type="checkbox" id="filter-toggle" className={styles.toggleInput} />
            <label htmlFor="filter-toggle" className={styles.toggleBtn}>
              {Icon.filter} Filters
              {hasFilters && <span className={styles.dot} aria-label="Filters active" />}
            </label>

            <form action="/tour-packages" method="get" role="search" className={styles.filters}>
              <input type="hidden" name="sort" value={sort === "popular" ? "" : sort} />

              <div className={styles.filterHead}>
                <h2>
                  <span className={styles.funnel}>{Icon.filter}</span> Find Your Tour
                </h2>
                {hasFilters && (
                  <Link href="/tour-packages" className={styles.reset}>
                    Reset All
                  </Link>
                )}
              </div>

              <div className={styles.searchBox}>
                {Icon.search}
                <label htmlFor="q" className={styles.srOnly}>Search tours</label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  placeholder="Search tours..."
                  defaultValue={query}
                  autoComplete="off"
                  enterKeyHint="search"
                />
              </div>

              <fieldset className={styles.group}>
                <legend>Destinations</legend>
                {topDestinations.map(destinationCheckbox)}
                {moreDestinations.length > 0 && (
                  <details className={styles.more}>
                    <summary>
                      <span className={styles.showMore}>+ Show More</span>
                      <span className={styles.showLess}>− Show Less</span>
                    </summary>
                    {moreDestinations.map(destinationCheckbox)}
                  </details>
                )}
              </fieldset>

              <fieldset className={styles.group}>
                <legend>Duration</legend>
                {DURATIONS.map((d) => (
                  <label key={d.value} className={styles.check}>
                    <input
                      type="checkbox"
                      name="duration"
                      value={d.value}
                      defaultChecked={selectedDurations.includes(d.value)}
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className={styles.group}>
                <legend>Price Range</legend>
                {PRICES.map((p) => (
                  <label key={p.value || "any"} className={styles.check}>
                    <input
                      type="radio"
                      name="price"
                      value={p.value}
                      defaultChecked={(f.price ?? "") === p.value}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </fieldset>

              <button type="submit" className={styles.apply}>
                {Icon.search} Apply Filters {Icon.arrow}
              </button>
            </form>
          </aside>

          {/* ---------- Results ---------- */}
          <section className={styles.results} aria-labelledby="results-heading">
            <div className={styles.resultsBar}>
              <h2 id="results-heading" className={styles.count}>
                Showing {total} {total === 1 ? "tour" : "tours"}
              </h2>

              <details className={styles.sort}>
                <summary>
                  <span>Sort by:</span> <strong>{activeSort.label}</strong>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <ul>
                  {SORTS.map((s) => (
                    <li key={s.value}>
                      <Link
                        href={buildHref(f, { sort: s.value === "popular" ? undefined : s.value, page: undefined })}
                        aria-current={s.value === sort ? "true" : undefined}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {tours.length ? (
              <ul className={styles.grid}>
                {tours.map((tour, i) => (
                  <li key={tour.id} className={styles.card}>
                    <div className={styles.media}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tour.coverImageUrl ?? "/placeholder-tour.jpg"}
                        alt={tour.title}
                        width={640}
                        height={440}
                        loading={i < 3 && page === 1 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      {tour.featured && <span className={styles.badge}>★ Featured</span>}
                      <span className={styles.duration}>
                        {Icon.cal}{" "}
                        {tour.durationLabel ?? `${tour.durationDays} Days / ${tour.durationNights} Nights`}
                      </span>
                    </div>

                    <div className={styles.body}>
                      {tour.tourDestinations.length > 0 && (
                        <p className={styles.route}>
                          {Icon.pin}
                          <span>
                            {tour.tourDestinations.map(({ destination }) => destination.name).join(" → ")}
                          </span>
                        </p>
                      )}
                      <h3 className={styles.cardTitle}>
                        <Link href={`/tour-packages/${tour.slug}`} className={styles.cardLink}>
                          {tour.title}
                        </Link>
                      </h3>

                      <div className={styles.foot}>
                        {tour.showPrice && (
                          <span className={styles.price}>
                            <small>From</small>
                            <strong>{money(tour.basePrice, tour.currency)}</strong>
                          </span>
                        )}
                        <span className={styles.go} aria-hidden="true">
                          View tour {Icon.arrow}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No journeys found</p>
                <p>No published tours match those filters. Try another destination or clear your filters.</p>
                <Link href="/tour-packages" className={styles.apply}>View all tours</Link>
              </div>
            )}

            {totalPages > 1 && (
              <nav className={styles.pager} aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={buildHref(f, { page: String(n) })}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Page ${n}`}
                  >
                    {n}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={buildHref(f, { page: String(page + 1) })} aria-label="Next page">
                    {Icon.arrow}
                  </Link>
                )}
              </nav>
            )}

            <aside className={styles.cta}>
              <div>
                <h2>Need a Custom Tour?</h2>
                <p>Let us create a personalized Sri Lanka itinerary just for you.</p>
              </div>
              <Link href="/contact" className={styles.ctaBtn}>
                Contact Our Travel Experts {Icon.arrow}
              </Link>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}