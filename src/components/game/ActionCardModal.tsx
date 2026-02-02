import { useEffect, useRef } from 'react'
import Modal from '@/components/ui/Modal'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import GameCard from './GameCard'
import { Shield } from 'lucide-react'
import { calculateScore } from '@/lib/utils'
import type { GameCard as GameCardType, Player, PlayerRoundState } from '@/types/game'

const numberCardColors: Record<number, string> = {
  0: '#DBEAFE', 1: '#93C5FD', 2: '#60A5FA', 3: '#22D3EE',
  4: '#2DD4BF', 5: '#4ADE80', 6: '#A3E635', 7: '#FACC15',
  8: '#FB923C', 9: '#F97316', 10: '#EF4444', 11: '#F472B6',
  12: '#A855F7',
}
const lightValues = new Set([0, 6, 7])

interface ActionCardModalProps {
  open: boolean
  card: GameCardType
  players: Player[]
  roundStates: PlayerRoundState[]
  sourcePlayerIndex: number
  onSelectTarget: (targetIndex: number) => void
}

const actionDescriptions: Record<string, string> = {
  freeze: 'Choisir un joueur à geler. Il garde son score actuel mais ne peut plus jouer.',
  'flip-three': 'Choisir un joueur qui devra piocher 3 cartes.',
  'second-chance': 'Vous pouvez annuler un doublon une fois.',
}

export default function ActionCardModal({
  open,
  card,
  players,
  roundStates,
  sourcePlayerIndex,
  onSelectTarget,
}: ActionCardModalProps) {
  // Keep a stable ref to onSelectTarget to avoid stale closures
  const callbackRef = useRef(onSelectTarget)
  callbackRef.current = onSelectTarget

  const eligibleTargets = card.action
    ? players
        .map((p, idx) => ({ player: p, idx, state: roundStates[idx]! }))
        .filter(({ idx, state }) => {
          if (card.action === 'freeze' || card.action === 'flip-three') {
            return (
              state.isActive &&
              !state.isBusted &&
              !state.isFrozen &&
              !state.hasStayed
            )
          }
          return false
        })
    : []

  // Stable primitive: the single target index, or -1 if not exactly one target
  const autoTargetIdx = eligibleTargets.length === 1 ? eligibleTargets[0]!.idx : -1

  // Auto-apply if only one eligible target
  useEffect(() => {
    if (!open || autoTargetIdx === -1) return

    const timer = setTimeout(() => {
      callbackRef.current(autoTargetIdx)
    }, 800)

    return () => clearTimeout(timer)
  }, [open, autoTargetIdx])

  if (!card.action) return null

  return (
    <Modal open={open}>
      <Card className="flex flex-col items-center gap-4 p-6">
        <GameCard card={card} size="lg" />

        <p className="text-center text-sm text-muted-foreground max-w-xs">
          {actionDescriptions[card.action] ?? ''}
        </p>

        {eligibleTargets.length === 1 && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Application automatique sur {eligibleTargets[0]!.player.name}...
          </p>
        )}

        {eligibleTargets.length > 1 && (
          <>
            <p className="font-heading font-700 text-sm">Choisir un joueur :</p>
            <div className="flex flex-col gap-2 w-full">
              {eligibleTargets.map(({ player, idx, state }) => {
                const score = calculateScore(state)
                return (
                  <button
                    key={player.id}
                    onClick={() => onSelectTarget(idx)}
                    className="flex items-start gap-3 w-full px-3 py-2.5 rounded-2xl border-2 border-foreground/20 bg-background hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer text-left"
                  >
                    <Avatar name={player.name} index={idx} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-700 text-sm">{player.name}</span>
                        {state.hasSecondChance && (
                          <Shield size={14} strokeWidth={2.5} className="text-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mt-1 flex-wrap">
                        {state.numberCards.map((c) => (
                          <span
                            key={c.id}
                            className="w-5 h-6 flex items-center justify-center border border-foreground/25 rounded text-[10px] font-heading font-700 leading-none"
                            style={{
                              backgroundColor: numberCardColors[c.value] ?? '#fff',
                              color: lightValues.has(c.value) ? 'var(--color-foreground)' : '#fff',
                            }}
                          >
                            {c.value}
                          </span>
                        ))}
                        {state.modifierCards.map((c) => (
                          <span
                            key={c.id}
                            className="px-1 h-6 flex items-center justify-center bg-tertiary/60 border border-foreground/25 rounded text-[9px] font-heading font-700 leading-none"
                          >
                            {c.modifier}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-heading font-800 text-sm text-accent">{score}</span>
                      <span className="text-[10px] text-muted-foreground font-500">{state.numberCards.length}/7</span>
                      <span className="text-[10px] text-muted-foreground font-600 mt-0.5">Total : {player.totalScore}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {eligibleTargets.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun joueur éligible. L'action est ignorée.
          </p>
        )}
      </Card>
    </Modal>
  )
}
