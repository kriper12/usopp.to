import { getMovieDetails, getTVShowDetails, getTVShowSeasons, getRelatedAnime } from "@/lib/anilist"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import VideoPlayer from "@/components/video-player"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ContentRow } from "@/components/content-row"

interface WatchPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params
  const { type } = await searchParams
  const isMovie = type !== "tv"

  let content = null
  let episodeCount = 12

  if (isMovie) {
    content = await getMovieDetails(Number.parseInt(id))
  } else {
    content = await getTVShowDetails(Number.parseInt(id))
    const seasonsData = await getTVShowSeasons(Number.parseInt(id))
    if (seasonsData?.seasons?.[0]) {
      episodeCount = seasonsData.seasons[0].episodeCount
    }
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Content not found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedAnime = await getRelatedAnime(Number.parseInt(id), content.title)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      {/* Main content with left margin for sidebar and top padding for header */}
      <main className="ml-20 pt-24">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="space-y-6">
            <VideoPlayer
              contentId={id}
              isMovie={isMovie}
              episodeCount={episodeCount}
              title={content.title}
              posterPath={content.image}
            />

            {/* Content Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{content.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      {content.rating}
                    </Badge>
                    <span>{content.year}</span>
                    <span>{isMovie ? "Movie" : "TV Show"}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed max-w-4xl">{content.overview}</p>
            </div>

            {relatedAnime.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <ContentRow title="Other Seasons & Series" items={relatedAnime} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
