import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  external?: boolean
  className?: string
  withIcon?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_10px_30px_-10px_rgba(242,106,79,0.6)] hover:bg-accent-600 hover:-translate-y-0.5',
  secondary:
    'bg-primary text-white shadow-[0_10px_30px_-10px_rgba(14,138,122,0.55)] hover:bg-primary-600 hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-foreground border border-border hover:border-primary hover:text-primary',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

export function CtaButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  external = true,
  className = '',
  withIcon = true,
}: Props) {
  const isAnchor = href.startsWith('#')
  const rel = external && !isAnchor ? 'noopener noreferrer' : undefined
  const target = external && !isAnchor ? '_blank' : undefined
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      {withIcon && !isAnchor ? <ArrowUpRight className="w-4 h-4" aria-hidden /> : null}
    </a>
  )
}
