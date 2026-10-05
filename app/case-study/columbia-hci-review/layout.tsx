import type { Metadata } from "next"

const TITLE = "Building the Visual Identity for Columbia HCI Review"
const DESCRIPTION = "Crafting a cohesive visual voice for Columbia's first student-led HCI publication. Brand and visual design by Kayna Huang."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study/columbia-hci-review" },
  openGraph: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
    url: "https://www.kayna.ai/case-study/columbia-hci-review",
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
