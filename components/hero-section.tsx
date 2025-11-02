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

    trailerRefs.current.forEach((iframe, i) => {
      if (!iframe) return
      const src = iframe.src
      iframe.src = ""
      if (i === index && items[i].trailer) {
        iframe.src = `${items[i].trailer}?autoplay=1&mute=1`
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
      title: "Anime Adventure",
      overview: "Explore thousands of anime titles with otaku-san. Stream your favorites anytime, anywhere.",
      rating: "9.2",
      year: "2024",
      type: "Series",
      backdrop: "/placeholder.svg",
      trailer: "",
    }
    items = [placeholderItem]
  }

  return (
    <section className="relative h-[50vh] md:h-[80vh] mt-16 overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <div className="absolute inset-0">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.backdrop || item.image || "/placeholder.svg"})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              <div className="relative px-4 md:px-8 md:ml-20 h-full flex items-center">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-accent text-accent-foreground border border-accent text-xs font-bold px-3 py-1">
                      HD
                    </Badge>
                    <Badge className="bg-primary text-primary-foreground border border-primary text-xs font-bold px-3 py-1">
                      Trending
                    </Badge>
                  </div>

                  <h1 className="text-4xl md:text-7xl font-bold text-balance leading-tight">{item.title}</h1>

                  <div className="flex items-center gap-4 text-xs md:text-sm font-semibold flex-wrap">
                    <span className="text-accent text-base md:text-lg">★ {item.rating}</span>
                    <span className="text-muted-foreground">{item.year}</span>
                    <span className="text-muted-foreground">{item.type}</span>
                  </div>

                  <p className="text-sm md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl line-clamp-2 md:line-clamp-4">
                    {item.overview}
                  </p>

                  <div className="flex items-center gap-2 md:gap-4 pt-2 md:pt-4 flex-wrap">
                    <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-6 md:px-10 font-bold border border-accent text-sm md:text-lg">
                        <Play className="h-4 w-4 md:h-6 md:w-6 fill-current" />
                        Play Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className={`gap-2 font-bold border text-sm md:text-base px-4 md:px-6 ${isSaved ? "border-accent bg-accent/20 text-accent" : "border-border text-foreground"}`}
                      onClick={handleSaveToggle}
                    >
                      {isSaved ? (
                        <>
                          <Check className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="hidden sm:inline">Saved</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 md:h-5 md:w-5" />
                          <span className="hidden sm:inline">Bookmark</span>
                        </>
                      )}
                    </Button>
                  </div>

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
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-primary/60 hover:bg-primary text-white p-2 md:p-3 rounded-full transition-all border border-primary"
      >
        <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-primary/60 hover:bg-primary text-white p-2 md:p-3 rounded-full transition-all border border-primary"
      >
        <ChevronRight className="h-5 w-5 md:h-7 md:w-7" />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
