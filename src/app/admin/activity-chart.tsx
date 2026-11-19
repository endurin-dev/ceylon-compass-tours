"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";

export type DayPoint = { label: string; count: number };
const RANGES = [7, 14, 30] as const;

export function ActivityChart({ days }: { days: DayPoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>(14);
  const data = days.slice(-range);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className={styles.chartTop}>
        <div>
          <strong className={styles.chartTotal}>{total.toLocaleString()}</strong>
          <span className={styles.muted}> bookings in the last {range} days</span>
        </div>
        <div className={styles.seg} role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>{r}d</button>
          ))}
        </div>
      </div>
      <div className={styles.bars} role="img" aria-label={`Bookings per day, last ${range} days`}>
        {data.map((d) => (
          <div key={d.label} className={styles.barCol} title={`${d.label}: ${d.count}`}>
            <span className={styles.bar} style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / max) * 100)}%` }} data-empty={d.count === 0} />
            {range <= 14 && <small>{d.label.split(" ")[0]}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}