"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getContinueWatching, type ContinueWatchingItem, removeFromContinueWatching } from "@/lib/continue-watching"
import Link from "next/link"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContinueWatchingRow() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([])

  useEffect(() => {
    const data = getContinueWatching().map((item) => ({
      ...item,
      progress: Math.min(Math.max(item.progress, 0), 100),
    }))
    setItems(data)
  }, [])

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromContinueWatching(id)
    setItems(getContinueWatching())
  }

  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Continue Watching</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.anilistId}?type=${item.type}`}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary hover:ring-2 hover:ring-primary transition-all"
          >
            <Image
              src={item.posterPath || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/50">
              <div className="h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="h-12 w-12 text-white" fill="white" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => handleRemove(item.id, e)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-2 right-2 text-white">
              <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
              {item.type === "tv" && item.episode && (
                <p className="text-xs text-white/80">
                  Episode {item.episode} • {item.subOrDub === "dub" ? "Dub" : "Sub"}
                </p>
              )}
              {item.type === "movie" && item.subOrDub && (
                <p className="text-xs text-white/80">{item.subOrDub === "dub" ? "Dub" : "Sub"}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
