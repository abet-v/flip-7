import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import ScoreBoard from '@/components/game/ScoreBoard'
import PlayerTurnView from '@/components/game/PlayerTurnView'
import PlayerHand from '@/components/game/PlayerHand'
import DealingView from '@/components/game/DealingView'
import ActionCardModal from '@/components/game/ActionCardModal'
import SecondChanceModal from '@/components/game/SecondChanceModal'
import BustOverlay from '@/components/game/BustOverlay'
import FlipSevenOverlay from '@/components/game/FlipSevenOverlay'
import FreezeOverlay from '@/components/game/FreezeOverlay'
import { useGameStore } from '@/store/gameStore'
import { calculateScore } from '@/lib/utils'
import type { GameCard } from '@/types/game'

type Overlay =
  | { type: 'bust'; playerName: string }
  | { type: 'flip-seven'; playerName: string; score: number }
  | { type: 'freeze'; playerName: string; score: number }
  | null

export default function RoundPage() {
  const navigate = useNavigate()
  const {
    session,
    hitPlayer,
    stayPlayer,
    advanceToNextPlayer,
    dealNextCard,
    resolveDealingAction,
    skipDealingAction,
    resolveActionCard,
    resolveFlipThreeCard,
    skipFlipThreeAction,
    useSecondChance,
    endRound,
    setRoundPhase,
    resetGame,
  } = useGameStore()

  const [confirmQuit, setConfirmQuit] = useState(false)
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [lastDealtCard, setLastDealtCard] = useState<GameCard | null>(null)
  const [drawnCard, setDrawnCard] = useState<GameCard | null>(null)
  const [actionBusy, setActionBusy] = useState(false)
  const [showSecondChance, setShowSecondChance] = useState(false)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Debug mode — 5 taps on "Tour X"
  const [debugMode, setDebugMode] = useState(false)
  const debugTapRef = useRef(0)
  const debugTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleDebugTap = useCallback(() => {
    debugTapRef.current++
    if (debugTimerRef.current) clearTimeout(debugTimerRef.current)
    if (debugTapRef.current >= 5) {
      setDebugMode((prev) => !prev)
      debugTapRef.current = 0
      return
    }
    debugTimerRef.current = setTimeout(() => { debugTapRef.current = 0 }, 1500)
  }, [])

  const forceNextCard = useCallback((action: 'freeze' | 'flip-three') => {
    useGameStore.setState((state) => {
      if (!state.session) return {}
      const deck = [...state.session.deck]
      const idx = deck.findIndex((c) => c.type === 'action' && c.action === action)
      if (idx !== -1) {
        const [card] = deck.splice(idx, 1)
        deck.push(card!)
      }
      return { session: { ...state.session, deck } }
    })
  }, [])

  // Redirect if no session
  useEffect(() => {
    if (!session) navigate('/')
  }, [session, navigate])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [])

  if (!session) return null

  const {
    players,
    roundStates,
    currentPlayerIndex,
    dealerIndex,
    roundPhase,
    pendingAction,
    flipThreeState,
    currentRound,
  } = session

  const currentPlayer = players[currentPlayerIndex]!
  const currentRoundState = roundStates[currentPlayerIndex]!

  // Handle round end
  useEffect(() => {
    if (roundPhase === 'round-end' && !overlay) {
      endRound()
      const s = useGameStore.getState().session
      if (s?.status === 'game-over') {
        navigate('/game-over')
      } else if (s?.status === 'round-summary') {
        navigate('/round-summary')
      }
    }
  }, [roundPhase, overlay, endRound, navigate])

  // Dealing phase
  const handleDealNext = useCallback(() => {
    const card = dealNextCard()
    if (card) setLastDealtCard(card)
  }, [dealNextCard])

  const isDealingComplete = roundPhase !== 'dealing'

  // Hit handler — advances to next player after a brief delay
  const handleHit = useCallback(() => {
    if (actionBusy) return
    setActionBusy(true)

    const prevState = { ...currentRoundState }
    const card = hitPlayer()

    if (!card) {
      setActionBusy(false)
      return
    }

    setDrawnCard(card)

    // Check result after hit
    const store = useGameStore.getState()
    const newState = store.session!.roundStates[currentPlayerIndex]!

    if (card.type === 'number') {
      // Second chance triggered
      if (store.session!.pendingAction && store.session!.roundPhase === 'resolving-action') {
        setShowSecondChance(true)
        setActionBusy(false)
        return
      }

      // Bust
      if (newState.isBusted) {
        setOverlay({ type: 'bust', playerName: currentPlayer.name })
        return
      }

      // Flip 7
      if (newState.hasFlipSeven && !prevState.hasFlipSeven) {
        const score = calculateScore(newState)
        setOverlay({ type: 'flip-seven', playerName: currentPlayer.name, score })
        return
      }
    }

    if (card.type === 'action' && (card.action === 'freeze' || card.action === 'flip-three')) {
      // Action card modal will show via pendingAction
      setDrawnCard(null)
      setActionBusy(false)
      return
    }

    // Normal card drawn (number without bust/flip7, modifier, second-chance)
    // Advance to next player after brief delay so card is visible
    advanceTimerRef.current = setTimeout(() => {
      setDrawnCard(null)
      setActionBusy(false)
      advanceToNextPlayer()
    }, 1800)
  }, [actionBusy, currentRoundState, hitPlayer, currentPlayerIndex, currentPlayer, advanceToNextPlayer])

  // Stay handler
  const handleStay = useCallback(() => {
    stayPlayer()
    advanceToNextPlayer()
  }, [stayPlayer, advanceToNextPlayer])

  // Overlay dismiss handlers
  const handleBustContinue = useCallback(() => {
    setOverlay(null)
    setDrawnCard(null)
    setActionBusy(false)
    // If bust happened during flip-three, clean up that state first
    const store = useGameStore.getState()
    if (store.session?.roundPhase === 'flip-three') {
      skipFlipThreeAction()
    }
    advanceToNextPlayer()
  }, [advanceToNextPlayer, skipFlipThreeAction])

  const handleFlipSevenContinue = useCallback(() => {
    setOverlay(null)
    setDrawnCard(null)
    setActionBusy(false)
    advanceToNextPlayer()
  }, [advanceToNextPlayer])

  const handleFreezeContinue = useCallback(() => {
    setOverlay(null)
    setDrawnCard(null)
    setActionBusy(false)
    advanceToNextPlayer()
  }, [advanceToNextPlayer])

  // Action card resolution
  const handleActionTarget = useCallback(
    (targetIndex: number) => {
      if (roundPhase === 'dealing') {
        const actionCard = pendingAction?.card
        resolveDealingAction(targetIndex)

        // Check if freeze → show overlay
        if (actionCard?.action === 'freeze') {
          const store = useGameStore.getState()
          const target = store.session!.roundStates[targetIndex]!
          setOverlay({
            type: 'freeze',
            playerName: players[targetIndex]!.name,
            score: target.roundScore,
          })
        }
        return
      }

      const actionCard = pendingAction?.card
      resolveActionCard(targetIndex)

      if (actionCard?.action === 'freeze') {
        const store = useGameStore.getState()
        const target = store.session!.roundStates[targetIndex]!
        setOverlay({
          type: 'freeze',
          playerName: players[targetIndex]!.name,
          score: target.roundScore,
        })
      }

      // Flip three starts automatically
    },
    [roundPhase, pendingAction, resolveDealingAction, resolveActionCard, players],
  )

  // Flip three — chain all draws in a single effect
  const flipThreeRef = useRef(false)

  useEffect(() => {
    if (roundPhase !== 'flip-three' || !flipThreeState || flipThreeRef.current)
      return

    flipThreeRef.current = true
    const targetIdx = flipThreeState.targetPlayerIndex
    let drawIndex = 0

    function drawNext() {
      const timer = setTimeout(() => {
        const store = useGameStore.getState()
        const ft = store.session?.flipThreeState
        if (!ft || ft.cardsRemaining <= 0) {
          // All done — wait then advance
          setTimeout(() => {
            skipFlipThreeAction()
            advanceToNextPlayer()
          }, 2500)
          return
        }

        const card = resolveFlipThreeCard()
        if (!card) {
          setTimeout(() => {
            skipFlipThreeAction()
            advanceToNextPlayer()
          }, 2500)
          return
        }

        drawIndex++
        const updated = useGameStore.getState()
        const targetState = updated.session!.roundStates[targetIdx]!

        if (targetState.isBusted) {
          setTimeout(() => {
            setOverlay({ type: 'bust', playerName: players[targetIdx]!.name })
          }, 800)
          return
        }

        if (targetState.hasFlipSeven && targetState.numberCards.length >= 7) {
          const score = calculateScore(targetState)
          setOverlay({ type: 'flip-seven', playerName: players[targetIdx]!.name, score })
          return
        }

        // More cards to draw? Chain next
        const ftAfter = updated.session!.flipThreeState
        if (ftAfter && ftAfter.cardsRemaining > 0) {
          drawNext()
        } else {
          // All done — wait then advance
          setTimeout(() => {
            skipFlipThreeAction()
            advanceToNextPlayer()
          }, 2500)
        }
      }, drawIndex === 0 ? 800 : 1200)
    }

    drawNext()

    return () => { flipThreeRef.current = false }
  }, [roundPhase, flipThreeState?.targetPlayerIndex, resolveFlipThreeCard, skipFlipThreeAction, advanceToNextPlayer, players])

  // Bust/flipSeven during flip-three dismissed — clean up and advance
  useEffect(() => {
    if (
      flipThreeState &&
      roundPhase === 'flip-three' &&
      !overlay &&
      flipThreeRef.current === false
    ) {
      // Overlay was just dismissed, advance now
      const store = useGameStore.getState()
      const targetState = store.session?.roundStates[flipThreeState.targetPlayerIndex]
      if (targetState?.isBusted || targetState?.hasFlipSeven) {
        const timer = setTimeout(() => {
          skipFlipThreeAction()
          advanceToNextPlayer()
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [flipThreeState, roundPhase, overlay, skipFlipThreeAction, advanceToNextPlayer])

  // Second chance handlers
  const handleUseSecondChance = useCallback(() => {
    setShowSecondChance(false)
    setDrawnCard(null)
    useSecondChance(true)
    // Drawing counted as the turn action — advance
    setTimeout(() => advanceToNextPlayer(), 500)
  }, [useSecondChance, advanceToNextPlayer])

  const handleDeclineSecondChance = useCallback(() => {
    setShowSecondChance(false)
    setDrawnCard(null)
    useSecondChance(false)
    // After declining, player is busted
    const store = useGameStore.getState()
    const state = store.session!.roundStates[currentPlayerIndex]!
    if (state.isBusted) {
      setOverlay({ type: 'bust', playerName: currentPlayer.name })
    }
  }, [useSecondChance, currentPlayerIndex, currentPlayer])

  // No eligible targets for action → skip
  const hasEligibleTargets =
    pendingAction &&
    (pendingAction.card.action === 'freeze' || pendingAction.card.action === 'flip-three') &&
    players.some(
      (_, idx) =>
        roundStates[idx]!.isActive &&
        !roundStates[idx]!.isBusted &&
        !roundStates[idx]!.isFrozen &&
        !roundStates[idx]!.hasStayed,
    )

  useEffect(() => {
    if (pendingAction && !hasEligibleTargets && !showSecondChance) {
      const timer = setTimeout(() => {
        if (roundPhase === 'dealing') {
          skipDealingAction()
        } else {
          setRoundPhase('player-turn')
          useGameStore.setState((state) => ({
            session: state.session
              ? { ...state.session, pendingAction: undefined }
              : null,
          }))
          advanceToNextPlayer()
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pendingAction, hasEligibleTargets, showSecondChance, roundPhase, skipDealingAction, setRoundPhase, advanceToNextPlayer])

  return (
    <div className="min-h-dvh bg-background flex flex-col px-6 py-4 gap-4">
      {/* Header: Round + ScoreBoard */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2
            className="font-heading font-700 text-sm text-muted-foreground select-none"
            onClick={handleDebugTap}
          >
            Tour {currentRound}{debugMode && ' 🐛'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {session.deck.length} cartes restantes
            </span>
            {!confirmQuit ? (
              <button
                onClick={() => setConfirmQuit(true)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                aria-label="Quitter la partie"
              >
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => { resetGame(); navigate('/') }}
                onBlur={() => setConfirmQuit(false)}
                className="px-2.5 py-1 rounded-full bg-secondary text-white text-[11px] font-heading font-700 border border-foreground shadow-hard-sm cursor-pointer"
                autoFocus
              >
                Quitter ?
              </motion.button>
            )}
          </div>
        </div>
        <ScoreBoard
          players={players}
          roundStates={roundStates}
          currentPlayerIndex={currentPlayerIndex}
          dealerIndex={dealerIndex}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-col items-center gap-4">
        {/* Dealing phase */}
        {roundPhase === 'dealing' && (
          <DealingView
            playerName={players[session.dealingPlayerIndex]!.name}
            deckCount={session.deck.length}
            lastDealtCard={lastDealtCard}
            onDealNext={handleDealNext}
            dealingComplete={isDealingComplete}
            hasPendingAction={!!pendingAction}
          />
        )}

        {/* Player turn phase */}
        {(roundPhase === 'player-turn' || roundPhase === 'resolving-action') && (
          <PlayerTurnView
            player={currentPlayer}
            roundState={currentRoundState}
            deckCount={session.deck.length}
            drawnCard={drawnCard}
            onHit={handleHit}
            onStay={handleStay}
            disabled={actionBusy || roundPhase === 'resolving-action'}
          />
        )}

        {/* Flip Three phase */}
        {roundPhase === 'flip-three' && flipThreeState && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-heading font-800 text-xl text-quaternary">
              Flip Three !
            </h2>
            <p className="text-sm text-muted-foreground">
              {players[flipThreeState.targetPlayerIndex]!.name} pioche{' '}
              {flipThreeState.cardsRemaining} carte(s)...
            </p>
            <PlayerHand
              state={roundStates[flipThreeState.targetPlayerIndex]!}
              playerName={players[flipThreeState.targetPlayerIndex]!.name}
              isCurrentPlayer
            />
          </div>
        )}

        {/* Other players — compact with mini cards */}
        {(roundPhase === 'player-turn' || roundPhase === 'resolving-action') && players.length > 1 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-700 text-xs text-muted-foreground">
            Autres joueurs
          </h3>
          {players.map((player, idx) => {
            if (idx === currentPlayerIndex) return null
            const rs = roundStates[idx]!
            const isOut = rs.isBusted || rs.isFrozen
            const stayed = rs.hasStayed && !rs.isFrozen
            const score = calculateScore(rs)
            return (
              <div
                key={player.id}
                className={cn(
                  'flex items-start gap-2 px-3 py-2 rounded-2xl border border-foreground/20',
                  isOut && 'opacity-40',
                  stayed && 'bg-quaternary/5 border-quaternary/30',
                )}
              >
                <Avatar name={player.name} index={idx} size="sm" />
                <div className="flex-1 min-w-0">
                  {/* Name + status */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-600 text-xs">{player.name}</span>
                    {rs.hasSecondChance && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-accent text-white text-[9px] font-700 rounded-full leading-none second-chance-glow">
                        <Shield size={10} strokeWidth={2.5} />
                        2nd
                      </span>
                    )}
                    {rs.isBusted && (
                      <span className="px-1.5 py-0.5 bg-secondary text-white text-[9px] font-700 rounded-full leading-none">
                        BUST
                      </span>
                    )}
                    {rs.isFrozen && (
                      <span className="px-1.5 py-0.5 bg-[#60A5FA] text-white text-[9px] font-700 rounded-full leading-none">
                        FROZEN
                      </span>
                    )}
                    {stayed && (
                      <span className="px-1.5 py-0.5 bg-quaternary text-foreground text-[9px] font-700 rounded-full leading-none">
                        STAY
                      </span>
                    )}
                  </div>
                  {/* Mini cards row */}
                  <div className="flex items-center gap-0.5 mt-1 flex-wrap">
                    {rs.numberCards.map((card) => (
                      <span
                        key={card.id}
                        className="w-5 h-6 flex items-center justify-center bg-white border border-foreground/25 rounded text-[10px] font-heading font-700 text-accent leading-none"
                      >
                        {card.value}
                      </span>
                    ))}
                    {rs.modifierCards.map((card) => (
                      <span
                        key={card.id}
                        className="px-1 h-6 flex items-center justify-center bg-tertiary/60 border border-foreground/25 rounded text-[9px] font-heading font-700 leading-none"
                      >
                        {card.modifier}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Score + count */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-heading font-700 text-xs text-accent">{score}</span>
                  <span className="text-[10px] text-muted-foreground font-500">{rs.numberCards.length}/7</span>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>

      {/* Action Card Modal */}
      <AnimatePresence>
        {pendingAction &&
          hasEligibleTargets &&
          !showSecondChance &&
          (pendingAction.card.action === 'freeze' ||
            pendingAction.card.action === 'flip-three') && (
            <ActionCardModal
              open
              card={pendingAction.card}
              players={players}
              roundStates={roundStates}
              sourcePlayerIndex={pendingAction.sourcePlayerIndex}
              onSelectTarget={handleActionTarget}
            />
          )}
      </AnimatePresence>

      {/* Second Chance Modal */}
      {showSecondChance && pendingAction && (
        <SecondChanceModal
          open
          playerName={currentPlayer.name}
          duplicateValue={pendingAction.card.value ?? 0}
          onUse={handleUseSecondChance}
          onDecline={handleDeclineSecondChance}
        />
      )}

      {/* Overlays */}
      <AnimatePresence>
        {overlay?.type === 'bust' && (
          <BustOverlay
            playerName={overlay.playerName}
            bustCard={drawnCard ?? undefined}
            onContinue={handleBustContinue}
          />
        )}
        {overlay?.type === 'flip-seven' && (
          <FlipSevenOverlay
            playerName={overlay.playerName}
            score={overlay.score}
            onContinue={handleFlipSevenContinue}
          />
        )}
        {overlay?.type === 'freeze' && (
          <FreezeOverlay
            playerName={overlay.playerName}
            score={overlay.score}
            onContinue={handleFreezeContinue}
          />
        )}
      </AnimatePresence>

      {/* Debug panel */}
      {debugMode && (
        <div className="fixed bottom-4 left-4 right-4 flex gap-2 z-50">
          <button
            onClick={() => forceNextCard('freeze')}
            className="flex-1 py-2 rounded-xl bg-[#60A5FA] text-white text-xs font-heading font-700 border border-foreground shadow-hard-sm"
          >
            Next: Freeze
          </button>
          <button
            onClick={() => forceNextCard('flip-three')}
            className="flex-1 py-2 rounded-xl bg-[#A855F7] text-white text-xs font-heading font-700 border border-foreground shadow-hard-sm"
          >
            Next: Flip 3
          </button>
        </div>
      )}
    </div>
  )
}
