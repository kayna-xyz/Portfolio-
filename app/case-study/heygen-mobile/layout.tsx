import type { Metadata } from "next"

const TITLE = "HeyGen Mobile"
const DESCRIPTION = "Crafting an on-the-go AI video editing experience for mobile users. Product design at HeyGen by Kayna Huang."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study/heygen-mobile" },
  openGraph: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
    url: "https://www.kayna.ai/case-study/heygen-mobile",
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
