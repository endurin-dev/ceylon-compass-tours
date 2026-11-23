import type { Metadata } from "next";
import { Mr_Dafoe, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

const script = Mr_Dafoe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ceylon Compass | Explore Sri Lanka",
  description: "Discover Sri Lanka with memorable guided tours and travel experiences.",
  icons: {
    icon: "/favicon.ico?v=2"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${script.variable}`}>
      <body className="font-[family-name:var(--font-sans)] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
