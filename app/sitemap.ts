import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://loansaathi.online";
  const routes = [
    "", "get-loan", "instant-loan", "personal-loan", "business-loan",
    "home-loan", "vehicle-loan", "education-loan", "how-it-works",
    "loan-eligibility", "track-application", "help",
    "legal/terms", "legal/privacy", "legal/refund-policy", "legal/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${base}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
