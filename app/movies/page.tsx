import { Header } from "@/components/header"
import { ContentRow } from "@/components/content-row"
import { Footer } from "@/components/footer"
import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/lib/anilist"

export default async function MoviesPage() {
  const [popular, trending, topRated, nowPlaying, upcoming] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Anime Movies</h1>
          <p className="text-muted-foreground mt-2">Explore the latest and greatest anime movies</p>
        </div>
        <div className="space-y-12 pb-20">
          <ContentRow title="Trending Movies" items={trending} />
          <ContentRow title="Popular Movies" items={popular} />
          <ContentRow title="Top Rated Movies" items={topRated} />
          <ContentRow title="Now Playing" items={nowPlaying} />
          <ContentRow title="Coming Soon" items={upcoming} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
