import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeroSection } from "@/components/hero-section"
import { ContinueWatchingRow } from "@/components/continue-watching-row"
import { GenreFilter } from "@/components/genre-filter"
import { ContentRow } from "@/components/content-row"
import { Footer } from "@/components/footer"
import { getTrending, getPopularTVShows, getPopularAnime } from "@/lib/anilist"

export default async function Home() {
  const [trending, popularShows, popularAnime] = await Promise.all([
    getTrending(),
    getPopularTVShows(),
    getPopularAnime(),
  ])

  const heroItems = trending.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-20">
        <HeroSection items={heroItems} />

        {/* Continue Watching Section */}
        <section className="px-8 py-12 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Continue watching</h2>
          <ContinueWatchingRow />
        </section>

        {/* Genre Filter */}
        <section className="px-8 py-8 border-b border-border bg-card/30">
          <GenreFilter />
        </section>

        {/* Trending Section with Numbered Cards */}
        <section className="px-8 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Trending</h2>
          <ContentRow items={trending.slice(0, 8)} showThumbnails={true} numbered={true} />
        </section>

        {/* Content Rows */}
        <div className="space-y-12 px-8 py-12">
          <ContentRow title="Popular Anime Series" items={popularShows} />
          <ContentRow title="Popular on sayori.to" items={popularAnime} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
