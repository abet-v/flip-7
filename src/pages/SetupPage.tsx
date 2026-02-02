import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Play, Settings, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { useGameStore } from '@/store/gameStore'

const bounceEase = [0.34, 1.56, 0.64, 1] as const

export default function SetupPage() {
  const navigate = useNavigate()
  const { createSession, settings, updateSettings, session } = useGameStore()
  const [players, setPlayers] = useState<string[]>(
    session?.players.map((p) => p.name) ?? [],
  )
  const [newName, setNewName] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addPlayer = () => {
    const name = newName.trim()
    if (!name || players.length >= 18) return
    setPlayers([...players, name])
    setNewName('')
    inputRef.current?.focus()
  }

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const canStart = players.length >= 2

  const handleStart = () => {
    if (players.length < 2) return
    createSession(players)
    navigate('/round')
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col px-8 pb-8">
      {/* Hero */}
      <div className="flex flex-col items-center pt-14 pb-10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', ease: bounceEase, duration: 0.5 }}
        >
          <motion.div
            className="w-4 h-4 bg-tertiary rounded-full border-2 border-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1 className="font-heading font-800 text-5xl tracking-tight">
            <span className="text-accent">FLIP</span>{' '}
            <span className="text-secondary">7</span>
          </h1>
          <motion.div
            className="w-3.5 h-3.5 bg-secondary rotate-45 border-2 border-foreground"
            animate={{ rotate: [45, 90, 45] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <p className="text-muted-foreground text-sm mt-1.5">Le jeu de cartes</p>
      </div>

      {/* Add player — simple input row, no card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="font-heading font-700 text-sm text-muted-foreground mb-2 block">
          Ajouter un joueur
        </label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Entrer un nom"
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            className="flex-1 min-w-0 px-6 py-3.5 text-base font-body bg-white border-2 border-foreground rounded-full shadow-hard focus:shadow-hard-hover focus:outline-none transition-shadow placeholder:text-muted-foreground/50 placeholder:italic"
          />
          <button
            onClick={addPlayer}
            disabled={!newName.trim() || players.length >= 18}
            className="w-12 h-12 flex items-center justify-center bg-accent text-white border-2 border-foreground rounded-full shadow-hard hover:shadow-hard-hover active:shadow-hard-active transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>

      {/* Player list */}
      <div className="mt-14 flex-1">
        {players.length === 0 ? (
          <motion.p
            className="text-center text-muted-foreground text-sm py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Ajoutez au moins 2 joueurs pour commencer
          </motion.p>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {players.map((name, idx) => (
                <motion.div
                  key={name + '-' + idx}
                  className="flex items-center gap-3 bg-white border-2 border-foreground rounded-full px-3 py-2.5 shadow-hard-sm"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0, marginTop: 0, padding: 0 }}
                  transition={{ type: 'tween', ease: bounceEase, duration: 0.3 }}
                  layout
                >
                  <Avatar name={name} index={idx} size="md" />
                  <span className="flex-1 font-heading font-600 text-base">{name}</span>
                  <button
                    onClick={() => removePlayer(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/15 transition-colors cursor-pointer"
                  >
                    <X size={16} strokeWidth={2.5} className="text-muted-foreground" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {players.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {players.length} joueur{players.length !== 1 ? 's' : ''}
            {players.length < 2 ? ' — encore ' + (2 - players.length) + ' minimum' : ' — prêts !'}
          </p>
        )}
      </div>

      {/* Settings — minimal toggle */}
      <motion.div
        className="mt-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className="flex items-center gap-2 mx-auto cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={16} strokeWidth={2.5} />
          <span className="text-sm font-500">Paramètres</span>
          <motion.div animate={{ rotate: showSettings ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} strokeWidth={2.5} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center gap-3 mt-4">
                <label className="text-sm text-muted-foreground">Score cible :</label>
                <input
                  type="number"
                  value={settings.targetScore}
                  onChange={(e) => updateSettings({ targetScore: parseInt(e.target.value) || 200 })}
                  min={50}
                  max={1000}
                  step={50}
                  className="w-24 px-3 py-2 text-center text-base font-heading font-700 bg-white border-2 border-foreground rounded-full shadow-hard-sm focus:outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Start button — full width, sticky feel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          disabled={!canStart}
          icon={<Play size={22} strokeWidth={2.5} />}
          className="w-full"
        >
          Commencer
        </Button>
      </motion.div>
    </div>
  )
}
