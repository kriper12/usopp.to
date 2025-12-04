"use client"

import type React from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault()
    const searchTerm = query || searchQuery.trim()
    if (searchTerm) {
      // Add to recent searches
      const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
      setShowRecentSearches(false)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Menu & Logo - Left */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/otaku-san-logo.png" alt="sayori.to Logo" width={32} height={32} className="object-contain" />
              <span className="hidden sm:inline text-lg font-bold text-foreground">sayori.to</span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 w-full">
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search anime..."
                className="flex-1 bg-secondary border border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowRecentSearches(true)}
              />
              <Button type="button" variant="outline" className="border-border hover:bg-secondary bg-transparent">
                Filter
              </Button>
              {showRecentSearches && recentSearches.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-w-md">
                  <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={(e) => handleSearch(e as any, search)}
                        className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-semibold">Join now</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-primary hover:bg-primary/80 text-white rounded-md"
                >
                  <span className="text-xs font-bold">D</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <span className="text-xs font-bold">T</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                >
                  <span className="text-xs font-bold">R</span>
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">|</span>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                EN
              </Button>
            </div>

            {/* Login Button */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold hidden md:inline-flex">
              Login
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              My library
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              Schedule
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              Manga
            </Link>
            <Link
              href="/home"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              Home
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              AniList
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
