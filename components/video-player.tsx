"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addToContinueWatching, getContinueWatching } from "@/lib/continue-watching"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface VideoPlayerProps {
  contentId: string
  isMovie: boolean
  episodeCount?: number
  title: string
  posterPath: string
}

const getVideoSource = (anilistId: string, isMovie: boolean, episode?: number, subOrDub = "sub"): string => {
  if (isMovie) {
    return `https://vidnest.fun/anime/${anilistId}/1/${subOrDub}`
  }
  return `https://vidnest.fun/anime/${anilistId}/${episode}/${subOrDub}`
}

export default function VideoPlayer({ contentId, isMovie, episodeCount = 12, title, posterPath }: VideoPlayerProps) {
  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    if (typeof window === "undefined" || isMovie) return 1
    const items = getContinueWatching()
    const existingItem = items.find((item) => item.anilistId === contentId)
    return existingItem?.episode || 1
  })

  const [subOrDub, setSubOrDub] = useState<"sub" | "dub">(() => {
    if (typeof window === "undefined") return "sub"
    const items = getContinueWatching()
    const existingItem = items.find((item) => item.anilistId === contentId)
    return existingItem?.subOrDub || "sub"
  })

  const [markedAsWatched, setMarkedAsWatched] = useState(false)
  const [iframeUrl, setIframeUrl] = useState("")

  useEffect(() => {
    const url = getVideoSource(contentId, isMovie, isMovie ? undefined : selectedEpisode, subOrDub)
    setIframeUrl(url)
  }, [contentId, isMovie, selectedEpisode, subOrDub])

  useEffect(() => {
    const watchId = isMovie ? `movie-${contentId}` : `tv-${contentId}`

    addToContinueWatching({
      id: watchId,
      anilistId: contentId,
      title,
      type: isMovie ? "movie" : "tv",
      posterPath,
      progress: 0,
      timestamp: Date.now(),
      episode: isMovie ? undefined : selectedEpisode,
      subOrDub,
    })

    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      if (progress <= 95 && !markedAsWatched) {
        addToContinueWatching({
          id: watchId,
          anilistId: contentId,
          title,
          type: isMovie ? "movie" : "tv",
          posterPath,
          progress: Math.min(progress, 95),
          timestamp: Date.now(),
          episode: isMovie ? undefined : selectedEpisode,
          subOrDub,
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [contentId, isMovie, selectedEpisode, title, posterPath, markedAsWatched, subOrDub])

  const handleMarkAsWatched = () => {
    const watchId = isMovie ? `movie-${contentId}` : `tv-${contentId}`

    addToContinueWatching({
      id: watchId,
      anilistId: contentId,
      title,
      type: isMovie ? "movie" : "tv",
      posterPath,
      progress: 100,
      timestamp: Date.now(),
      episode: isMovie ? undefined : selectedEpisode,
      subOrDub,
    })

    setMarkedAsWatched(true)
  }

  return (
    <div className="space-y-4">
      {!isMovie && (
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Episode:</label>
            <Select value={selectedEpisode.toString()} onValueChange={(value) => setSelectedEpisode(Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                  <SelectItem key={ep} value={ep.toString()}>
                    Episode {ep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Audio:</label>
            <Select value={subOrDub} onValueChange={(value) => setSubOrDub(value as "sub" | "dub")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub">Sub</SelectItem>
                <SelectItem value="dub">Dub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsWatched}
            disabled={markedAsWatched}
            className="ml-auto bg-transparent"
          >
            <Check className="h-4 w-4 mr-2" />
            {markedAsWatched ? "Marked as Watched" : "Mark as Watched"}
          </Button>
        </div>
      )}

      {isMovie && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Audio:</label>
            <Select value={subOrDub} onValueChange={(value) => setSubOrDub(value as "sub" | "dub")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub">Sub</SelectItem>
                <SelectItem value="dub">Dub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={handleMarkAsWatched} disabled={markedAsWatched}>
            <Check className="h-4 w-4 mr-2" />
            {markedAsWatched ? "Marked as Watched" : "Mark as Watched"}
          </Button>
        </div>
      )}

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {iframeUrl && (
          <iframe
            key={iframeUrl}
            src={iframeUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
    </div>
  )
}
