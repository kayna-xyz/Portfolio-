import type { Metadata } from "next"
import KaynoteApp from "../kynotes/kaynote-app"

const ABOUT_DESCRIPTION =
  "Kayna Huang's notes on design, building, and reading, plus a short intro, experience, and education. A product designer and design engineer at Barnard College, Columbia University."

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Kayna Huang",
    description: ABOUT_DESCRIPTION,
    url: "https://www.kayna.ai/about",
  },
  twitter: {
    title: "About · Kayna Huang",
    description: ABOUT_DESCRIPTION,
  },
}

export default function Page() {
  return <KaynoteApp />
}
