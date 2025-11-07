import type React from "react"
import Head from "next/head"
import { Suspense } from "react"
import { DevtoolsBlocker } from "@/components/devtools-blocker"
import "./globals.css"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <Head>
        {/* Favicon for all pages */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <title>otaku-san - Anime Streaming Platform</title>
        <meta
          name="description"
          content="Discover and stream unlimited anime with otaku-san. Your ultimate destination for anime series and movies."
        />
      </Head>
      <body className="antialiased">
        <DevtoolsBlocker />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.app",
}
