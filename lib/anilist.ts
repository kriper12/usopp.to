// AniList API configuration and helper functions

const ANILIST_API_URL = "https://graphql.anilist.co"

export interface AniListMedia {
  id: number
  title: {
    romaji: string
    english: string | null
    native: string
  }
  coverImage: {
    large: string
    extraLarge: string
  }
  bannerImage: string | null
  averageScore: number | null
  seasonYear: number | null
  format: string
  description: string | null
  episodes: number | null
  status: string
  nextAiringEpisode: {
    episode: number
  } | null
  genres: string[]
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
  genres: string[]
}

export function getImageUrl(url: string | null): string {
  if (!url) return "/anime-cityscape.png"
  return url
}

export function transformAniListToContentItem(item: AniListMedia): ContentItem {
  const title = item.title.english || item.title.romaji || item.title.native
  const year = item.seasonYear?.toString() || "2024"
  const type = item.format === "MOVIE" ? "Movie" : "Series"

  return {
    id: item.id,
    title,
    image: getImageUrl(item.coverImage.extraLarge || item.coverImage.large),
    backdrop:
      getImageUrl(item.bannerImage) !== "/anime-cityscape.png"
        ? getImageUrl(item.bannerImage)
        : getImageUrl(item.coverImage.extraLarge || item.coverImage.large),
    rating: item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A",
    year,
    type,
    overview: item.description?.replace(/<[^>]*>/g, "") || "",
    genres: item.genres || [],
  }
}

export async function fetchFromAniList(query: string, variables: any = {}) {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("AniList API error:", error)
    return null
  }
}

const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

const POPULAR_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

const TOP_RATED_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

const AIRING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME, status: RELEASING) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

const SEARCH_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

const DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        extraLarge
      }
      bannerImage
      averageScore
      seasonYear
      format
      description
      episodes
      genres
      status
      nextAiringEpisode {
        episode
      }
    }
  }
