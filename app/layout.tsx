import type React from "react"
import { Suspense } from "react"
import { DevtoolsBlocker } from "@/components/devtools-blocker"
import "./globals.css"

export const metadata = {
  title: "otaku-san",
  description:
    "Discover and stream unlimited anime with otaku-san. Your ultimate destination for anime series and movies.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  generator: "v0.app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <DevtoolsBlocker />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
