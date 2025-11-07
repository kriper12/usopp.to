import { getAnimeDetails } from "@/lib/anilist"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

interface AnimeDetailsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}

export default async function AnimeDetailsPage({ params, searchParams }: AnimeDetailsPageProps) {
  const { id } = await params
  const { type } = await searchParams
  const isMovie = type === "movie"

  const anime = await getAnimeDetails(Number.parseInt(id))

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Anime not found</h1>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      {/* Main content with left margin for sidebar */}
      <main className="ml-20 pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="relative h-96 overflow-hidden bg-gradient-to-b from-primary/20 to-background">
          {anime.backdrop && (
            <Image src={anime.backdrop || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 h-72 rounded-lg overflow-hidden border border-border shadow-lg">
              <Image
                src={anime.image || "/placeholder.svg"}
                alt={anime.title}
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">{anime.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-accent text-accent-foreground border border-accent">★ {anime.rating}</Badge>
                    <Badge variant="secondary">{anime.year}</Badge>
                    <Badge variant="secondary">{anime.type}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{anime.overview}</p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link href={`/watch/${id}?type=${type || "tv"}`}>
                  <Button
                    size="lg"
                    className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 font-bold"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-muted-foreground uppercase text-xs">Format</h3>
              <p className="text-lg font-bold text-foreground">{anime.type}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-muted-foreground uppercase text-xs">Release Year</h3>
              <p className="text-lg font-bold text-foreground">{anime.year}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-muted-foreground uppercase text-xs">Rating</h3>
              <p className="text-lg font-bold text-accent">★ {anime.rating}/10</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
