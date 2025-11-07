"use client"

import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import type { ContinueWatchingItem } from "@/lib/continue-watching"
import { removeFromContinueWatching } from "@/lib/continue-watching"

interface CurrentlyWatchingProps {
  items: ContinueWatchingItem[]
}

export function CurrentlyWatching({ items: initialItems }: CurrentlyWatchingProps) {
  const [items, setItems] = useState(initialItems)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const handleRemove = (itemId: string) => {
    removeFromContinueWatching(itemId)
    setItems(items.filter((item) => item.id !== itemId))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_calc(100%-1rem)] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(25%-0.75rem)] min-w-0"
            >
              <div className="group relative rounded-lg overflow-hidden bg-card border border-border hover:border-accent transition-colors">
                <div className="aspect-video relative">
                  <img
                    src={item.posterPath || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/watch/${item.anilistId}?type=${item.type}`}>
                      <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Play className="h-4 w-4 fill-current" />
                        Play
                      </Button>
                    </Link>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                    <div className="h-full bg-accent transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.progress.toFixed(0)}% watched</p>
                  {item.episode && (
                    <p className="text-xs text-muted-foreground">
                      Ep {item.episode}
                      {item.season && ` • S${item.season}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 z-10 bg-primary/60 hover:bg-primary text-white p-2 rounded-full transition-all border border-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 z-10 bg-primary/60 hover:bg-primary text-white p-2 rounded-full transition-all border border-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
