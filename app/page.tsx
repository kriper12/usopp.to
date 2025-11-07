"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeroSection } from "@/components/hero-section"
import { GenreFilter } from "@/components/genre-filter"
import { ContentRow } from "@/components/content-row"
import { Footer } from "@/components/footer"
import { getTrending, getPopularTVShows, getPopularAnime } from "@/lib/anilist"
import { getContinueWatching } from "@/lib/continue-watching"
import { CurrentlyWatching } from "@/components/currently-watching"
import { useEffect, useState } from "react"

interface ContentItem {
  id: number
  title: string
  image: string
  rating: string
  year: string
  type: string
  overview: string
  genres?: string[]
}

async function getInitialData() {
  const [trending, popularShows, popularAnime] = await Promise.all([
    getTrending(),
    getPopularTVShows(),
    getPopularAnime(),
  ])
  return { trending, popularShows, popularAnime }
}

export default function Home() {
  const searchParams = useSearchParams()
  const selectedGenre = searchParams.get("genre")
  const [data, setData] = useState<{
    trending: ContentItem[]
    popularShows: ContentItem[]
    popularAnime: ContentItem[]
  } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const initialData = await getInitialData()
      setData(initialData)
    }
    loadData()
  }, [])

  if (!data) {
    return <div className="min-h-screen bg-background" />
  }

  const filterByGenre = (items: ContentItem[]) => {
    if (!selectedGenre) return items
    return items.filter((item) => item.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()))
  }

  const trending = data.trending
  const popularShows = filterByGenre(data.popularShows)
  const popularAnime = filterByGenre(data.popularAnime)
  const heroItems = trending.slice(0, 5)
  const continueWatching = getContinueWatching()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-20">
        <HeroSection items={heroItems} />

        {/* Genre Filter */}
        <section className="px-8 py-8 border-b border-border bg-card/30">
          <GenreFilter />
        </section>

        {continueWatching.length > 0 && (
          <section className="px-8 py-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Currently watching</h2>
            <CurrentlyWatching items={continueWatching} />
          </section>
        )}

        {/* Content Rows */}
        <div className="space-y-12 px-8 py-12">
          <ContentRow title="Trending Anime" items={trending} />
          <ContentRow title="Popular Anime Series" items={popularShows} />
          <ContentRow title="Popular on otaku-san" items={popularAnime} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
