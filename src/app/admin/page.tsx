import {
  ArrowDownRight, ArrowUpRight, BellRing, CalendarCheck, CalendarClock, ChevronRight,
  MapPinned, MessageSquareText, PackageOpen, Plus, Users,
} from "lucide-react";
import Link from "next/link";
import { DataTable, type AdminTableRow } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";
import { ActivityChart, type DayPoint } from "./activity-chart";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;
const SWATCH = ["#3b6cf6", "#16a37a", "#8b5cf6", "#f59e0b", "#ef4a6b", "#0ea5c6"];

export default async function AdminDashboard() {
  const now = new Date();
  const since60 = new Date(now.getTime() - 60 * DAY);

  const [tours, bookings, customers, enquiries, destinations, recentBookings, trend, byStatus, upcoming] =
    await Promise.all([
      prisma.tour.count(),
      prisma.booking.count(),
      prisma.customer.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.destination.count(),
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { firstName: true, lastName: true } } },
      }),
      prisma.booking.findMany({ where: { createdAt: { gte: since60 } }, select: { createdAt: true } }),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.booking.findMany({
        where: { travelStartDate: { gte: now } },
        orderBy: { travelStartDate: "asc" },
        take: 5,
        include: { customer: { select: { firstName: true, lastName: true } } },
      }),
    ]);

  // Bookings per day for the last 30 days, plus 30-day vs previous-30-day change
  const perDay = new Map<string, number>();
  let last30 = 0, prev30 = 0;
  for (const { createdAt } of trend) {
    const key = createdAt.toISOString().slice(0, 10);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
    if (now.getTime() - createdAt.getTime() <= 30 * DAY) last30++; else prev30++;
  }
  const days: DayPoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now.getTime() - (29 - i) * DAY);
    return {
      label: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
      count: perDay.get(d.toISOString().slice(0, 10)) ?? 0,
    };
  });
  const delta = prev30 === 0 ? (last30 > 0 ? 100 : 0) : Math.round(((last30 - prev30) / prev30) * 100);

  const stats = [
    { label: "Bookings", value: bookings, caption: `${last30} in the last 30 days`, href: "/admin/bookings", icon: CalendarCheck, tone: styles.toneGreen, delta },
    { label: "Tour packages", value: tours, caption: "In your catalogue", href: "/admin/tours", icon: PackageOpen, tone: styles.toneBlue },
    { label: "Customers", value: customers, caption: "Traveller records", href: "/admin/customers", icon: Users, tone: styles.tonePurple },
    { label: "New enquiries", value: enquiries, caption: "Waiting for a reply", href: "/admin/enquiries", icon: MessageSquareText, tone: styles.toneAmber, alert: enquiries > 0 },
  ];

  const fmt = (d?: Date | null) => d?.toLocaleDateString("en", { dateStyle: "medium" }) ?? "Not scheduled";
  const rows: AdminTableRow[] = recentBookings.map((b) => ({
    id: b.id,
    reference: b.reference,
    customer: `${b.customer.firstName} ${b.customer.lastName}`,
    tour: b.tourTitleSnapshot,
    travel: fmt(b.travelStartDate),
    status: b.status,
    __edit: JSON.stringify({ status: b.status }),
  }));
  const columns = [
    { key: "reference", label: "Reference" },
    { key: "customer", label: "Customer" },
    { key: "tour", label: "Tour package" },
    { key: "travel", label: "Travel date" },
    { key: "status", label: "Status" },
  ];

  const statusTotal = byStatus.reduce((s, x) => s + x._count._all, 0);
  const today = now.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const quick = [
    { href: "/admin/tours/new", title: "Add a tour", caption: "Expand your catalogue", icon: Plus, tone: styles.toneGreen },
    { href: "/admin/destinations", title: "Destinations", caption: `${destinations} locations listed`, icon: MapPinned, tone: styles.toneBlue },
    { href: "/admin/enquiries", title: "Enquiries", caption: `${enquiries} new ${enquiries === 1 ? "message" : "messages"}`, icon: MessageSquareText, tone: styles.toneAmber },
    { href: "/admin/customers", title: "Customers", caption: `${customers.toLocaleString()} records`, icon: Users, tone: styles.tonePurple },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.welcome}>
        <div className={styles.welcomeCopy}>
          <p className={styles.eyebrow}>TRAVEL BUSINESS OVERVIEW</p>
          <p className={styles.date}>{today}</p>
          <h1>{greeting}</h1>
          <p className={styles.lead}>A clear view of your bookings, travellers, and upcoming trips.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/bookings" className={styles.btnGhost}>View bookings</Link>
          <Link href="/admin/tours/new" className={styles.btnPrimary}>
            <Plus size={16} aria-hidden="true" /> Create a tour
          </Link>
        </div>
      </header>

      {enquiries > 0 && (
        <Link href="/admin/enquiries" className={styles.banner}>
          <BellRing size={18} aria-hidden="true" />
          <span><strong>{enquiries} new {enquiries === 1 ? "enquiry needs" : "enquiries need"} a reply.</strong> Quick responses win bookings.</span>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      )}

      <section className={styles.stats} aria-label="Key figures">
        {stats.map(({ label, value, caption, href, icon: Icon, tone, alert, delta: d }) => (
          <Link href={href} key={label} className={styles.stat}>
            <div className={styles.statTop}>
              <span className={`${styles.statIcon} ${tone}`}><Icon size={20} aria-hidden="true" /></span>
              {d !== undefined ? (
                <span className={`${styles.delta} ${d >= 0 ? styles.up : styles.down}`}>
                  {d >= 0 ? <ArrowUpRight size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
                  {Math.abs(d)}%
                </span>
              ) : alert ? <span className={styles.pill}>Needs attention</span> : null}
            </div>
            <div className={styles.statValue}>{value.toLocaleString()}</div>
            <div className={styles.statMeta}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statCaption}>{caption}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className={styles.mid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Booking activity</h2><p>New reservations per day</p></div>
            {prev30 > 0 || last30 > 0 ? <span className={styles.muted}>vs previous 30 days: {delta >= 0 ? "+" : ""}{delta}%</span> : null}
          </div>
          <div className={styles.cardBody}><ActivityChart days={days} /></div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}><div><h2>Booking status</h2><p>{statusTotal.toLocaleString()} reservations in total</p></div></div>
          <div className={styles.cardBody}>
            {statusTotal === 0 ? (
              <p className={styles.muted}>Status breakdown appears once you have bookings.</p>
            ) : (
              <>
                <div className={styles.split} role="img" aria-label="Bookings by status">
                  {byStatus.map((s, i) => (
                    <span key={s.status} style={{ flex: s._count._all, background: SWATCH[i % SWATCH.length] }} />
                  ))}
                </div>
                <ul className={styles.legend}>
                  {byStatus.map((s, i) => (
                    <li key={s.status}>
                      <i style={{ background: SWATCH[i % SWATCH.length] }} />
                      <span>{String(s.status).replace(/_/g, " ").toLowerCase()}</span>
                      <b>{s._count._all.toLocaleString()}</b>
                      <small>{Math.round((s._count._all / statusTotal) * 100)}%</small>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.lower}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div><h2>Recent bookings</h2><p>Latest activity from your customers</p></div>
            <Link href="/admin/bookings" className={styles.viewAll}>View all <ChevronRight size={16} aria-hidden="true" /></Link>
          </div>
          {rows.length > 0 ? (
            <div className={styles.tableWrap}><DataTable columns={columns} rows={rows} section="bookings" /></div>
          ) : (
            <div className={styles.empty}>
              <CalendarCheck size={30} aria-hidden="true" />
              <strong>No bookings yet</strong>
              <span>New reservations will appear here as soon as they come in.</span>
            </div>
          )}
        </div>

        <div className={styles.stack}>
          <div className={styles.card}>
            <div className={styles.cardHead}><div><h2>Upcoming departures</h2><p>Next trips to prepare for</p></div></div>
            {upcoming.length > 0 ? (
              <ul className={styles.list}>
                {upcoming.map((b) => {
                  const d = b.travelStartDate!;
                  const left = Math.max(0, Math.ceil((d.getTime() - now.getTime()) / DAY));
                  return (
                    <li key={b.id}>
                      <span className={styles.dateTile}>
                        <b>{d.toLocaleDateString("en", { day: "numeric" })}</b>
                        <small>{d.toLocaleDateString("en", { month: "short" })}</small>
                      </span>
                      <span className={styles.quickText}>
                        <strong>{b.tourTitleSnapshot}</strong>
                        <small>{b.customer.firstName} {b.customer.lastName} · {left === 0 ? "today" : `in ${left} ${left === 1 ? "day" : "days"}`}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={styles.emptySm}><CalendarClock size={22} aria-hidden="true" /><span>No scheduled departures yet.</span></div>
            )}
          </div>

          <aside className={styles.card} aria-labelledby="quick-title">
            <div className={styles.cardHead}><div><h2 id="quick-title">Quick access</h2><p>Jump to the areas you manage most</p></div></div>
            <ul className={styles.list}>
              {quick.map(({ href, title, caption, icon: Icon, tone }) => (
                <li key={href}>
                  <Link href={href} className={styles.quick}>
                    <span className={`${styles.quickIcon} ${tone}`}><Icon size={18} aria-hidden="true" /></span>
                    <span className={styles.quickText}><strong>{title}</strong><small>{caption}</small></span>
                    <ChevronRight size={18} className={styles.quickChevron} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}