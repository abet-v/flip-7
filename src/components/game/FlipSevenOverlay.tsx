import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FlipSevenOverlayProps {
  playerName: string
  score: number
  onContinue: () => void
}

export default function FlipSevenOverlay({ playerName, score, onContinue }: FlipSevenOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-accent border-2 border-foreground rounded-[16px] shadow-hard p-8 flex flex-col items-center gap-4 max-w-sm w-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'tween',
          ease: [0.34, 1.56, 0.64, 1],
          duration: 0.5,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Sparkles size={64} strokeWidth={2.5} className="text-tertiary" />
        </motion.div>

        <h3 className="font-heading font-800 text-3xl text-white">FLIP 7 !</h3>
        <p className="text-center text-white/80">
          <span className="font-700">{playerName}</span> a 7 cartes nombre !
          <br />
          Bonus <span className="font-700 text-tertiary">+15</span> points !
          <br />
          Score du tour : <span className="font-700 text-tertiary">{score}</span>
        </p>

        <Button variant="secondary" onClick={onContinue} className="bg-white text-accent">
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  )
}
