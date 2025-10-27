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
  title: string
  items: ContentItem[]
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

export function ContentRow({ title, items }: ContentRowProps) {
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

  return (
    <section className="relative group/row">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl font-black mb-6 text-primary transform -rotate-1 inline-block border-b-4 border-accent pb-1">
          {title}
        </h2>

        <div className="relative">
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 rounded-none bg-primary/80 hover:bg-primary/95 opacity-0 group-hover/row:opacity-100 transition-opacity border-r-2 border-accent"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-8 w-8 text-foreground" />
            </Button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onWheel={(e) => {
              // Prevent vertical scrolling inside the row
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault()
              }
              // Optional: allow vertical wheel to scroll row horizontally
              if (e.deltaY !== 0) {
                scrollRef.current?.scrollBy({
                  left: e.deltaY,
                  behavior: "smooth",
                })
              }
            }}
          >
            {displayItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>

          {showRightArrow && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 rounded-none bg-primary/80 hover:bg-primary/95 opacity-0 group-hover/row:opacity-100 transition-opacity border-l-2 border-accent"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-8 w-8 text-foreground" />
            </Button>
          )}
        </div>
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
      className="relative flex-shrink-0 w-[200px] md:w-[240px] bg-card border-2 border-primary overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 hover:border-accent hover:shadow-lg hover:shadow-accent/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3]">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-12 border-2 border-accent transform hover:scale-110 transition-transform"
              >
                <Play className="h-5 w-5 fill-current" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              className={`${isSaved ? "bg-accent/20 border-accent text-accent" : "bg-secondary/80 border-secondary"} hover:bg-secondary rounded-full h-12 w-12 border-2 transform hover:scale-110 transition-transform`}
              onClick={handleSaveToggle}
            >
              {isSaved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5 text-foreground" />}
            </Button>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground border-2 border-accent text-xs font-black transform rotate-3"
          >
            {item.rating}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-foreground line-clamp-1 text-balance">{item.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <span>{item.year}</span>
          <span>•</span>
          <span>{item.type}</span>
        </div>
      </div>
    </Card>
  )
}
