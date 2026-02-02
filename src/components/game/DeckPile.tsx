import { motion } from 'framer-motion'

interface DeckPileProps {
  cardsLeft: number
}

export default function DeckPile({ cardsLeft }: DeckPileProps) {
  const layers = Math.min(cardsLeft, 4)

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="relative w-20 h-28">
        {Array.from({ length: layers }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 w-20 h-28 bg-accent pattern-dots border-2 border-foreground rounded-[16px]"
            style={{
              top: -i * 2,
              left: -i * 2,
              zIndex: layers - i,
            }}
            initial={false}
            animate={{ top: -i * 2, left: -i * 2 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/60 font-heading font-800 text-2xl">7</span>
            </div>
          </motion.div>
        ))}
      </div>
      <span className="text-xs font-600 text-muted-foreground">
        {cardsLeft} carte{cardsLeft !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
