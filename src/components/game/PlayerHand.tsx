import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import GameCard from './GameCard'
import type { PlayerRoundState } from '@/types/game'

interface PlayerHandProps {
  state: PlayerRoundState
  playerName: string
  isCurrentPlayer?: boolean
  compact?: boolean
}

export default function PlayerHand({
  state,
  playerName,
  isCurrentPlayer = false,
  compact = false,
}: PlayerHandProps) {
  const isOut = state.isBusted || state.isFrozen
  const stayed = state.hasStayed && !state.isFrozen
  const cardSize = compact ? 'sm' : 'md'

  return (
    <motion.div
      className={cn(
        'rounded-[16px] border-2 border-foreground p-3 transition-all',
        isOut && 'opacity-50 grayscale',
        stayed && 'border-quaternary bg-quaternary/5',
        isCurrentPlayer && !isOut && !stayed && 'border-accent bg-accent/5',
        !isCurrentPlayer && !isOut && !stayed && 'bg-white',
      )}
      layout
    >
      {/* Player name + status */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading font-700 text-sm">{playerName}</span>
        <div className="flex items-center gap-1.5">
          <AnimatePresence>
            {state.hasSecondChance && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent text-white text-xs font-700 rounded-full border-2 border-foreground second-chance-glow"
              >
                <Shield size={14} strokeWidth={2.5} />
                2nd Chance
              </motion.span>
            )}
          </AnimatePresence>
          {state.isBusted && (
            <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-700 rounded-full border border-foreground">
              BUST
            </span>
          )}
          {state.isFrozen && (
            <span className="px-2 py-0.5 bg-[#60A5FA] text-white text-[10px] font-700 rounded-full border border-foreground">
              FROZEN
            </span>
          )}
          {stayed && (
            <span className="px-2 py-0.5 bg-quaternary text-foreground text-[10px] font-700 rounded-full border border-foreground">
              STAY
            </span>
          )}
          <span className="text-xs text-muted-foreground font-600">
            {state.numberCards.length}/7
          </span>
        </div>
      </div>

      {/* Modifier cards (small, on top) */}
      {state.modifierCards.length > 0 && (
        <div className="flex gap-1 mb-1.5">
          {state.modifierCards.map((card) => (
            <GameCard key={card.id} card={card} size="sm" animate={false} />
          ))}
        </div>
      )}

      {/* Number cards row */}
      <div className="flex gap-1 flex-wrap">
        {state.numberCards.map((card, i) => (
          <GameCard
            key={card.id}
            card={card}
            size={cardSize}
            delay={i * 0.05}
          />
        ))}
        {state.numberCards.length === 0 && (
          <div className={cn(
            'border-2 border-dashed border-border rounded-[16px] flex items-center justify-center text-muted-foreground text-xs',
            compact ? 'w-14 h-20' : 'w-20 h-28',
          )}>
            —
          </div>
        )}
      </div>
    </motion.div>
  )
}
