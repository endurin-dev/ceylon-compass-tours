"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Kaushan_Script } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Home,
  Compass,
  Landmark,
  MapPin,
  Info,
  Phone,
  Waves,
  Languages,
  CarFront,
} from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    googleTranslateWidget?: HTMLElement;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string,
        ) => unknown;
      };
    };
  }
}

const script = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// TODO: replace with your real social page links
const FACEBOOK_URL = "https://www.facebook.com/";
const INSTAGRAM_URL = "https://www.instagram.com/";

const PLAN_HREF = "/tour-packages";
const TRANSLATION_DEFAULT_KEY = "ceylon-compass-translation-defaulted";

type NavItem = { label: string; href: string; external?: boolean };

const navLinks: (NavItem & {
  icon: React.ComponentType<{ className?: string }>;
})[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tour Packages", href: "/tour-packages", icon: Compass },
  { label: "Destinations", href: "/destinations", icon: MapPin },
  { label: "Attractions", href: "/attractions", icon: Landmark },
  { label: "Activities", href: "/activities", icon: Waves },
  { label: "Transport", href: "https://www.ceyloncompasstravels.ru", external: true, icon: CarFront },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function openTranslateSelector(elementId: string) {
  document
    .getElementById(elementId)
    ?.querySelector<HTMLAnchorElement>(".goog-te-gadget-simple a")
    ?.click();
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Company name in script lettering. */
function BrandName({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`${script.className} flex items-center gap-1 pr-1 text-[1.05rem] sm:text-2xl ${
          tone === "light"
            ? "bg-gradient-to-r from-[#e66a12] via-[#df8615] to-[#e66a12] bg-clip-text text-transparent"
            : "text-white"
        }`}
      >
        Ceylon

      </span>
      <span
        className={`mt-0.5 flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.32em] sm:text-[0.68rem] ${
          tone === "light" ? "text-[#0D2A5C]" : "text-white/85"
        }`}
      >
        <i aria-hidden="true" className="block h-px w-3 bg-current opacity-60 sm:w-5" />
        Compass
      </span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll while the menu is open + close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (window.sessionStorage.getItem(TRANSLATION_DEFAULT_KEY) !== "true") {
      document.cookie = "googtrans=/en/en; path=/; SameSite=Lax";
      window.sessionStorage.setItem(TRANSLATION_DEFAULT_KEY, "true");
    }

    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;

      const desktopTarget = document.getElementById("google_translate_element");
      const mobileTarget = document.getElementById("google_translate_element_mobile");
      const target = open ? mobileTarget : desktopTarget;
      if (!target) return;

      const existingWidget =
        window.googleTranslateWidget ??
        desktopTarget?.firstElementChild ??
        mobileTarget?.firstElementChild;
      if (existingWidget instanceof HTMLElement) {
        window.googleTranslateWidget = existingWidget;
        if (existingWidget.parentElement !== target) target.appendChild(existingWidget);
        return;
      }

      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,de,es,ru,ja,zh-CN,ar,ta",
          layout: 2,
          autoDisplay: false,
        },
        target.id,
      );
      if (target.firstElementChild instanceof HTMLElement) {
        window.googleTranslateWidget = target.firstElementChild;
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&hl=en";
      script.async = true;
      document.head.appendChild(script);
    }
  }, [open]);

  // Round icon buttons: soft backing on the home hero so they never vanish into the photo
  const iconBtn = `flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-slate-800 transition-all duration-200 ${
    isHomePage ? "bg-white/80 shadow-sm backdrop-blur hover:bg-white" : "hover:bg-slate-100"
  }`;

  return (
    <>
      <header
        className={`w-full z-50 ${
          isHomePage
            ? "absolute top-0 bg-transparent"
            : "sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-5 xl:px-12">
          {/* Brand: hanging tab with logo + company name */}
          <Link
            href="/"
            aria-label="Ceylon Compass – Home"
            className="group relative z-10 -mt-3 flex shrink-0 items-center gap-2 self-start rounded-b-2xl border-b-[3px] border-[#e66a12]
              bg-white px-2.5 pb-1.5 pt-2.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]
              transition-all duration-300 ease-out hover:shadow-[0_12px_24px_-8px_rgba(13,42,92,0.45)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2A5C] focus-visible:ring-offset-2
              sm:gap-3 sm:px-4 md:px-5"
          >
            <Image
              src="/images/logo.webp"
              alt=""
              width={130}
              height={50}
              className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9 md:h-10"
              priority
            />
            <span
              aria-hidden="true"
              className="h-7 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent sm:h-9"
            />
            <BrandName />
          </Link>

          {/* Desktop Navigation: floating pill */}
          <nav className="hidden items-center divide-x divide-slate-400/30 rounded-full bg-white/65 px-2 py-2 text-xs font-semibold tracking-normal text-slate-800 shadow-sm ring-1 ring-white/60 backdrop-blur-md lg:flex">
            {navLinks.map(({ label, href, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="transport-link group/t relative mx-1 flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-3 py-2 !text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#df8615]"
                >
                  <CarFront
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/t:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{label}</span>
                  <ArrowUpRight
                    className="h-3 w-3 opacity-80 transition-transform duration-200 group-hover/t:-translate-y-0.5 group-hover/t:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-2 py-2 xl:px-2.5 transition-colors hover:bg-[#e66a12] hover:!text-white focus:bg-[#e66a12] focus:!text-white focus:outline-none active:!text-white ${
                    isActive(pathname, href) ? "bg-[#e66a12] !text-white" : ""
                  }`}
                >
                  {label}
                </Link>
              ),
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            <div
              className="google-translator hidden items-center gap-1.5 xl:flex"
              aria-label="Choose website language"
            >
              <button
                type="button"
                aria-label="Open language selector"
                onClick={() => openTranslateSelector("google_translate_element")}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2A5C]"
              >
                <Languages className="h-4 w-4 text-slate-700" aria-hidden="true" />
              </button>
              <div id="google_translate_element" />
            </div>

            {/* Plan Your Trip: visible on every screen size, right of the brand on mobile */}
            <Link
              href={PLAN_HREF}
              className="group/cta flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#e66a12] px-3 py-2 text-xs font-semibold !text-white shadow-md transition-all duration-200 hover:bg-[#c85a10] hover:!text-white hover:shadow-lg sm:px-4"
            >
              <span className="text-white">Plan Your Trip</span>
              <ArrowRight className="hidden h-3.5 w-3.5 text-white transition-transform group-hover/cta:translate-x-0.5 xl:block" />
            </Link>

            <button
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className={`lg:hidden ${iconBtn} hover:text-[#0D2A5C]`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu – full-screen "Indian Ocean" panel that slides in from the right */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        aria-hidden={!open}
        className={`lg:hidden fixed inset-0 z-[60] flex flex-col overflow-hidden text-white
          bg-[linear-gradient(165deg,#04222E_0%,#0A4A57_55%,#0F6E6A_100%)]
          transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none
          ${open ? "visible translate-x-0" : "invisible translate-x-full"}`}
      >
        {/* Decoration: compass-style rings top-right + warm brand glow bottom-left */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-white/10"
          viewBox="0 0 320 320"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="160" cy="160" r="60" />
          <circle cx="160" cy="160" r="100" />
          <circle cx="160" cy="160" r="140" />
          <circle cx="160" cy="160" r="180" />
          <path d="M160 0v320M0 160h320" strokeDasharray="3 7" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#df8615]/30 blur-3xl"
        />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            aria-label="Ceylon Compass – Home"
            className="group flex items-center gap-3"
          >
            <span className="rounded-2xl bg-white px-3 py-2 shadow-lg">
              <Image
                src="/images/logo.webp"
                alt=""
                width={130}
                height={50}
                className="h-8 w-auto object-contain"
              />
            </span>
            <BrandName tone="dark" />
          </Link>
          <button
            ref={closeRef}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 active:bg-white/25"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links: slide in one after another when the menu opens */}
        <nav
          aria-label="Mobile"
          className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4"
        >
          <ul className="space-y-0.5">
            {navLinks.map(({ label, href, external, icon: Icon }, i) => {
              const active = isActive(pathname, href);
              const linkClassName = `group flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm font-semibold tracking-normal !text-white transition-colors hover:bg-white/15 hover:!text-white focus:bg-white/15 focus:!text-white focus:outline-none active:bg-white/20 active:!text-white ${
                active ? "bg-white/10" : ""
              }`;
              return (
                <li
                  key={href}
                  className={`transition-all duration-300 ease-out motion-reduce:transition-none ${
                    open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                >
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="transport-link group relative flex items-center gap-2.5 overflow-hidden rounded-xl px-2.5 py-1.5 text-sm font-bold !text-white focus:outline-none active:!text-white"
                    >
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="relative z-10">{label}</span>
                      <ArrowUpRight className="relative z-10 ml-auto mr-1 h-4 w-4 opacity-90" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={href} className={linkClassName}>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                          active ? "bg-[#e66a12] !text-white" : "bg-white/10 group-hover:bg-white/20"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: call to action + social */}
        <div className="relative z-10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
          <Link
            href={PLAN_HREF}
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e66a12] text-base font-semibold !text-white shadow-[0_10px_30px_-8px_rgba(230,106,18,0.7)] active:bg-[#c85a10]"
          >
            Plan Your Trip
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div
            className="google-translator google-translator-mobile mt-4 flex items-center justify-center gap-2"
            aria-label="Choose website language"
          >
            <button
              type="button"
              aria-label="Open language selector"
              onClick={() => openTranslateSelector("google_translate_element_mobile")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-semibold">Translate</span>
            <div id="google_translate_element_mobile" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-sm text-white/70">Follow us</span>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ceylon Compass on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white active:bg-white/25"
            >
              <FacebookIcon />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ceylon Compass on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white active:bg-white/25"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}