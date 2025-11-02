import Link from "next/link"
import { Heart, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-16">
      <div className="container mx-auto px-8 py-12 ml-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-foreground">otaku-san</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your ultimate anime streaming destination. Discover, watch, and enjoy thousands of anime series and movies
              with seamless streaming and curated collections.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-4 w-4 text-accent" />
                <span className="font-semibold">Anime First</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-semibold">Always Updated</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Browse</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tv-shows" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Anime Series
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/my-rovex" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  My Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 otaku-san. All content aggregated from third-party sources.
            </p>
            <p className="text-xs text-muted-foreground">
              otaku-san does not host any content. All streams are provided by third parties.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
