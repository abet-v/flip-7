import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'

interface SecondChanceModalProps {
  open: boolean
  playerName: string
  duplicateValue: number
  onUse: () => void
  onDecline: () => void
}

export default function SecondChanceModal({
  open,
  playerName,
  duplicateValue,
  onUse,
  onDecline,
}: SecondChanceModalProps) {
  return (
    <Modal open={open}>
      <Card className="flex flex-col items-center gap-5 p-8 relative overflow-hidden">
        {/* Purple accent background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent pointer-events-none" />

        {/* Animated shield with glow ring */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ margin: '-12px' }}
          />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center second-chance-glow">
              <Shield size={40} strokeWidth={2.5} className="text-accent" />
            </div>
          </motion.div>
        </motion.div>

        <div className="text-center relative z-10">
          <motion.h3
            className="font-heading font-800 text-2xl text-accent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Second Chance !
          </motion.h3>
          <motion.p
            className="text-center text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="font-700 text-foreground">{playerName}</span> a pioché un doublon (
            <span className="font-800 text-secondary">{duplicateValue}</span>).
            <br />
            Utiliser la Second Chance pour défausser le doublon ?
          </motion.p>
        </div>

        <motion.div
          className="flex gap-3 w-full relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button variant="primary" onClick={onUse} className="flex-1">
            Utiliser
          </Button>
          <Button variant="danger" onClick={onDecline} className="flex-1">
            Non (Bust)
          </Button>
        </motion.div>
      </Card>
    </Modal>
  )
}
