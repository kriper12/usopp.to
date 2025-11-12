"use client"

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
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {genres.map((genre) => (
        <button
          key={genre}
          className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-colors whitespace-nowrap border border-border hover:border-primary"
        >
          {genre}
        </button>
      ))}
    </div>
  )
}
