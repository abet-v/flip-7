import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import GameCard from './GameCard'
import DeckPile from './DeckPile'
import type { GameCard as GameCardType } from '@/types/game'

interface DealingViewProps {
  playerName: string
  deckCount: number
  lastDealtCard: GameCardType | null
  onDealNext: () => void
  dealingComplete: boolean
  hasPendingAction: boolean
}

export default function DealingView({
  playerName,
  deckCount,
  lastDealtCard,
  onDealNext,
  dealingComplete,
  hasPendingAction,
}: DealingViewProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (dealingComplete || hasPendingAction) return

    timerRef.current = setTimeout(() => {
      onDealNext()
    }, 900)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dealingComplete, hasPendingAction, onDealNext, deckCount])

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-heading font-800 text-xl">Distribution initiale</h2>

      <div className="flex items-center gap-8">
        <DeckPile cardsLeft={deckCount} />

        <motion.div
          className="flex flex-col items-center gap-2"
          key={`${playerName}-${lastDealtCard?.id}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-heading font-700 text-lg">{playerName}</p>
          {lastDealtCard && (
            <GameCard card={lastDealtCard} size="lg" delay={0.1} />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
