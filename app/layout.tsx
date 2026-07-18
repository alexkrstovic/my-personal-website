import type { Metadata } from "next";
import { Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://alexkrstovic.com"),
  title,
  description,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
