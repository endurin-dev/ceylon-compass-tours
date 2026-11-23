"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Instagram,
  Facebook,
  Heart,
  MessageCircle,
  Send,
  ThumbsUp,
  Share2,
  BadgeCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  CONFIG – edit these in one place                                   */
/* ------------------------------------------------------------------ */
const INSTAGRAM_URL = "https://www.ceyloncompass.com";
const FACEBOOK_URL = "https://www.ceyloncompass.com";
const HANDLE = "ceyloncompass";
const PAGE_NAME = "Ceylon Compass";

// Add real photos in `image` (e.g. "/posts/ella.jpg"). Without one, a colour tile shows.
const posts = [
  { label: "Ella train", from: "#2F6B4F", to: "#9BD3A5", likes: 248, image: "" },
  { label: "Sigiriya", from: "#D9822B", to: "#F2B134", likes: 391, image: "" },
  { label: "Mirissa", from: "#0E6E8C", to: "#6FD0E0", likes: 312, image: "" },
  { label: "Tea country", from: "#1F5A3A", to: "#7DBE7A", likes: 205, image: "" },
  { label: "Yala safari", from: "#A8501E", to: "#E39A4B", likes: 276, image: "" },
  { label: "Galle Fort", from: "#c85a10", to: "#df8615", likes: 334, image: "" },
];

const reviews = [
  {
    name: "Sarah M.",
    source: "facebook",
    text: "An amazing trip! Everything was perfectly organized. Highly recommended!",
    initials: "SM",
  },
  {
    name: "David K.",
    source: "instagram",
    text: "Incredible experience. Sri Lanka is truly a magical place!",
    initials: "DK",
  },
  {
    name: "Anna P.",
    source: "facebook",
    text: "Professional service and unforgettable memories. Thank you!",
    initials: "AP",
  },
  {
    name: "James R.",
    source: "instagram",
    text: "Our guide knew every corner of the island. The train ride to Ella was a highlight.",
    initials: "JR",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Instagram phone                                                    */
/* ------------------------------------------------------------------ */
function InstagramPhone() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open @${HANDLE} on Instagram`}
      className="group block w-[290px] shrink-0 -rotate-3 transition-transform duration-500 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-[2.5rem]"
    >
      <div className="rounded-[2.5rem] bg-[#062F3A] p-2.5 shadow-[0_30px_60px_-20px_rgba(6,47,58,0.6)]">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          {/* header */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-3">
            <div className="rounded-full p-[3px] bg-[conic-gradient(from_200deg,#df8615,#e66a12,#c85a10,#df8615)]">
              <div className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-white bg-[#062F3A] text-amber-300">
                <Star className="h-6 w-6 fill-amber-300" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-sm font-bold text-slate-900 truncate">
                {HANDLE}
                <BadgeCheck className="h-4 w-4 text-sky-500 shrink-0" />
              </p>
              <p className="text-xs text-slate-500">Sri Lanka tours &amp; travel</p>
            </div>
          </div>

          <div className="px-4 pb-3">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e66a12] py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#c85a10]">
              <Instagram className="h-4 w-4" /> Follow on Instagram
            </span>
          </div>

          {/* grid */}
          <div className="grid grid-cols-3 gap-0.5 bg-white">
            {posts.map((p) => (
              <div
                key={p.label}
                className="relative aspect-square overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
              >
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.label} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4 text-[10px] font-semibold text-white">
                  {p.label}
                </span>
                <span className="absolute inset-0 flex items-center justify-center gap-1 bg-black/55 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Heart className="h-3.5 w-3.5 fill-white" /> {p.likes}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 px-4 py-3 text-slate-800">
            <Heart className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
          </div>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Facebook page card                                                 */
/* ------------------------------------------------------------------ */
function FacebookCard() {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${PAGE_NAME} on Facebook`}
      className="group block w-[340px] shrink-0 rotate-2 transition-transform duration-500 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-3xl md:mt-16"
    >
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-20px_rgba(6,47,58,0.55)]">
        {/* cover */}
        <div className="relative h-28 bg-[linear-gradient(120deg,#0E6E8C,#2F6B4F_55%,#F2B134)]">
          <div className="absolute -bottom-8 left-5 grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-[#062F3A] text-amber-300">
            <Star className="h-7 w-7 fill-amber-300" />
          </div>
        </div>
        <div className="px-5 pb-5 pt-10">
          <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
            {PAGE_NAME}
            <BadgeCheck className="h-5 w-5 text-[#1877F2]" />
          </p>
          <p className="text-sm text-slate-500">Travel agency · Sri Lanka</p>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">
              “Sunrise over the hill country, tea in hand. Where should we take you next?”
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#1877F2]">
                  <ThumbsUp className="h-2.5 w-2.5 text-white" />
                </span>
                Guests love this
              </span>
              <Share2 className="h-3.5 w-3.5" />
            </div>
          </div>

          <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-[#1262c9]">
            <Facebook className="h-4 w-4 fill-white" /> Like &amp; follow our page
          </span>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Reviews carousel (your original, now with source badges)           */
/* ------------------------------------------------------------------ */
export function ReviewsCarousel() {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex justify-end gap-3">
        <button
          aria-label="Previous reviews"
          onClick={() => scroll(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next reviews"
          onClick={() => scroll(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r) => (
          <figure
            key={r.name}
            className="relative flex w-full shrink-0 snap-start gap-4 rounded-2xl bg-white p-6 md:w-[calc((100%-3rem)/3)]"
          >
            <span
              aria-hidden="true"
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#062F3A] text-sm font-bold text-white"
            >
              {r.initials}
            </span>
            <div className="flex flex-col justify-between">
              <blockquote className="text-sm leading-relaxed text-slate-700">
                <span className="mr-1 text-3xl leading-none text-[#e66a12] font-[family-name:var(--font-script)]">
                  &ldquo;
                </span>
                {r.text}
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-900">
                {r.name}
                <span className="flex" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </figcaption>
            </div>
            <span
              className={`absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full text-white ${
                r.source === "facebook" ? "bg-[#1877F2]" : "bg-[#e66a12]"
              }`}
              title={`Posted on ${r.source === "facebook" ? "Facebook" : "Instagram"}`}
            >
              {r.source === "facebook" ? (
                <Facebook className="h-3 w-3 fill-white" />
              ) : (
                <Instagram className="h-3 w-3" />
              )}
            </span>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The full section: drop <SocialShowcase /> into your page           */
/* ------------------------------------------------------------------ */
export default function SocialShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#062F3A] px-6 py-20 text-white md:py-28">
      {/* soft sunset glow behind the mockups */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,177,52,0.35),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            The island, as our guests see it
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Real trips, real faces, posted by the people who travelled with us. Follow along and
            plan yours.
          </p>
        </div>

        {/* mockups */}
        <div className="mt-16 flex flex-col items-center justify-center gap-12 md:flex-row md:items-start md:gap-10">
          <InstagramPhone />
          <FacebookCard />
        </div>

        {/* CTAs */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#e66a12] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#c85a10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <Instagram className="h-4 w-4" /> @{HANDLE}
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#1262c9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <Facebook className="h-4 w-4 fill-white" /> {PAGE_NAME}
          </a>
        </div>

        {/* reviews */}
        <div className="mt-20">
          <ReviewsCarousel />
        </div>
      </div>
    </section>
  );
}