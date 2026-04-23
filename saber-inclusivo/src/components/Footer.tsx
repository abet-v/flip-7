import { footer, brand } from '../data/content'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white">
            <Sparkles className="w-5 h-5" aria-hidden />
          </span>
          {brand.name}
        </div>
        <div className="text-sm text-muted-foreground max-w-md">
          <p>{footer.note}</p>
          <p className="mt-1">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
