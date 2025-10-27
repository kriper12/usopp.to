export interface ContinueWatchingItem {
  id: string
  anilistId: string
  title: string
  type: "movie" | "tv"
  posterPath: string
  progress: number // 0-100
  timestamp: number
  season?: number
  episode?: number
  totalRuntime?: number // in minutes
  currentTime?: number // in seconds
  subOrDub?: "sub" | "dub"
}

const STORAGE_KEY = "rovex_continue_watching"
const COMPLETION_THRESHOLD = 95 // Remove items when they reach 95% completion

export function getContinueWatching(): ContinueWatchingItem[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const items: ContinueWatchingItem[] = JSON.parse(data)
    // Sort by most recently watched
    return items.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error("Error reading continue watching data:", error)
    return []
  }
}

export function addToContinueWatching(item: ContinueWatchingItem): void {
  if (typeof window === "undefined") return

  try {
    // Remove if progress is above completion threshold
    if (item.progress >= COMPLETION_THRESHOLD) {
      removeFromContinueWatching(item.id)
      return
    }

    const items = getContinueWatching()
    const existingIndex = items.findIndex((i) => i.id === item.id)

    if (existingIndex >= 0) {
      // Update existing item
      items[existingIndex] = { ...item, timestamp: Date.now() }
    } else {
      // Add new item
      items.unshift({ ...item, timestamp: Date.now() })
    }

    // Keep only the most recent 50 items
    const limitedItems = items.slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedItems))
  } catch (error) {
    console.error("Error saving continue watching data:", error)
  }
}

export function removeFromContinueWatching(id: string): void {
  if (typeof window === "undefined") return

  try {
    const items = getContinueWatching()
    const filtered = items.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error removing continue watching item:", error)
  }
}

export function updateProgress(id: string, progress: number, currentTime?: number): void {
  if (typeof window === "undefined") return

  try {
    const items = getContinueWatching()
    const item = items.find((i) => i.id === id)

    if (item) {
      item.progress = progress
      item.timestamp = Date.now()
      if (currentTime !== undefined) {
        item.currentTime = currentTime
      }

      // Remove if completed
      if (progress >= COMPLETION_THRESHOLD) {
        removeFromContinueWatching(id)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      }
    }
  } catch (error) {
    console.error("Error updating progress:", error)
  }
}
