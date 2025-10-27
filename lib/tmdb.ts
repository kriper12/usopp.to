// TMDB API configuration and helper functions

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface TMDBMovie {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  media_type?: "movie" | "tv"
  overview: string
}

export interface ContentItem {
  id: number
  title: string
  image: string
  backdrop: string
  rating: string
  year: string
  type: string
  overview?: string
}

export function getImageUrl(path: string | null, size: "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder.svg?height=750&width=500"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function transformTMDBToContentItem(item: TMDBMovie): ContentItem {
  const isMovie = item.media_type === "movie" || item.title !== undefined
  const title = item.title || item.name || "Untitled"
  const releaseDate = item.release_date || item.first_air_date || ""
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : "2024"

  return {
    id: item.id,
    title,
    image: getImageUrl(item.poster_path),
    backdrop: getImageUrl(item.backdrop_path, "original"),
    rating: item.vote_average.toFixed(1),
    year,
    type: isMovie ? "Movie" : "Series",
    overview: item.overview,
  }
}

export async function fetchFromTMDB(endpoint: string) {
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY is not configured. Please add it to your environment variables.")
    return null
  }

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getTrending(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/trending/all/week")
    if (!data) return []
    return data.results.slice(0, 12).map(transformTMDBToContentItem)
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}

export async function getPopularTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/tv/popular")
    if (!data) return []
    return data.results.slice(0, 12).map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "tv" }))
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    return []
  }
}

export async function getPopularMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/movie/popular")
    if (!data) return []
    return data.results
      .slice(0, 12)
      .map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "movie" }))
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return []
  }
}

export async function getMovieDetails(id: number): Promise<ContentItem | null> {
  try {
    const data = await fetchFromTMDB(`/movie/${id}`)
    if (!data) return null
    return transformTMDBToContentItem({ ...data, media_type: "movie" })
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

export async function getTVShowDetails(id: number): Promise<ContentItem | null> {
  try {
    const data = await fetchFromTMDB(`/tv/${id}`)
    if (!data) return null
    return transformTMDBToContentItem({ ...data, media_type: "tv" })
  } catch (error) {
    console.error("Error fetching TV show details:", error)
    return null
  }
}

export async function getTVShowSeasons(id: number) {
  try {
    const data = await fetchFromTMDB(`/tv/${id}`)
    if (!data) return null

    return {
      seasons:
        data.seasons
          ?.filter((season: any) => season.season_number > 0)
          .map((season: any) => ({
            seasonNumber: season.season_number,
            name: season.name,
            episodeCount: season.episode_count,
          })) || [],
    }
  } catch (error) {
    console.error("Error fetching TV show seasons:", error)
    return null
  }
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number) {
  try {
    const data = await fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`)
    if (!data) return []

    return (
      data.episodes?.map((episode: any) => ({
        episodeNumber: episode.episode_number,
        name: episode.name,
        overview: episode.overview,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching season episodes:", error)
    return []
  }
}

export async function getTopRatedTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/tv/top_rated")
    if (!data) return []
    return data.results.slice(0, 12).map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "tv" }))
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error)
    return []
  }
}

export async function getTrendingTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/trending/tv/week")
    if (!data) return []
    return data.results.slice(0, 12).map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "tv" }))
  } catch (error) {
    console.error("Error fetching trending TV shows:", error)
    return []
  }
}

export async function getOnTheAirTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/tv/on_the_air")
    if (!data) return []
    return data.results.slice(0, 12).map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "tv" }))
  } catch (error) {
    console.error("Error fetching on the air TV shows:", error)
    return []
  }
}

export async function getAiringTodayTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/tv/airing_today")
    if (!data) return []
    return data.results.slice(0, 12).map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "tv" }))
  } catch (error) {
    console.error("Error fetching airing today TV shows:", error)
    return []
  }
}

export async function getTopRatedMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/movie/top_rated")
    if (!data) return []
    return data.results
      .slice(0, 12)
      .map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "movie" }))
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return []
  }
}

export async function getTrendingMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/trending/movie/week")
    if (!data) return []
    return data.results
      .slice(0, 12)
      .map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "movie" }))
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return []
  }
}

export async function getNowPlayingMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/movie/now_playing")
    if (!data) return []
    return data.results
      .slice(0, 12)
      .map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "movie" }))
  } catch (error) {
    console.error("Error fetching now playing movies:", error)
    return []
  }
}

export async function getUpcomingMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromTMDB("/movie/upcoming")
    if (!data) return []
    return data.results
      .slice(0, 12)
      .map((item: TMDBMovie) => transformTMDBToContentItem({ ...item, media_type: "movie" }))
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    return []
  }
}
