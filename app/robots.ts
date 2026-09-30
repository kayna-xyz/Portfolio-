import type { MetadataRoute } from "next"

// Crawling stays allowed on purpose: search engines only honor the
// noindex meta tag / X-Robots-Tag header if they can fetch the page.
// No sitemap is published.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ascii-preview"],
    },
  }
}
