import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ContentRow } from "@/components/content-row"
import { Footer } from "@/components/footer"
import { ContinueWatchingRow } from "@/components/continue-watching-row"
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
      <main>
        <HeroSection items={heroItems} />
        <div className="space-y-12 pb-20">
          <div className="container mx-auto px-4">
            <ContinueWatchingRow />
          </div>
          <ContentRow title="Trending Anime" items={trending} />
          <ContentRow title="Popular Anime Series" items={popularShows} />
          <ContentRow title="Popular On Usopp" items={popularAnime} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
