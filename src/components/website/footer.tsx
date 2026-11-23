import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Headphones,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { contactDetails } from "@/lib/contact";
import styles from "./footer.module.css";

const exploreLinks = [
  { label: "All Tour Packages", href: "/tour-packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "Attractions", href: "/attractions" },
  { label: "Activities", href: "/activities" },
  { label: "Start Planning", href: "/contact" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Traveler Reviews", href: "/reviews" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.grid}>
          <section className={styles.brandColumn} aria-label="About Ceylon Compass">
            <Link href="/" className={styles.brand}>
              <Image
                src="/images/logo.webp"
                alt="Ceylon Compass"
                width={58}
                height={58}
                className={styles.logo}
              />
              <span>Ceylon <b>Compass</b></span>
            </Link>
            <p className={styles.brandText}>
              Discover Sri Lanka at your own pace—from ancient heritage and misty
              hill country to golden beaches and unforgettable wildlife.
            </p>
            <div className={styles.promise}>
              <ShieldCheck size={19} />
              <span>Thoughtful journeys. Local care. Lasting memories.</span>
            </div>
          </section>

          <nav className={styles.linkColumn} aria-label="Explore">
            <h3><Compass size={17} /> Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className={styles.linkColumn} aria-label="Company information">
            <h3>Good to know</h3>
            <ul>
              {companyLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <section className={styles.contactColumn}>
            <h3><Headphones size={17} /> We&apos;re here to help</h3>
            <p>Questions about a tour or booking? Get in touch with our team.</p>
            <div className={styles.phoneList}>
              {contactDetails.sriLankaPhones.map((phone) => (
                <a className={styles.phone} href={`tel:${phone.href}`} key={phone.href}>
                  <Phone size={16} />
                  <span><small>{phone.label}</small>{phone.number}</span>
                </a>
              ))}
            </div>
            <a className={styles.email} href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <a className={styles.email} href={contactDetails.websiteUrl} target="_blank" rel="noreferrer">
              {contactDetails.website}
            </a>
            <a className={styles.email} href={contactDetails.russianWebsiteUrl} target="_blank" rel="noreferrer">
              {contactDetails.russianWebsite}
            </a>
            <Link className={styles.contactLink} href="/contact">
              Send us a message <ArrowRight size={15} />
            </Link>
          </section>
        </div>

        <div className={styles.destinationNote}>
          <MapPin size={16} />
          <span>
            From the Cultural Triangle to the southern coast, make your next
            stop unforgettable.
          </span>
          <Link href="/destinations">Explore destinations <ArrowRight size={14} /></Link>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Ceylon Compass. All rights reserved.</span>
          <span>Made for curious travellers. Inspired by Sri Lanka.</span>
        </div>
      </div>
    </footer>
  );
}
