"use client"

import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ContentItem } from "@/lib/anilist"
import { useCallback, useEffect, useState, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import { saveItem, removeItem, isItemSaved } from "@/lib/my-rovex"

interface HeroSectionProps {
  items: ContentItem[]
}

export function HeroSection({ items }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const trailerRefs = useRef<HTMLIFrameElement[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    setSelectedIndex(index)

    // Pause all trailers
    trailerRefs.current.forEach((iframe, i) => {
      if (!iframe) return
      const src = iframe.src
      iframe.src = "" // reset
      if (i === index && items[i].trailer) {
        iframe.src = `${items[i].trailer}?autoplay=1&mute=1` // autoplay only active slide
      }
    })
  }, [emblaApi, items])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => {
      clearInterval(autoplay)
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (items.length > 0) {
      setIsSaved(isItemSaved(items[selectedIndex].id, items[selectedIndex].type))
    }
  }, [selectedIndex, items])

  const handleSaveToggle = () => {
    if (items.length === 0) return
    const item = items[selectedIndex]

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

  if (items.length === 0) {
    const placeholderItem = {
      title: "The Quantum Paradox",
      overview:
        "When a brilliant physicist discovers a way to manipulate time, she must race against a shadowy organization to prevent the collapse of reality itself.",
      rating: "9.2",
      year: "2024",
      type: "Movie",
      backdrop: "/sci-fi-movie-scene.png",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    }
    items = [placeholderItem]
  }

  return (
    <section className="relative h-[85vh] mt-16 overflow-hidden border-b-4 border-primary">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <div className="absolute inset-0">
                <img
                  src={item.backdrop || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              <div className="relative container mx-auto px-4 lg:px-8 h-[85vh] flex items-center">
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-accent text-accent-foreground border-2 border-accent text-xs font-black px-3 py-1 transform -rotate-2"
                    >
                      HD
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-primary text-primary-foreground border-2 border-primary text-xs font-black px-3 py-1 transform rotate-1"
                    >
                      Featured
                    </Badge>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-balance leading-tight transform -rotate-1">
                    {item.title}
                  </h1>

                  <div className="flex items-center gap-4 text-sm font-bold">
                    <span className="text-accent text-lg">{item.rating}</span>
                    <span className="text-muted-foreground">{item.year}</span>
                    <span className="text-muted-foreground">{item.type}</span>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl line-clamp-3">
                    {item.overview}
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 font-black border-2 border-primary transform hover:scale-105 transition-transform"
                      >
                        <Play className="h-5 w-5 fill-current" />
                        Watch Now
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className={`gap-2 font-black border-2 transform hover:scale-105 transition-transform ${isSaved ? "border-accent bg-accent/20 text-accent" : "border-secondary bg-secondary/50 text-foreground"}`}
                      onClick={handleSaveToggle}
                    >
                      {isSaved ? (
                        <>
                          <Check className="h-5 w-5" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          My List
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Hidden iframe for autoplay trailers */}
                  {item.trailer && (
                    <iframe
                      ref={(el) => (trailerRefs.current[index] = el!)}
                      src=""
                      className="hidden"
                      title={`Trailer ${item.title}`}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all border-2 border-accent transform hover:scale-110"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all border-2 border-accent transform hover:scale-110"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 rounded-full transition-all border-2 ${
              index === selectedIndex
                ? "w-10 bg-accent border-accent"
                : "w-3 bg-white/50 border-white/50 hover:bg-white/70 hover:border-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
