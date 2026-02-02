import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  icon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white',
  secondary: 'bg-transparent text-foreground hover:bg-tertiary',
  success: 'bg-quaternary text-foreground',
  danger: 'bg-secondary text-white',
  ghost: 'bg-transparent text-foreground border-transparent shadow-none',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4.5 text-xl gap-3',
}

const bounceEase = [0.34, 1.56, 0.64, 1] as const

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2, x: -2 }}
      whileTap={disabled ? undefined : { y: 2, x: 2 }}
      transition={{ type: 'tween', ease: bounceEase, duration: 0.2 }}
      className={cn(
        'inline-flex items-center justify-center font-heading font-700 rounded-full',
        'border-2 border-foreground shadow-hard cursor-pointer select-none',
        'transition-shadow duration-150',
        'hover:shadow-hard-hover active:shadow-hard-active',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-hard',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...(props as any)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}
