"use client"

import type React from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useState, useEffect } from "react"
import type { ContentItem } from "@/lib/anilist"
import Link from "next/link"
import { saveItem, removeItem, isItemSaved } from "@/lib/my-rovex"

interface ContentRowProps {
  title?: string
  items: ContentItem[]
  showThumbnails?: boolean
}

const placeholderItems: ContentItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  title: "Anime Content",
  image: `/placeholder.svg?height=750&width=500&query=anime poster ${i + 1}`,
  rating: "0.0",
  year: "2024",
  type: "Movie",
  overview: "Explore anime from AniList",
}))

export function ContentRow({ title, items, showThumbnails = false }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const displayItems = items.length > 0 ? items : placeholderItems

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -800 : 800
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
          setShowLeftArrow(scrollLeft > 0)
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
      }, 300)
    }
  }

  if (showThumbnails) {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {displayItems.slice(0, 8).map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}
            className="group relative flex-shrink-0 w-40 h-56 rounded-lg overflow-hidden bg-secondary hover:ring-2 hover:ring-accent transition-all"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white">
              <p className="text-xs font-semibold line-clamp-2">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <section className="relative group/row">
      {title && (
        <div className="px-8 mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
      )}

      <div className="relative px-8">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-primary/80 hover:bg-primary/95 opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-primary/80 hover:bg-primary/95 opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </Button>
        )}
      </div>
    </section>
  )
}

function ContentCard({ item }: { item: ContentItem }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setIsSaved(isItemSaved(item.id, item.type))
  }, [item.id, item.type])

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSaved) {
      removeItem(item.id, item.type)
      setIsSaved(false)
    } else {
      saveItem({
        id: item.id,
        title: item.title,
        image: item.image,
        rating: item.rating,
        year: item.year,
        type: item.type,
        overview: item.overview,
        savedAt: Date.now(),
      })
      setIsSaved(true)
    }
  }

  return (
    <Card
      className="relative flex-shrink-0 w-40 bg-card border border-border overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:border-accent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3]">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200 bg-black/40">
            <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
              <Button
                size="icon"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-10 w-10 border border-accent transform hover:scale-110 transition-transform"
              >
                <Play className="h-4 w-4 fill-current" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              className={`${isSaved ? "bg-accent/20 border-accent text-accent" : "bg-secondary/80 border-border"} hover:bg-secondary rounded-full h-10 w-10 border transform hover:scale-110 transition-transform`}
              onClick={handleSaveToggle}
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground border border-accent text-xs font-bold"
          >
            {item.rating}
          </Badge>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-bold text-foreground line-clamp-1 text-xs text-balance">{item.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <span>{item.year}</span>
          <span>•</span>
          <span>{item.type}</span>
        </div>
      </div>
    </Card>
  )
}
