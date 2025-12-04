"use client"

import Link from "next/link"
import { Search, Play, Share2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) setRecentSearches(JSON.parse(saved))
  }, [])

  const topSearches = [
    "One Piece",
    "Naruto Shippuden",
    "Attack on Titan",
    "Demon Slayer",
    "My Hero Academia",
    "Jujutsu Kaisen",
    "Death Note",
    "Steins;Gate",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              さ
            </div>
            <span className="text-2xl font-bold text-primary">sayori.to</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-foreground/70">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <Link href="/home" className="hover:text-primary transition">
              Anime
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Top Airing
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Popular
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                  Discover Your Next Favorite Anime
                </h1>
                <p className="text-lg text-muted-foreground">
                  Stream thousands of anime titles in high quality. Free, fast, and reliable.
                </p>
              </div>

              {/* Search Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-full bg-card border-2 border-border focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground transition"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2.5 rounded-full hover:bg-primary/90 transition">
                    <Search size={20} />
                  </button>
                </div>

                {/* Top Searches */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">Top searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {topSearches.slice(0, 5).map((search) => (
                      <button
                        key={search}
                        onClick={() => setSearchQuery(search)}
                        className="px-4 py-1 text-sm bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-full transition border border-secondary/30"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition shadow-lg hover:shadow-xl"
              >
                <Play size={20} />
                Start Watching
              </Link>
            </div>

            {/* Right - Sayori Character Replace emoji with actual character image */}
            <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl blur-3xl" />
              <div className="relative z-10">
                <img
                  src="/sayori-character.jpg"
                  alt="Sayori - sayori.to mascot"
                  className="h-96 md:h-[500px] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Share Section */}
      <section className="border-t border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Share2 size={20} className="text-primary" />
            <span className="font-semibold text-foreground">Share sayori.to</span>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Facebook", color: "bg-blue-600" },
              { label: "Twitter", color: "bg-sky-500" },
              { label: "Reddit", color: "bg-orange-600" },
              { label: "Telegram", color: "bg-blue-400" },
            ].map((social) => (
              <button
                key={social.label}
                className={`${social.color} text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition`}
              >
                {social.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">sayori.to - Stream Anime Freely</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Watch unlimited anime with no restrictions. From classic series to the latest releases, sayori.to brings
              you the best of anime entertainment. Experience smooth streaming, no ads, and unlimited content.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Join thousands of anime fans who trust sayori.to for their daily dose of entertainment. Stream in HD
              quality, discover new shows, and never miss your favorite anime.
            </p>
          </div>

          {/* Anime News */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Latest in Anime</h3>
            <div className="space-y-4">
              {[
                { title: "Top Seasonal Anime", desc: "Check out what's trending this season" },
                { title: "New Releases", desc: "Fresh episodes uploaded daily" },
                { title: "Community Favorites", desc: "See what other fans are watching" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 bg-card rounded-lg border border-border hover:border-primary transition cursor-pointer"
                >
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 text-center py-8 text-muted-foreground">
        <p>&copy; 2025 sayori.to. All rights reserved. Watch anime online for free.</p>
      </footer>
    </div>
  )
}
