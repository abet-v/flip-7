import { motion } from 'framer-motion'
import { Snowflake, Shuffle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameCard as GameCardType } from '@/types/game'

interface GameCardProps {
  card: GameCardType
  faceDown?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  delay?: number
  animate?: boolean
}

const sizeStyles = {
  sm: 'w-14 h-20 text-2xl',
  md: 'w-20 h-28 text-4xl',
  lg: 'w-24 h-36 text-5xl',
}

const numberCardColors: Record<number, string> = {
  0: '#DBEAFE',
  1: '#93C5FD',
  2: '#60A5FA',
  3: '#22D3EE',
  4: '#2DD4BF',
  5: '#4ADE80',
  6: '#A3E635',
  7: '#FACC15',
  8: '#FB923C',
  9: '#F97316',
  10: '#EF4444',
  11: '#F472B6',
  12: '#A855F7',
}

const lightValues = new Set([0, 6, 7])

const actionIcons = {
  freeze: Snowflake,
  'flip-three': Shuffle,
  'second-chance': Shield,
}

const actionLabels = {
  freeze: 'Freeze',
  'flip-three': 'Flip 3',
  'second-chance': '2nd Chance',
}

const actionBgColors = {
  freeze: 'bg-secondary',
  'flip-three': 'bg-quaternary',
  'second-chance': 'bg-accent',
}

export default function GameCard({
  card,
  faceDown = false,
  size = 'md',
  className,
  delay = 0,
  animate = true,
}: GameCardProps) {
  const content = () => {
    if (faceDown) {
      return (
        <div className="w-full h-full bg-accent pattern-dots rounded-[14px] flex items-center justify-center">
          <span className="text-white/60 font-heading font-800 text-lg">7</span>
        </div>
      )
    }

    if (card.type === 'number') {
      const bgColor = numberCardColors[card.value] ?? '#FFFFFF'
      const isLight = lightValues.has(card.value)
      return (
        <div
          className="w-full h-full rounded-[14px] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <span
            className={cn('font-heading font-800', isLight ? 'text-foreground' : 'text-white')}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              WebkitTextStroke: '1px',
            }}
          >
            {card.value}
          </span>
        </div>
      )
    }

    if (card.type === 'modifier') {
      return (
        <div className="w-full h-full bg-tertiary rounded-[14px] flex items-center justify-center">
          <span className="font-heading font-700 text-foreground text-center leading-tight">
            {card.modifier}
          </span>
        </div>
      )
    }

    if (card.type === 'action' && card.action) {
      const Icon = actionIcons[card.action]
      const label = actionLabels[card.action]
      const bgColor = actionBgColors[card.action]

      return (
        <div
          className={cn(
            'w-full h-full rounded-[14px] flex flex-col items-center justify-center gap-1',
            bgColor,
          )}
        >
          <Icon size={size === 'sm' ? 16 : size === 'md' ? 22 : 28} strokeWidth={2.5} className="text-white" />
          <span className="font-heading font-700 text-white text-[10px] leading-tight">
            {label}
          </span>
        </div>
      )
    }

    return null
  }

  const card3d = (
    <div
      className={cn(
        'border-2 border-foreground rounded-[16px] shadow-hard-sm overflow-hidden select-none',
        sizeStyles[size],
        className,
      )}
    >
      {content()}
    </div>
  )

  if (!animate) return card3d

  return (
    <motion.div
      initial={{ scale: 0, rotateY: faceDown ? 0 : 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{
        type: 'tween',
        ease: [0.34, 1.56, 0.64, 1],
        duration: 0.4,
        delay,
      }}
      style={{ perspective: 800 }}
    >
      {card3d}
    </motion.div>
  )
}
