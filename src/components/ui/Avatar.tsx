import { cn } from '@/lib/utils'

const COLORS = [
  'bg-accent',
  'bg-secondary',
  'bg-tertiary',
  'bg-quaternary',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
]

const BG_CLASSES = [
  'bg-accent',
  'bg-secondary',
  'bg-tertiary',
  'bg-quaternary',
  'bg-[#FF6B6B]',
  'bg-[#4ECDC4]',
  'bg-[#45B7D1]',
  'bg-[#96CEB4]',
]

interface AvatarProps {
  name: string
  index: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

export default function Avatar({ name, index, size = 'md', className }: AvatarProps) {
  const bgClass = BG_CLASSES[index % BG_CLASSES.length]!
  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        'rounded-full border-2 border-foreground flex items-center justify-center',
        'font-heading font-700 text-white select-none shrink-0',
        bgClass,
        sizeStyles[size],
        className,
      )}
    >
      {initial}
    </div>
  )
}
