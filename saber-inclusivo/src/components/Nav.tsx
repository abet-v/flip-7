import { useEffect, useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { brand, hero } from '../data/content'
import { CtaButton } from './CtaButton'

const links = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#precos', label: 'Preços' },
  { href: '#rotina', label: 'Rotina' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? 'bg-background/85 backdrop-blur border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white">
            <Sparkles className="w-5 h-5" aria-hidden />
          </span>
          <span>{brand.name}</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <CtaButton href={hero.primaryCta.href} variant="primary" size="md" withIcon={false}>
            Comprar
          </CtaButton>
        </div>

        <button
          className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg border border-border"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open ? (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground"
              >
                {l.label}
              </a>
            ))}
            <CtaButton
              href={hero.primaryCta.href}
              variant="primary"
              size="md"
              className="mt-2 w-full"
              withIcon={false}
            >
              Comprar agora
            </CtaButton>
          </div>
        </div>
      ) : null}
    </header>
  )
}
