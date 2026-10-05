import type { Metadata } from "next"

const TITLE = "Lluna, AI Aesthetic Consultant"
const DESCRIPTION = "Know before you sit in the chair. An AI aesthetic consultant designed and built by Kayna Huang."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study/lluna" },
  openGraph: {
    title: TITLE + " · Kayna Huang",
    description: DESCRIPTION,
    url: "https://www.kayna.ai/case-study/lluna",
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
