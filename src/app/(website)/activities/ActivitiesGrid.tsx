"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import styles from "./activities.module.css";

type Activity = {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  category: string | null;
};

export default function ActivitiesGrid({
  activities,
}: {
  activities: Activity[];
}) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    activities.forEach((a) => a.category && set.add(a.category));
    return set.size > 0 ? ["All", ...Array.from(set)] : [];
  }, [activities]);

  const visible =
    active === "All"
      ? activities
      : activities.filter((a) => a.category === active);

  return (
    <>
      {categories.length > 0 && (
        <nav className={styles.filters} aria-label="Filter activities">
          <ul>
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={active === c}
                  onClick={() => setActive(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ul key={active} className={`${styles.container} ${styles.grid}`}>
        {visible.map((a, i) => (
          <li key={a.id} className={styles.cell}>
            <Link
              href="/tour-packages"
              className={styles.card}
              aria-label={`${a.name}: see tours that include it`}
            >
              <span className={styles.photo}>
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt=""
                    fill
                    priority={i < 2}
                    sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">
                    <Compass size={44} />
                  </span>
                )}
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {a.category && <span className={styles.tag}>{a.category}</span>}
              </span>

              <span className={styles.body}>
                <span className={styles.cardName}>{a.name}</span>
                <span className={styles.cardDesc}>
                  {a.description || "More details coming soon."}
                </span>
                <span className={styles.more}>
                  See tours
                  <span className={styles.go} aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}