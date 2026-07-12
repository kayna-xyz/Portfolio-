import type { Metadata } from "next"
import KaynoteApp from "./kynotes/kaynote-app"

export const metadata: Metadata = {
  title: "KyNotes",
  description: "Kayna's notes, an intro and a blog kept in a little Apple Notes corner of the site.",
}

export default function Page() {
  return <KaynoteApp />
}
