import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import type { Player, PlayerRoundState } from '@/types/game'

interface ScoreBoardProps {
  players: Player[]
  roundStates: PlayerRoundState[]
  currentPlayerIndex: number
  dealerIndex: number
}

export default function ScoreBoard({
  players,
  roundStates,
  currentPlayerIndex,
  dealerIndex,
}: ScoreBoardProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 px-1 pr-4 py-1 min-w-min">
        {players.map((player, idx) => {
          const rs = roundStates[idx]
          const isCurrent = idx === currentPlayerIndex
          const isDealer = idx === dealerIndex

          return (
            <div
              key={player.id}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full border-2 border-foreground',
                'bg-white shadow-[2px_2px_0px_var(--color-foreground)] shrink-0',
                isCurrent && 'border-accent bg-accent/10',
                rs?.isBusted && 'opacity-50 grayscale',
                rs?.isFrozen && 'opacity-70',
                rs?.hasStayed && !rs?.isFrozen && 'bg-quaternary/10',
              )}
            >
              <Avatar name={player.name} index={idx} size="sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-heading font-700 text-xs leading-none">
                    {player.name}
                  </span>
                  {isDealer && (
                    <Star size={12} strokeWidth={2.5} className="text-tertiary fill-tertiary" />
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground font-600 leading-none mt-0.5">
                  {player.totalScore} pts
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
