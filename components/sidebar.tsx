"use client"

import { Home, Tv, Bookmark, Clock, Settings, MoreVertical, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Tv, label: "Anime", href: "/tv-shows" },
    { icon: Bookmark, label: "Bookmarks", href: "/my-rovex" },
    { icon: Clock, label: "History", href: "/continue-watching" },
  ]

  const bottomItems = [
    { icon: Settings, label: "Settings", href: "/" },
    { icon: MoreVertical, label: "More", href: "/" },
  ]

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden sm:flex fixed left-0 top-0 w-20 h-screen bg-background border-r border-border flex-col items-center py-6 gap-8 pt-24">
        {/* Main Menu */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </Link>
          ))}
        </nav>

        {/* Bottom Menu */}
        <nav className="flex flex-col gap-4 mt-auto mb-6">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 z-40">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </nav>
    </>
  )
}