`

export async function getTrending(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(TRENDING_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching trending:", error)
    return []
  }
}

export async function getPopularTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(POPULAR_QUERY, { page: 1, perPage: 12 })
    console.log("[v0] Popular TV Shows data:", data)
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format !== "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching popular anime series:", error)
    return []
  }
}

// New function to get all popular anime without filtering
export async function getPopularAnime(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(POPULAR_QUERY, { page: 1, perPage: 12 })
    console.log("[v0] Popular Anime data:", data)
    if (!data?.Page?.media) return []
    return data.Page.media.map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching popular anime:", error)
    return []
  }
}

export async function getPopularMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(POPULAR_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format === "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching popular anime movies:", error)
    return []
  }
}

export async function getAnimeDetails(id: number): Promise<ContentItem | null> {
  try {
    const data = await fetchFromAniList(DETAILS_QUERY, { id })
    console.log("[v0] Anime details for ID", id, ":", data)
    if (!data?.Media) return null
    return transformAniListToContentItem(data.Media)
  } catch (error) {
    console.error("Error fetching anime details:", error)
    return null
  }
}

// For compatibility with existing code
export const getMovieDetails = getAnimeDetails
export const getTVShowDetails = getAnimeDetails

export async function getTVShowSeasons(id: number) {
  try {
    const data = await fetchFromAniList(DETAILS_QUERY, { id })
    console.log("[v0] TV Show seasons data for ID", id, ":", JSON.stringify(data, null, 2))
    if (!data?.Media) return null

    let episodes = data.Media.episodes
    console.log("[v0] Raw episodes value from AniList:", episodes)
    console.log("[v0] Anime status:", data.Media.status)
    console.log("[v0] Next airing episode:", data.Media.nextAiringEpisode)

    // If episodes is null and anime is still airing, use the next airing episode number
    if (!episodes && data.Media.nextAiringEpisode?.episode) {
      episodes = data.Media.nextAiringEpisode.episode
      console.log("[v0] Using next airing episode as count:", episodes)
    }

    // If still no episodes, use a reasonable default based on status
    if (!episodes) {
      episodes = data.Media.status === "RELEASING" ? 1000 : 12
      console.log("[v0] No episode data available, using default:", episodes)
    }

    console.log("[v0] Final episode count:", episodes)

    return {
      seasons: [
        {
          seasonNumber: 1,
          name: "Season 1",
          episodeCount: episodes,
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching anime seasons:", error)
    return null
  }
}

export async function getSeasonEpisodes(animeId: number, seasonNumber: number) {
  try {
    const data = await fetchFromAniList(DETAILS_QUERY, { id: animeId })
    console.log("[v0] Season episodes data for anime ID", animeId, ":", JSON.stringify(data, null, 2))
    if (!data?.Media) return []

    let episodeCount = data.Media.episodes
    console.log("[v0] Raw episodes value:", episodeCount)

    // If episodes is null and anime is still airing, use the next airing episode number
    if (!episodeCount && data.Media.nextAiringEpisode?.episode) {
      episodeCount = data.Media.nextAiringEpisode.episode
      console.log("[v0] Using next airing episode as count:", episodeCount)
    }

    // If still no episodes, use a reasonable default based on status
    if (!episodeCount) {
      episodeCount = data.Media.status === "RELEASING" ? 1000 : 12
      console.log("[v0] No episode data, using default:", episodeCount)
    }

    console.log("[v0] Generating", episodeCount, "episodes")

    // Generate episode list
    return Array.from({ length: episodeCount }, (_, i) => ({
      episodeNumber: i + 1,
      name: `Episode ${i + 1}`,
      overview: "",
    }))
  } catch (error) {
    console.error("Error fetching season episodes:", error)
    return []
  }
}

export async function getTopRatedTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(TOP_RATED_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format !== "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching top rated anime series:", error)
    return []
  }
}

export async function getTrendingTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(TRENDING_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format !== "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching trending anime series:", error)
    return []
  }
}

export async function getOnTheAirTVShows(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(AIRING_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format !== "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching airing anime series:", error)
    return []
  }
}

export async function getAiringTodayTVShows(): Promise<ContentItem[]> {
  return getOnTheAirTVShows()
}

export async function getTopRatedMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(TOP_RATED_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format === "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching top rated anime movies:", error)
    return []
  }
}

export async function getTrendingMovies(): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(TRENDING_QUERY, { page: 1, perPage: 12 })
    if (!data?.Page?.media) return []
    return data.Page.media.filter((item: AniListMedia) => item.format === "MOVIE").map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching trending anime movies:", error)
    return []
  }
}

export async function getNowPlayingMovies(): Promise<ContentItem[]> {
  return getPopularMovies()
}

export async function getUpcomingMovies(): Promise<ContentItem[]> {
  return getPopularMovies()
}

export async function searchAnime(query: string): Promise<ContentItem[]> {
  try {
    const data = await fetchFromAniList(SEARCH_QUERY, { search: query, page: 1, perPage: 20 })
    if (!data?.Page?.media) return []
    return data.Page.media.map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error searching anime:", error)
    return []
  }
}

const RELATED_ANIME_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        averageScore
        seasonYear
        format
        description
        episodes
        genres
      }
    }
  }
`

export async function getRelatedAnime(animeId: number, title: string): Promise<ContentItem[]> {
  try {
    // Extract base title (remove season numbers)
    const baseTitleMatch = title.match(/^([^S\d]*?)(\s*(?:Season|S)\s*\d+)?$/i)
    const baseTitle = baseTitleMatch ? baseTitleMatch[1].trim() : title

    const data = await fetchFromAniList(RELATED_ANIME_QUERY, {
      search: baseTitle,
      page: 1,
      perPage: 12,
    })

    if (!data?.Page?.media) return []

    // Filter out the current anime and return up to 12 related items
    return data.Page.media
      .filter((item: AniListMedia) => item.id !== animeId)
      .slice(0, 12)
      .map(transformAniListToContentItem)
  } catch (error) {
    console.error("Error fetching related anime:", error)
    return []
  }
}
