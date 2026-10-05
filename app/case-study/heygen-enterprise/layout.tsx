import type { Metadata } from "next"

const TITLE = "HeyGen, Forbes AI 50, App Design"
const DESCRIPTION = "Architecting a seamless AI video experience for enterprise-scale and consumer communication. Product design at HeyGen by Kayna Huang."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study/heygen-enterprise" },
  openGraph: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
    url: "https://www.kayna.ai/case-study/heygen-enterprise",
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
