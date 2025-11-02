import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ContentRow } from "@/components/content-row"
import { Footer } from "@/components/footer"
import {
  getPopularTVShows,
  getTrendingTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  getAiringTodayTVShows,
} from "@/lib/anilist"

export default async function TVShowsPage() {
  const [popular, trending, topRated, onTheAir, airingToday] = await Promise.all([
    getPopularTVShows(),
    getTrendingTVShows(),
    getTopRatedTVShows(),
    getOnTheAirTVShows(),
    getAiringTodayTVShows(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-20 pt-24">
        <div className="px-8 mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Anime Series</h1>
          <p className="text-muted-foreground">Discover the best anime series from around the world</p>
        </div>
        <div className="space-y-12 pb-20">
          <ContentRow title="Trending Anime" items={trending} />
          <ContentRow title="Popular Anime" items={popular} />
          <ContentRow title="Top Rated Anime" items={topRated} />
          <ContentRow title="Currently Airing" items={onTheAir} />
          <ContentRow title="Airing Today" items={airingToday} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
