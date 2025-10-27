export interface SavedItem {
  id: number
  title: string
  image: string
  rating: string
  year: string
  type: "Movie" | "Series"
  overview: string
  savedAt: number
}

const STORAGE_KEY = "rovex_saved_items"

export function getSavedItems(): SavedItem[] {
  if (typeof window === "undefined") return []
  try {
    const items = localStorage.getItem(STORAGE_KEY)
    return items ? JSON.parse(items) : []
  } catch {
    return []
  }
}

export function saveItem(item: SavedItem): void {
  if (typeof window === "undefined") return
  try {
    const items = getSavedItems()
    const exists = items.some((i) => i.id === item.id && i.type === item.type)
    if (!exists) {
      items.unshift({ ...item, savedAt: Date.now() })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  } catch (error) {
    console.error("Failed to save item:", error)
  }
}

export function removeItem(id: number, type: "Movie" | "Series"): void {
  if (typeof window === "undefined") return
  try {
    const items = getSavedItems()
    const filtered = items.filter((item) => !(item.id === id && item.type === type))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Failed to remove item:", error)
  }
}

export function isItemSaved(id: number, type: "Movie" | "Series"): boolean {
  if (typeof window === "undefined") return false
  try {
    const items = getSavedItems()
    return items.some((item) => item.id === id && item.type === type)
  } catch {
    return false
  }
}

export function saveToMyRovex(item: {
  id: number
  title: string
  image: string
  rating: string
  year: string
  type: "Movie" | "Series"
  overview: string
}): void {
  saveItem({
    ...item,
    savedAt: Date.now(),
  })
}

export function removeFromMyRovex(id: number): void {
  if (typeof window === "undefined") return
  try {
    const items = getSavedItems()
    const filtered = items.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Failed to remove item:", error)
  }
}

export function isInMyRovex(id: number): boolean {
  if (typeof window === "undefined") return false
  try {
    const items = getSavedItems()
    return items.some((item) => item.id === id)
  } catch {
    return false
  }
}
