import { motion } from 'framer-motion'
import { Snowflake } from 'lucide-react'
import Button from '@/components/ui/Button'

interface FreezeOverlayProps {
  playerName: string
  score: number
  onContinue: () => void
}

export default function FreezeOverlay({ playerName, score, onContinue }: FreezeOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#60A5FA] border-2 border-foreground rounded-[16px] shadow-hard p-8 flex flex-col items-center gap-4 max-w-sm w-full"
        initial={{ scale: 0, rotate: 5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'tween',
          ease: [0.34, 1.56, 0.64, 1],
          duration: 0.4,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 1.5, ease: 'linear' }}
        >
          <Snowflake size={64} strokeWidth={2.5} className="text-white" />
        </motion.div>

        <h3 className="font-heading font-800 text-2xl text-white">FREEZE !</h3>
        <p className="text-center text-white/90">
          <span className="font-700">{playerName}</span> est gelé(e) !
          <br />
          Score conservé : <span className="font-700">{score}</span>
        </p>

        <Button variant="secondary" onClick={onContinue} className="bg-white text-[#60A5FA]">
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  )
}
