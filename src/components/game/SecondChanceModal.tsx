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
      <Card className="flex flex-col items-center gap-4 p-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Shield size={48} strokeWidth={2.5} className="text-accent" />
        </motion.div>

        <h3 className="font-heading font-800 text-xl">Second Chance !</h3>
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-700">{playerName}</span> a pioché un doublon ({duplicateValue}).
          <br />
          Utiliser la Second Chance pour annuler ?
        </p>

        <div className="flex gap-3">
          <Button variant="primary" onClick={onUse}>
            Utiliser
          </Button>
          <Button variant="danger" onClick={onDecline}>
            Non (Bust)
          </Button>
        </div>
      </Card>
    </Modal>
  )
}
