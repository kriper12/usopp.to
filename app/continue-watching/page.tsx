"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { getContinueWatching, removeFromContinueWatching, type ContinueWatchingItem } from "@/lib/continue-watching"
import Link from "next/link"
import Image from "next/image"
import { Play, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContinueWatchingPage() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([])

  useEffect(() => {
    setItems(getContinueWatching())
  }, [])

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromContinueWatching(id)
    setItems(getContinueWatching())
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-20 px-8 pt-24 pb-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Continue Watching</h1>
            <p className="text-muted-foreground">Pick up where you left off</p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No items yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start watching anime to see them here. Your progress will be saved automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <Link
                    href={`/watch/${item.anilistId}?type=${item.type}`}
                    className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary hover:ring-2 hover:ring-accent transition-all block"
                  >
                    <Image
                      src={item.posterPath || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />

                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-secondary/50">
                      <div className="h-full bg-accent transition-all" style={{ width: `${item.progress}%` }} />
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" fill="white" />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={(e) => handleRemove(item.id, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                      {Math.round(item.progress)}%
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{item.title}</h3>
                    {item.type === "tv" && item.episode && (
                      <p className="text-xs text-muted-foreground">
                        Episode {item.episode} • {item.subOrDub === "dub" ? "Dub" : "Sub"}
                      </p>
                    )}
                    {item.type === "movie" && item.subOrDub && (
                      <p className="text-xs text-muted-foreground">{item.subOrDub === "dub" ? "Dub" : "Sub"}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
