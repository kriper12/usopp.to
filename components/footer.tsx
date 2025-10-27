import Link from "next/link"
import { Shield, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t-4 border-primary bg-card/50">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-primary transform -rotate-2">USOPP</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your ultimate anime streaming destination! Watch thousands of anime series and movies with the brave
              sniper of the Straw Hat Pirates. Adventure awaits!
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                <span className="font-bold">Privacy First</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-bold">HD Quality</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-accent mb-4 transform -rotate-1">Browse</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tv-shows"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/my-rovex"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  My List
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-accent mb-4 transform rotate-1">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-accent mb-4 transform -rotate-1">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-semibold"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-primary/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-semibold">
              © 2025 Usopp. All content aggregated from third-party sources.
            </p>
            <p className="text-xs text-muted-foreground">
              Usopp does not host any content. All streams are provided by third parties.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
