"use client"

import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
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
    <section className="relative mt-16 pt-12 pb-20">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                {/* Left Content */}
                <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
                  <div className="flex items-center gap-2">
                    <span className="text-accent text-sm md:text-base font-bold">#{selectedIndex + 1}</span>
                    <span className="text-muted-foreground text-sm">Spotlight</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                    {item.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-card border border-border text-foreground text-xs">● TV</Badge>
                    <Badge className="bg-card border border-border text-foreground text-xs">● 24m</Badge>
                    <Badge className="bg-card border border-border text-foreground text-xs">■ {item.year}</Badge>
                    <Badge className="bg-card border border-border text-foreground text-xs">HD</Badge>
                    <Badge className="bg-card border border-border text-foreground text-xs">SUB</Badge>
                    <Badge className="bg-card border border-border text-foreground text-xs">DUB</Badge>
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty line-clamp-3 md:line-clamp-4">
                    {item.overview}
                  </p>

                  <div className="flex items-center gap-3 pt-4">
                    <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 md:px-8 font-bold border border-primary text-sm md:text-base">
                        <Play className="h-4 w-4 fill-current" />
                        Watch Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="gap-2 font-bold border border-border text-foreground hover:bg-secondary text-sm md:text-base px-6 bg-transparent"
                    >
                      Detail
                    </Button>
                  </div>
                </div>

                {/* Right Artwork */}
                <div className="relative order-1 lg:order-2 h-64 md:h-96 lg:h-full">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary/60 hover:bg-primary text-white p-2 md:p-3 rounded-full transition-all border border-primary"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary/60 hover:bg-primary text-white p-2 md:p-3 rounded-full transition-all border border-primary"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </section>
  )
}
