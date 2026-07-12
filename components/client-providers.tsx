"use client"

import { usePathname } from "next/navigation"

import EffectStack from "@/components/effect-stack"

export default function ClientProviders() {
  const pathname = usePathname()
  // KyNotes is a full-screen Apple Notes replica — keep the site toys off it.
  if (pathname?.startsWith("/kynotes") || pathname?.startsWith("/kaynote")) return null
  return <EffectStack />
}
