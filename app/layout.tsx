import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SmoothScroll from "@/app/components/SmoothScroll";
import CustomCursor from "@/app/components/CustomCursor";
import "./globals.css";

const heading = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-body",
  display: "swap",
});

const title = "Alex Krstovic — Digital Product Designer";
const description =
  "Digital Product Designer from Vancouver helping individuals and companies build great digital products.";

// Declared explicitly so iOS Safari always knows the status bar/toolbar
// tint — without this it guesses by sampling page content, and that
// guess can get stuck on a since-removed element's color (e.g. the
// mobile menu's green background staying after the menu closes).
export const viewport: Viewport = {
  themeColor: "#f7efed",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alexkrstovic.com"),
  title,
  description,
  // www.alexkrstovic.com 308s to the apex host at the Vercel domain level,
  // so only one host serves the site. These self-referencing canonicals are
  // the belt to that redirect's braces: they keep the authoritative URL
  // unambiguous for any crawler that reaches a page by another route.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Alex Krstovic",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alex Krstovic",
  jobTitle: "Digital Product Designer",
  url: "https://alexkrstovic.com",
  image: "https://alexkrstovic.com/images/about-photo.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vancouver",
    addressRegion: "BC",
    addressCountry: "CA",
  },
  sameAs: ["https://linkedin.com/in/alexkrstovic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
