import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Kaushan_Script } from "next/font/google";
import {
  ArrowRight,
  Check,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { contactDetails } from "@/lib/contact";
import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";

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

const helpTopics = [
  "Tour packages and pricing",
  "Custom, private itineraries",
  "Changes to an upcoming booking",
  "Transfers, stays and guides",
  "Group and family travel",
];

const steps = [
  {
    title: "Send your enquiry",
    text: "Share your dates, interests and group size using the form, or call us directly.",
  },
  {
    title: "Get tailored options",
    text: "Our team replies with suggested tours or a custom itinerary built around your plans.",
  },
  {
    title: "Confirm and travel",
    text: "Agree the details, confirm your booking and get ready to explore the island.",
  },
];

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const primaryPhone = contactDetails.sriLankaPhones[0];
  const destinations = await prisma.destination.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" },
    take: 4,
  });
  const heroImage = destinations[0]?.imageUrl ?? "/images/hero-sigiriya.jpg";

  return (
    <main className={`${styles.page} ${body.variable} ${script.variable}`}>
      {/* ───────── Hero ───────── */}
      <section className={styles.hero}>
        <div className={styles.heroPhoto}>
          <Image
            src={heroImage}
            alt={destinations[0] ? `${destinations[0].name}, Sri Lanka` : "Sri Lanka landscape"}
            fill
            priority
            unoptimized
            sizes="100vw"
          />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.locationPill}>
              <MapPin size={14} aria-hidden="true" /> Sri Lanka
            </span>
            <h1>
              Let&apos;s plan your
              <br />
              Sri Lanka journey.
            </h1>
            <p>
              Speak with our team about tour packages, custom itineraries, or an
              upcoming booking. We&apos;re here to help.
            </p>
            <span className={styles.heroScript} aria-hidden="true">
              We&apos;d love to hear from you
            </span>
          </div>

          <aside className={styles.quickCard} aria-label="Quick contact">
            <div className={styles.quickHead}>Talk to our team</div>
            <div className={styles.quickBody}>
              {primaryPhone && (
                <>
                  <span className={styles.quickLabel}>Call us on</span>
                  <a
                    className={styles.quickPhone}
                    href={`tel:${primaryPhone.href}`}
                  >
                    {primaryPhone.number}
                  </a>
                </>
              )}
              <ul className={styles.quickList}>
                <li>
                  <Mail size={16} aria-hidden="true" />
                  <a href={`mailto:${contactDetails.email}`}>
                    {contactDetails.email}
                  </a>
                </li>
                <li>
                  <Globe2 size={16} aria-hidden="true" />
                  <a
                    href={contactDetails.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contactDetails.website}
                  </a>
                </li>
              </ul>
              <a className={styles.btnPrimary} href="#message">
                Send an enquiry <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ───────── Section nav ───────── */}
      <nav className={styles.tabs} aria-label="On this page">
        <a href="#call" className={styles.tabActive}>
          Call
        </a>
        <a href="#email">Email</a>
        <a href="#message">Message</a>
        <a href="#how-it-works">How it works</a>
      </nav>

      <div className={styles.container}>
        {/* ───────── Contact cards ───────── */}
        <section className={styles.section} aria-labelledby="reach-title">
          <p className={styles.eyebrow}>
            <i aria-hidden="true" /> Contact details
          </p>
          <h2 id="reach-title" className={styles.sectionTitle}>
            Choose how you&apos;d like to reach us
          </h2>

          <div className={styles.cards}>
            <article id="call" className={styles.card}>
              <span className={styles.icon}>
                <Phone size={24} aria-hidden="true" />
              </span>
              <h3>Call our team</h3>
              <p>Choose the number that works best for you.</p>

              <div className={styles.group}>
                <span className={styles.groupLabel}>Sri Lanka</span>
                {contactDetails.sriLankaPhones.map((phone) => (
                  <a
                    key={phone.href}
                    className={styles.link}
                    href={`tel:${phone.href}`}
                  >
                    {phone.number}
                  </a>
                ))}
              </div>
              <div className={styles.group}>
                <span className={styles.groupLabel}>France</span>
                <a
                  className={styles.link}
                  href={`tel:${contactDetails.francePhone.href}`}
                >
                  {contactDetails.francePhone.number}
                </a>
              </div>
            </article>

            <article id="email" className={styles.card}>
              <span className={styles.icon}>
                <Mail size={24} aria-hidden="true" />
              </span>
              <h3>Email us</h3>
              <p>
                Send your questions and our travel team will be happy to help.
              </p>
              <div className={styles.group}>
                <a
                  className={styles.link}
                  href={`mailto:${contactDetails.email}`}
                >
                  {contactDetails.email}
                </a>
              </div>
            </article>

            <article className={styles.card}>
              <span className={styles.icon}>
                <Globe2 size={24} aria-hidden="true" />
              </span>
              <h3>Visit our website</h3>
              <p>Explore more travel services and information online.</p>
              <div className={styles.group}>
                <a
                  className={styles.link}
                  href={contactDetails.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {contactDetails.website}
                </a>
              </div>
            </article>
          </div>
        </section>

        {destinations.length > 0 && (
          <section className={styles.section} aria-labelledby="destination-inspiration-title">
            <p className={styles.eyebrow}>
              <i aria-hidden="true" /> Island inspiration
            </p>
            <h2 id="destination-inspiration-title" className={styles.sectionTitle}>
              Picture your next stop
            </h2>
            <div className={styles.destinationGallery}>
              {destinations.map((destination) => (
                <Link
                  href="/destinations"
                  className={styles.destinationTile}
                  key={destination.id}
                >
                  <Image
                    src={destination.imageUrl ?? heroImage}
                    alt={destination.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                  />
                  <span>{destination.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ───────── Form + side info ───────── */}
        <section
          id="message"
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="message-title"
        >
          <div className={styles.formPanel}>
            <p className={styles.eyebrow}>
              <i aria-hidden="true" /> Send an enquiry
            </p>
            <h2 id="message-title" className={styles.sectionTitle}>
              Tell us about your trip
            </h2>
            <p className={styles.lead}>
              The more you share, the better we can tailor your itinerary.
            </p>
            <ContactForm email={contactDetails.email} />
          </div>

          <div className={styles.side}>
            <div className={styles.helpCard}>
              <h3>What we can help with</h3>
              <ul>
                {helpTopics.map((topic) => (
                  <li key={topic}>
                    <Check size={18} aria-hidden="true" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>Our offices</h3>
              <dl>
                <div>
                  <dt>
                    <MapPin size={18} aria-hidden="true" />
                  </dt>
                  <dd>
                    <strong>Sri Lanka</strong>
                    <span>
                      {contactDetails.sriLankaPhones
                        .map((p) => p.number)
                        .join(" · ")}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>
                    <MapPin size={18} aria-hidden="true" />
                  </dt>
                  <dd>
                    <strong>France</strong>
                    <span>{contactDetails.francePhone.number}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section
          id="how-it-works"
          className={styles.section}
          aria-labelledby="steps-title"
        >
          <p className={styles.eyebrow}>
            <i aria-hidden="true" /> What happens next
          </p>
          <h2 id="steps-title" className={styles.sectionTitle}>
            From first message to first morning in Sri Lanka
          </h2>
          <ol className={styles.timeline}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepTag}>Step {i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ───────── CTA banner ───────── */}
        <section className={styles.banner}>
          <div>
            <span className={styles.bannerScript}>
              Ready to explore Sri Lanka?
            </span>
            <p>
              Tell us what you have in mind and we&apos;ll help you find the
              right way to explore the island.
            </p>
          </div>
          <Link href="/tour-packages" className={styles.btnPrimary}>
            Explore tour packages <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}