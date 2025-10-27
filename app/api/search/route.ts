import { type NextRequest, NextResponse } from "next/server"
import { searchAnime } from "@/lib/anilist"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const results = await searchAnime(query)
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search content" }, { status: 500 })
  }
}
