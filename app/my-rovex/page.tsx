"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { getSavedItems, removeItem, type SavedItem } from "@/lib/my-rovex"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, X } from "lucide-react"
import Link from "next/link"

export default function MyRovexPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  useEffect(() => {
    setSavedItems(getSavedItems())
  }, [])

  const handleRemove = (id: number, type: "Movie" | "Series") => {
    removeItem(id, type)
    setSavedItems(getSavedItems())
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-20 pt-24 px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My List</h1>
          <p className="text-muted-foreground">Your saved movies and TV shows</p>
        </div>

        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No saved items yet</h2>
            <p className="text-muted-foreground mb-6">Start adding movies and TV shows to your list</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse Content</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
            {savedItems.map((item) => (
              <Card
                key={`${item.type}-${item.id}`}
                className="relative bg-card border-border overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-[2/3]">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/watch/${item.id}?type=${item.type === "Movie" ? "movie" : "tv"}`}>
                      <Button
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-12"
                      >
                        <Play className="h-5 w-5 fill-current" />
                      </Button>
                    </Link>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(item.id, item.type)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/90 text-primary-foreground border-0 text-xs font-bold"
                    >
                      {item.rating}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1 text-balance">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
