import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { useGameStore } from '@/store/gameStore'

const bounceEase = [0.34, 1.56, 0.64, 1] as const

export default function RoundSummaryPage() {
  const navigate = useNavigate()
  const { session, settings, startRound } = useGameStore()

  useEffect(() => {
    if (!session) navigate('/')
  }, [session, navigate])

  if (!session) return null

  const lastRound = session.roundHistory[session.roundHistory.length - 1]
  const isGameOver = session.status === 'game-over'

  // Sort players by total score descending
  const sortedPlayers = [...session.players].sort(
    (a, b) => b.totalScore - a.totalScore,
  )

  const handleNext = () => {
    if (isGameOver) {
      navigate('/game-over')
    } else {
      startRound()
      navigate('/round')
    }
  }

  // Next dealer
  const nextDealerName = session.players[session.dealerIndex]?.name

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center px-6 py-8">
      <motion.h1
        className="font-heading font-800 text-3xl mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'tween', ease: bounceEase, duration: 0.4 }}
      >
        Fin du tour {(session.currentRound - 1)}
      </motion.h1>

      <p className="text-muted-foreground text-sm mb-6">
        Objectif : {settings.targetScore} points
      </p>

      {/* Round scores */}
      <div className="w-full max-w-md flex flex-col gap-3 mb-6">
        {sortedPlayers.map((player, rank) => {
          const roundScore =
            lastRound?.scores.find((s) => s.playerId === player.id)?.score ?? 0
          const playerIdx = session.players.findIndex(
            (p) => p.id === player.id,
          )
          const rs = session.roundStates[playerIdx]

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'tween',
                ease: bounceEase,
                duration: 0.3,
                delay: rank * 0.1,
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
                  <span className="font-heading font-800 text-xl text-muted-foreground w-8">
                    #{rank + 1}
                  </span>
                  <Avatar name={player.name} index={playerIdx} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-700">{player.name}</span>
                      {rank === 0 && (
                        <Trophy size={16} strokeWidth={2.5} className="text-tertiary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Ce tour :{' '}
                        <span
                          className={
                            roundScore > 0
                              ? 'font-700 text-quaternary'
                              : 'font-700 text-secondary'
                          }
                        >
                          {roundScore > 0 ? `+${roundScore}` : roundScore}
                        </span>
                      </span>
                      {rs?.isBusted && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-white rounded-full font-700">
                          BUST
                        </span>
                      )}
                      {rs?.isFrozen && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#60A5FA] text-white rounded-full font-700">
                          FROZEN
                        </span>
                      )}
                      {rs?.hasFlipSeven && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-accent text-white rounded-full font-700">
                          FLIP 7
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-800 text-xl">
                      {player.totalScore}
                    </span>
                    <span className="text-xs text-muted-foreground block">pts</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Next round info */}
      {!isGameOver && nextDealerName && (
        <p className="text-sm text-muted-foreground mb-4">
          Prochain donneur : <span className="font-700">{nextDealerName}</span>
        </p>
      )}

      <Button
        variant={isGameOver ? 'primary' : 'success'}
        size="lg"
        onClick={handleNext}
        icon={
          isGameOver ? (
            <Trophy size={20} strokeWidth={2.5} />
          ) : (
            <ArrowRight size={20} strokeWidth={2.5} />
          )
        }
      >
        {isGameOver ? 'Voir les résultats' : 'Tour suivant'}
      </Button>
    </div>
  )
}
