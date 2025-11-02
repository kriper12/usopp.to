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
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/watch/${item.anilistId}?type=${item.type}`}
          className="group relative flex-shrink-0 w-80 h-48 rounded-lg overflow-hidden bg-secondary hover:ring-2 hover:ring-accent transition-all"
        >
          <Image
            src={item.posterPath || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="h-12 w-12 text-white" fill="white" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={(e) => handleRemove(item.id, e)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
            {item.type === "tv" && item.episode && (
              <p className="text-xs text-white/80 mt-1">
                Episode {item.episode} • {item.subOrDub === "dub" ? "Dub" : "Sub"}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div className="h-full bg-accent transition-all" style={{ width: `${item.progress}%` }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
