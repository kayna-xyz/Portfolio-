import type { Metadata } from "next"

const TITLE = "Signal-32: Assess Your Next Investment in 32 Questions"
const DESCRIPTION = "An internal tool to quickly evaluate early-stage AI startups in 32 questions. Designed and built by Kayna Huang."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study/signal-32" },
  openGraph: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
    url: "https://www.kayna.ai/case-study/signal-32",
    type: "article",
  },
  twitter: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
