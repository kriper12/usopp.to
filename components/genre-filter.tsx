"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const genres = [
  "Action",
  "Drama",
  "Sports",
  "Comedy",
  "Supernatural",
  "Mystery",
  "Adventure",
  "Slice of Life",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Music",
  "Psychological",
  "Thriller",
  "Mecha",
  "Horror",
]

export function GenreFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedGenre = searchParams.get("genre")
  const [selected, setSelected] = useState(selectedGenre || "")

  const handleGenreClick = (genre: string) => {
    if (selected === genre) {
      setSelected("")
      router.push("/?genre=")
    } else {
      setSelected(genre)
      router.push(`/?genre=${encodeURIComponent(genre)}`)
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleGenreClick(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
            selected === genre
              ? "bg-accent text-accent-foreground border-accent shadow-lg"
              : "text-muted-foreground bg-transparent border-border hover:text-foreground hover:bg-primary/20 hover:border-primary"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}
