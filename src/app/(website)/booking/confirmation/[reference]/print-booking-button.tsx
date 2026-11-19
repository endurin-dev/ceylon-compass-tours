"use client";

import { ArrowDownToLine } from "lucide-react";
import styles from "./confirmation.module.css";

export function PrintBookingButton() {
  return (
    <button type="button" className={styles.download} onClick={() => window.print()}>
      <ArrowDownToLine size={17} /> Print Booking Details
    </button>
  );
}
