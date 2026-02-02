import { cn } from '@/lib/utils'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'accent' | 'secondary' | 'tertiary' | 'quaternary'
}

const variantStyles: Record<string, string> = {
  default: 'bg-white',
  accent: 'bg-accent text-white',
  secondary: 'bg-secondary text-white',
  tertiary: 'bg-tertiary text-foreground',
  quaternary: 'bg-quaternary text-foreground',
}

export default function Card({ children, variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'border-2 border-foreground rounded-[16px] shadow-hard p-4',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
