"use client"

import type React from "react"
import { Search, Bell, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/otaku-san-logo.png" alt="otaku-san Logo" width={36} height={36} className="object-contain" />
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-accent transition-colors hidden sm:block"
            >
              otaku-san
            </Link>
          </div>

          {/* Center Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My library
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Schedule
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Manga
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AniList
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200 relative w-full sm:w-auto"
              >
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search anime..."
                  className="w-full sm:w-64 bg-secondary border border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowRecentSearches(true)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setShowRecentSearches(false)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Recent Searches Dropdown */}
                {showRecentSearches && recentSearches.length > 0 && (
                  <div className="absolute top-full mt-2 w-full sm:w-64 bg-card border border-border rounded-lg shadow-lg left-0 z-50">
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
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          clearRecentSearches()
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors border-t border-border pt-2 mt-2"
                      >
                        Clear history
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground relative hidden md:flex"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hidden md:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                <DropdownMenuItem asChild>
                  <Link href="/continue-watching" className="cursor-pointer">
                    Continue Watching
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-rovex" className="cursor-pointer">
                    My List
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              href="/"
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            >
              Discover
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
