"use client"

import type React from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
            href={`/anime/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}
            className="group relative flex-shrink-0 w-40 h-56 rounded-xl overflow-hidden bg-secondary hover:ring-2 hover:ring-accent transition-all shadow-lg hover:shadow-xl"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <section className="relative group/row">
      {title && (
        <div className="px-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
      )}

      <div className="relative px-8">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-primary/90 hover:bg-primary text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
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
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-primary/90 hover:bg-primary text-foreground opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
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

  const rating = Number.parseFloat(item.rating)

  return (
    <Card
      className="relative flex-shrink-0 w-48 bg-background border border-border/30 overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-20 hover:-translate-y-3 hover:shadow-2xl rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-background">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-100 group-hover:opacity-90 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent to-accent/80 rounded-full border border-accent/50 shadow-lg backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-white fill-white" />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 transition-all duration-300">
            <div className="flex items-center justify-center gap-3">
              <Link href={`/anime/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                <Button
                  size="icon"
                  className="h-12 w-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                >
                  <Play className="h-5 w-5 fill-current" />
                </Button>
              </Link>
              <Button
                size="icon"
                className={`rounded-full h-12 w-12 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 ${
                  isSaved
                    ? "bg-accent/20 border-2 border-accent text-accent hover:bg-accent/30"
                    : "bg-white/15 border-2 border-white/30 text-white hover:bg-white/25"
                }`}
                onClick={handleSaveToggle}
              >
                {isSaved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3 bg-gradient-to-b from-background/80 to-background">
        <h3 className="font-bold text-foreground line-clamp-2 text-sm leading-snug group-hover:text-accent transition-colors duration-300">
          {item.title}
        </h3>

        <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
          <div className="flex items-center gap-3">
            <span className="inline-block px-2 py-1 bg-primary/30 text-primary text-xs font-semibold rounded-md border border-primary/50">
              {item.type}
            </span>
            <span className="text-xs text-muted-foreground font-medium">{item.year}</span>
          </div>
          {item.overview && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
