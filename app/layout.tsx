import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Devanagari, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import IntroSplash from "@/components/IntroSplash";
import { Analytics } from "@vercel/analytics/next";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexDevanagari = IBM_Plex_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-devanagari",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://loansaathi.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LoanSaathi – Apply for Personal, Business & Other Loans Online in India",
    template: "%s | LoanSaathi",
  },
  description:
    "Apply for personal, business, home, vehicle and education loan assistance online in India. Check eligibility, submit your application and track your status with mobile OTP.",
  keywords: [
    "personal loan online", "instant loan India", "business loan online",
    "home loan eligibility", "vehicle loan application", "education loan India",
    "loan application online India", "apply loan online",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "LoanSaathi",
    title: "LoanSaathi – Simple Loan Assistance for Every Indian",
    description:
      "Apply for personal, business, home, vehicle and education loan assistance online. Mobile OTP login, simple application, real-time tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanSaathi – Simple Loan Assistance for Every Indian",
    description: "Apply for loan assistance online. Mobile OTP login, simple application, real-time tracking.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LoanSaathi",
    url: siteUrl,
    description: "Loan application assistance and referral platform for personal, business, home, vehicle and education loans in India.",
  };

  return (
    <html lang="en" className={`${plexSans.variable} ${plexDevanagari.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <IntroSplash />
        <Header />
        <main className="min-h-screen pb-24 sm:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
