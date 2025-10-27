import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Suspense fallback={<div className="text-center text-muted-foreground">Searching...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  )
}
