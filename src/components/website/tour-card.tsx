import Link from "next/link";
import { ArrowRight, Clock, Compass, MapPin } from "lucide-react";
import styles from "./TourCard.module.css";

type TourCardProps = {
  title: string;
  slug: string;
  imageUrl?: string | null;
  duration: string;
  route?: string;
  priceLabel: string;
};

export function TourCard({
  title,
  slug,
  imageUrl,
  duration,
  route,
  priceLabel,
}: TourCardProps) {
  return (
    <article className={styles.card}>
      {/* ───── Photo ───── */}
      <div className={styles.photo}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">
            <Compass size={38} />
          </span>
        )}

        <span className={styles.duration}>
          <Clock size={14} aria-hidden="true" />
          {duration}
        </span>
      </div>

      {/* ───── Details ───── */}
      <div className={styles.body}>
        <h3>{title}</h3>
        {route && (
          <p className={styles.route}>
            <MapPin size={15} aria-hidden="true" />
            <span>{route}</span>
          </p>
        )}
      </div>

      {/* ───── Ticket stub: perforated edge, price + action ───── */}
      <div className={styles.stub}>
        <p className={styles.price}>{priceLabel}</p>
        <Link
          href={`/tour-packages/${slug}`}
          className={styles.cta}
          aria-label={`View tour: ${title}`}
        >
          View tour <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}