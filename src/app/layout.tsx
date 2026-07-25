import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatWidget from "@/components/chat/ChatWidget";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://timetravel-agency.vercel.app"),
  title: {
    default: "TimeTravel Agency — Luxury Passage Through Time",
    template: "%s · TimeTravel Agency",
  },
  description:
    "A private temporal travel house arranging curated passage to Belle Époque Paris, the Late Cretaceous, and Renaissance Florence.",
  keywords: [
    "time travel",
    "luxury travel",
    "Paris 1889",
    "Cretaceous",
    "Renaissance Florence",
  ],
  openGraph: {
    title: "TimeTravel Agency — Luxury Passage Through Time",
    description:
      "Curated passage to Belle Époque Paris, the Late Cretaceous, and Renaissance Florence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="bg-ink-950 text-parchment flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Concierge chat is mounted at the root so it persists on every page. */}
        <ChatWidget />
      </body>
    </html>
  );
}
