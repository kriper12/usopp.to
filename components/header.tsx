"use client"

import type React from "react"

import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b-4 border-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/usopp-logo.png" alt="Usopp Logo" width={40} height={40} className="object-contain" />
              <div className="text-2xl font-black text-primary tracking-tight transform -rotate-1">USOPP</div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-bold text-foreground hover:text-accent transition-colors transform hover:-rotate-1"
              >
                Home
              </Link>
              <Link
                href="/tv-shows"
                className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors transform hover:rotate-1"
              >
                Anime
              </Link>
            </nav>
          </div>

          {/* Search, Notifications, User Menu */}
          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200"
              >
                <Input
                  type="search"
                  placeholder="Search titles..."
                  className="w-64 bg-secondary border-2 border-primary text-foreground placeholder:text-muted-foreground"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-muted-foreground hover:text-accent hover:bg-primary/20"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-accent hover:bg-primary/20"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-primary/20">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-accent hover:bg-primary/20"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-secondary border-2 border-primary">
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
          </div>
        </div>
      </div>
    </header>
  )
}
