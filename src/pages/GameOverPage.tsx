import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Crown, RotateCcw, Play } from 'lucide-react'
import confetti from 'canvas-confetti'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { useGameStore } from '@/store/gameStore'

const bounceEase = [0.34, 1.56, 0.64, 1] as const

export default function GameOverPage() {
  const navigate = useNavigate()
  const { session, resetGame, createSession } = useGameStore()
  const confettiFired = useRef(false)

  useEffect(() => {
    if (!session) {
      navigate('/')
      return
    }
    if (!confettiFired.current) {
      confettiFired.current = true
      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [session, navigate])

  if (!session) return null

  const sortedPlayers = [...session.players].sort(
    (a, b) => b.totalScore - a.totalScore,
  )
  const winner = sortedPlayers[0]!

  const handleReplay = () => {
    const names = session!.players.map((p) => p.name)
    createSession(names)
    navigate('/round')
  }

  const handleNewGame = () => {
    resetGame()
    navigate('/')
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center px-4 py-8 overflow-hidden">
      {/* Winner announcement */}
      <motion.div
        className="flex flex-col items-center gap-4 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'tween', ease: bounceEase, duration: 0.6 }}
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 5, -5, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Crown size={64} strokeWidth={2.5} className="text-tertiary" />
        </motion.div>

        <h1 className="font-heading font-800 text-4xl text-center">
          <span className="text-accent">{winner.name}</span>
          <br />
          <span className="text-secondary">remporte la partie !</span>
        </h1>

        <div className="flex items-center gap-2">
          <span className="font-heading font-800 text-5xl text-accent">
            {winner.totalScore}
          </span>
          <span className="text-muted-foreground font-600 text-lg">points</span>
        </div>
      </motion.div>

      {/* Podium / Rankings */}
      <div className="w-full max-w-md flex flex-col gap-3 mb-8">
        {sortedPlayers.map((player, rank) => {
          const playerIdx = session.players.findIndex(
            (p) => p.id === player.id,
          )
          const medals = ['bg-tertiary', 'bg-[#C0C0C0]', 'bg-[#CD7F32]']
          const medalBg = rank < 3 ? medals[rank] : undefined

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'tween',
                ease: bounceEase,
                duration: 0.3,
                delay: 0.3 + rank * 0.1,
              }}
            >
              <Card
                className={
                  rank === 0
                    ? 'border-tertiary bg-tertiary/10'
                    : ''
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center font-heading font-800 text-sm ${
                      medalBg ? `${medalBg} text-white` : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {rank + 1}
                  </div>
                  <Avatar name={player.name} index={playerIdx} size="md" />
                  <span className="font-heading font-700 flex-1">{player.name}</span>
                  <span className="font-heading font-800 text-xl">
                    {player.totalScore}
                    <span className="text-xs text-muted-foreground ml-1">pts</span>
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Round history summary */}
      <Card className="w-full max-w-md mb-8 overflow-x-auto">
        <h3 className="font-heading font-700 text-sm mb-3">Historique</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1 font-600 text-muted-foreground">Tour</th>
              {session.players.map((p) => (
                <th key={p.id} className="text-center py-1 font-600 text-muted-foreground">
                  {p.name.slice(0, 6)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {session.roundHistory.map((round) => (
              <tr key={round.round} className="border-b border-border/50">
                <td className="py-1 font-600">{round.round}</td>
                {session.players.map((p) => {
                  const score =
                    round.scores.find((s) => s.playerId === p.id)?.score ?? 0
                  return (
                    <td
                      key={p.id}
                      className={`text-center py-1 font-600 ${
                        score === 0
                          ? 'text-secondary'
                          : score > 20
                            ? 'text-accent'
                            : ''
                      }`}
                    >
                      {score}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleReplay}
          icon={<Play size={20} strokeWidth={2.5} />}
        >
          Rejouer
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleNewGame}
          icon={<RotateCcw size={20} strokeWidth={2.5} />}
        >
          Nouvelle partie
        </Button>
      </div>
    </div>
  )
}
