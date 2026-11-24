
import type { Metadata } from "next";
import { Mr_Dafoe, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const script = Mr_Dafoe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const BASE_URL = "https://www.ceyloncompass.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      "Sri Lanka Tours & Holidays | Tour Packages & Travel Experiences | Ceylon Compass",
    template: "%s | Ceylon Compass",
  },

  description:
    "Explore Sri Lanka with Ceylon Compass. Discover Sri Lanka tour packages, private tours, beautiful beaches, wildlife safaris, cultural experiences, historic attractions and unforgettable holidays across the island.",

  applicationName: "Ceylon Compass",

  keywords: [
    "Sri Lanka tours",
    "Sri Lanka tour packages",
    "Sri Lanka holidays",
    "Sri Lanka travel",
    "Sri Lanka vacation",
    "private tours Sri Lanka",
    "best places to visit in Sri Lanka",
    "Sri Lanka destinations",
    "Sri Lanka travel experiences",
    "Sri Lanka sightseeing tours",
    "Sri Lanka cultural tours",
    "Sri Lanka adventure tours",
    "Sri Lanka wildlife safari",
    "Sri Lanka beach holidays",
    "Sri Lanka heritage tours",
    "Sri Lanka day tours",
    "Sri Lanka excursions",
    "Sri Lanka travel guide",
    "things to do in Sri Lanka",
    "Sri Lanka tourist attractions",
    "Sri Lanka nature tours",
    "Sri Lanka historical places",
    "Sri Lanka holiday packages",
    "Ceylon Compass",
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ceylon Compass",
    title:
      "Explore Sri Lanka | Tours, Holidays & Travel Experiences",
    description:
      "Discover the beauty of Sri Lanka with Ceylon Compass. Explore incredible destinations, cultural attractions, wildlife, beaches and unforgettable travel experiences.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Sri Lanka with Ceylon Compass",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Tours & Holidays | Ceylon Compass",
    description:
      "Discover Sri Lanka's beautiful destinations, tours, beaches, wildlife and cultural experiences.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${script.variable}`}>
      <body className="font-[family-name:var(--font-sans)] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
