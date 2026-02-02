import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import GameCard from './GameCard'
import type { GameCard as GameCardType } from '@/types/game'

interface BustOverlayProps {
  playerName: string
  bustCard?: GameCardType
  onContinue: () => void
}

export default function BustOverlay({ playerName, bustCard, onContinue }: BustOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white border-2 border-foreground rounded-[16px] shadow-hard p-8 flex flex-col items-center gap-4 max-w-sm w-full"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'tween',
          ease: [0.34, 1.56, 0.64, 1],
          duration: 0.4,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, -10, 0],
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <XCircle size={64} strokeWidth={2.5} className="text-secondary" />
        </motion.div>

        <h3 className="font-heading font-800 text-2xl text-secondary">BUST !</h3>

        {bustCard && (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{
              type: 'tween',
              ease: [0.34, 1.56, 0.64, 1],
              duration: 0.4,
              delay: 0.2,
            }}
            style={{ perspective: 800 }}
          >
            <GameCard card={bustCard} size="lg" animate={false} className="border-secondary" />
          </motion.div>
        )}

        <p className="text-center text-muted-foreground">
          <span className="font-700">{playerName}</span> a un doublon
          {bustCard?.type === 'number' && (
            <>
              {' '}: <span className="font-800 text-secondary text-lg">{bustCard.value}</span>
            </>
          )}
          {' '}!
          <br />
          Score du tour : <span className="font-700 text-secondary">0</span>
        </p>

        <Button variant="secondary" onClick={onContinue}>
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  )
}
