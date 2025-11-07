"use client"

import type React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { ContentItem } from "@/lib/anilist"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { saveToMyRovex, removeFromMyRovex, isInMyRovex } from "@/lib/my-rovex"

export function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q")
  const [results, setResults] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set())
  const [searchInput, setSearchInput] = useState(query || "")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchResults = async (page: number) => {
    if (!query) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`)
      const data = await response.json()
      setResults(data.results || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  useEffect(() => {
    fetchResults(currentPage)
  }, [query, currentPage])

  useEffect(() => {
    const saved = new Set(results.filter((item) => isInMyRovex(item.id)).map((item) => item.id))
    setSavedItems(saved)
  }, [results])

  const toggleSave = (item: ContentItem) => {
    if (savedItems.has(item.id)) {
      removeFromMyRovex(item.id)
      setSavedItems((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    } else {
      saveToMyRovex(item)
      setSavedItems((prev) => new Set(prev).add(item.id))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Search for Anime</h1>
        <p className="text-muted-foreground">Enter a search term to find anime</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Searching for "{query}"...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">No results found</h1>
        <p className="text-muted-foreground">Try searching for something else</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Search Results for "{query}" <span className="text-muted-foreground text-xl">({results.length})</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {results.map((item) => (
          <Link
            key={item.id}
            href={`/anime/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}
            className="group"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary mb-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link href={`/anime/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                  <Button
                    size="icon"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 w-12 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </Button>
                </Link>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-accent/90 text-accent-foreground border border-accent/50 text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                  {item.rating}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">{item.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <span>{item.year}</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-accent">★ {item.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
