"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Landmark, X } from "lucide-react";
import styles from "./attractions.module.css";

type Attraction = {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
};

export default function AttractionsGrid({
  attractions,
}: {
  attractions: Attraction[];
}) {
  const [current, setCurrent] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const n = attractions.length;
  const a = current === null ? null : attractions[current];

  useEffect(() => {
    document.body.style.overflow = current === null ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [current]);

  const openAt = (i: number) => {
    setCurrent(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (d: number) =>
    setCurrent((c) => (c === null ? c : (c + d + n) % n));

  return (
    <>
      <ul className={styles.mosaic}>
        {attractions.map((p, i) => (
          <li key={p.id} className={styles.tile}>
            <button type="button" className={styles.tileBtn} onClick={() => openAt(i)}>
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 30vw, 50vw"
                  unoptimized
                />
              ) : (
                <span className={styles.placeholder} aria-hidden="true">
                  <Landmark size={36} />
                </span>
              )}
              <span className={styles.tileName}>{p.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="attraction-title"
        onClose={() => setCurrent(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {a && (
          <div className={styles.sheet}>
            <div className={styles.sheetPhoto}>
              {a.imageUrl ? (
                <Image
                  src={a.imageUrl}
                  alt={a.name}
                  fill
                  sizes="(min-width: 900px) 480px, 100vw"
                  unoptimized
                />
              ) : (
                <span className={styles.placeholder} aria-hidden="true">
                  <Landmark size={56} />
                </span>
              )}
            </div>

            <div className={styles.sheetText}>
              <h2 id="attraction-title">{a.name}</h2>
              {a.description && <p>{a.description}</p>}
              <Link href="/tour-packages" className={styles.btn}>
                See tours that visit <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <div className={styles.pager}>
                <button type="button" onClick={() => step(-1)} aria-label="Previous place">
                  <ChevronLeft size={20} />
                </button>
                <span>
                  {(current ?? 0) + 1} of {n}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Next place">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}