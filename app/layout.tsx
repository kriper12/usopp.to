import type React from "react"
import Head from "next/head"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { DevtoolsBlocker } from "@/components/devtools-blocker"
import "./globals.css"

const geistSans = GeistSans.variable
const geistMono = GeistMono.variable

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        {/* Favicon for all pages */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <title>sayori.to - Anime Streaming</title>
        <meta
          name="description"
          content="Discover and stream your favorite anime on sayori.to. Watch anime online for free with high quality."
        />
      </Head>
      <body className={`${geistSans} ${geistMono} antialiased`}>
        <DevtoolsBlocker />
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
