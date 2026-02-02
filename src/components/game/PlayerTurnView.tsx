import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Hand } from 'lucide-react'
import Button from '@/components/ui/Button'
import GameCard from './GameCard'
import PlayerHand from './PlayerHand'
import DeckPile from './DeckPile'
import { calculateScore } from '@/lib/utils'
import type { Player, PlayerRoundState, GameCard as GameCardType } from '@/types/game'

interface PlayerTurnViewProps {
  player: Player
  roundState: PlayerRoundState
  deckCount: number
  drawnCard?: GameCardType | null
  onHit: () => void
  onStay: () => void
  disabled?: boolean
}

export default function PlayerTurnView({
  player,
  roundState,
  deckCount,
  drawnCard,
  onHit,
  onStay,
  disabled = false,
}: PlayerTurnViewProps) {
  const currentScore = calculateScore(roundState)
  const canAct = roundState.isActive && !roundState.hasStayed && !roundState.isBusted && !roundState.isFrozen

  // Flip animation: start face down, reveal after delay
  const [revealedCard, setRevealedCard] = useState<GameCardType | null>(null)
  const [isFaceDown, setIsFaceDown] = useState(true)

  useEffect(() => {
    if (drawnCard) {
      setRevealedCard(drawnCard)
      setIsFaceDown(true)
      const timer = setTimeout(() => setIsFaceDown(false), 350)
      return () => clearTimeout(timer)
    } else {
      setRevealedCard(null)
      setIsFaceDown(true)
    }
  }, [drawnCard])

  return (
    <motion.div
      className="flex flex-col items-center gap-5 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Current player header */}
      <div className="text-center">
        <motion.h2
          className="font-heading font-800 text-2xl"
          key={player.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'tween', ease: [0.34, 1.56, 0.64, 1], duration: 0.3 }}
        >
          Tour de {player.name}
        </motion.h2>
        <p className="text-muted-foreground text-sm mt-1">
          Score actuel : <span className="font-700 text-accent">{currentScore}</span>
          {' '}&middot;{' '}
          Total : <span className="font-600">{player.totalScore}</span>
        </p>
      </div>

      {/* Deck + Hand layout */}
      <div className="flex items-start gap-4 w-full relative">
        <DeckPile cardsLeft={deckCount} />
        <div className="flex-1 min-w-0">
          <PlayerHand
            state={roundState}
            playerName={player.name}
            isCurrentPlayer
          />
        </div>

        {/* Drawn card — 3D flip overlay centered on screen */}
        <AnimatePresence>
          {revealedCard && (
            <motion.div
              key={revealedCard.id}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: 'tween', ease: [0.34, 1.56, 0.64, 1], duration: 0.3 }}
                style={{ perspective: 600 }}
              >
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: isFaceDown ? 180 : 0 }}
                  transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                  style={{ transformStyle: 'preserve-3d', width: '80vw', aspectRatio: '2/3' }}
                  className="relative"
                >
                  {/* Front (face up) */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                    <GameCard card={revealedCard} size="lg" animate={false} className="!w-full !h-full !text-[20vw] shadow-2xl" />
                  </div>
                  {/* Back (face down) */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <GameCard card={revealedCard} faceDown size="lg" animate={false} className="!w-full !h-full !text-[20vw] shadow-2xl" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons — full width, side by side */}
      {canAct && (
        <motion.div
          className="flex gap-3 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="danger"
            size="md"
            onClick={onHit}
            disabled={disabled}
            icon={<Zap size={18} strokeWidth={2.5} />}
            className="flex-1"
          >
            Piocher
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={onStay}
            disabled={disabled}
            icon={<Hand size={18} strokeWidth={2.5} />}
            className="flex-1"
          >
            Rester
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
