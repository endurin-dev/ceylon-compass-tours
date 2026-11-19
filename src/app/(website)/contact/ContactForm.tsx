"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { submitEnquiryAction, type EnquiryActionState } from "@/actions/enquiry.actions";
import { countries } from "@/lib/countries";
import styles from "./Contact.module.css";

const initialState: EnquiryActionState = {};
const topics = ["Tour packages", "Custom itinerary", "Existing booking", "Other"] as const;

export default function ContactForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiryAction, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name <b aria-hidden="true">*</b></span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            required
            minLength={2}
            maxLength={120}
          />
        </label>
        <label className={styles.field}>
          <span>Email address <b aria-hidden="true">*</b></span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Phone number</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Include your country code"
            maxLength={30}
          />
        </label>
        <label className={styles.field}>
          <span>Country</span>
          <select name="country" defaultValue="">
            <option value="">Select your country (optional)</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>{country.name}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className={styles.chips}>
        <legend>What can we help you with?</legend>
        {topics.map((topic, index) => (
          <label className={styles.chip} key={topic}>
            <input
              type="radio"
              name="topic"
              value={topic}
              defaultChecked={index === 0}
            />
            <span>{topic}</span>
          </label>
        ))}
      </fieldset>

      <label className={styles.field}>
        <span>Tell us about your trip <b aria-hidden="true">*</b></span>
        <textarea
          name="message"
          placeholder="Share your travel dates, group size, places you'd love to visit, or any questions."
          required
          minLength={10}
          maxLength={4000}
          rows={5}
        />
      </label>

      <label className={styles.honeypot} aria-hidden="true">
        Leave this field empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      {state.success && (
        <p className={styles.notice} role="status">
          Thanks for contacting us. Your enquiry has been sent to our travel team.
          We&apos;ll get back to you at {email}.
        </p>
      )}

      <button className={styles.btnPrimary} type="submit" disabled={pending}>
        {pending ? "Sending your enquiry…" : "Send enquiry"}
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
