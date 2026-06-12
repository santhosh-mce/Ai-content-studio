"use client"

import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  // Try to load initial accent from localStorage or default to purple
  useEffect(() => {
    const savedAccent = localStorage.getItem("ai_accent_color") || "purple"
    document.documentElement.setAttribute("data-accent", savedAccent)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
