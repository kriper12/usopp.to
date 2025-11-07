"use client"

import type React from "react"
import { Search, Bell, User, Menu, X, Globe } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [titleLanguage, setTitleLanguage] = useState<"english" | "japanese">("english")
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("titleLanguage") as "english" | "japanese" | null
    if (savedLanguage) {
      setTitleLanguage(savedLanguage)
    }
  }, [])

  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault()
    const searchTerm = query || searchQuery.trim()
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const toggleLanguage = () => {
    const newLanguage = titleLanguage === "english" ? "japanese" : "english"
    setTitleLanguage(newLanguage)
    localStorage.setItem("titleLanguage", newLanguage)
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="otaku-san Logo" width={40} height={40} className="object-contain" />
            </Link>
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-accent transition-colors hidden sm:block"
            >
              otaku-san
            </Link>
          </div>

          {/* Center Navigation - Hidden on Mobile */}

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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hidden md:flex"
                  title="Toggle title language"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                <DropdownMenuItem
                  onClick={() => {
                    setTitleLanguage("english")
                    localStorage.setItem("titleLanguage", "english")
                  }}
                  className={titleLanguage === "english" ? "bg-accent/20" : ""}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTitleLanguage("japanese")
                    localStorage.setItem("titleLanguage", "japanese")
                  }}
                  className={titleLanguage === "japanese" ? "bg-accent/20" : ""}
                >
                  Japanese
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              href="/continue-watching"
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
              href="/tv-shows"
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
